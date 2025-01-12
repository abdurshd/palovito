package com.palovito.restaurant.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.UUID;
import com.palovito.restaurant.model.Order;
import com.palovito.restaurant.model.OrderStatus;
import com.palovito.restaurant.model.Menu;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import java.time.Duration;
import java.util.List;
import java.util.ArrayList;
import com.palovito.restaurant.model.OrderRequest;
import com.palovito.restaurant.model.OrderItem;
import com.palovito.restaurant.entity.OrderEntity;
import com.palovito.restaurant.repository.OrderRepository;
import com.palovito.restaurant.repository.OrderRedisRepository;
import com.palovito.restaurant.mapper.OrderMapper;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {
    private final SimpMessagingTemplate messagingTemplate;
    private final MenuService menuService;
    private final OrderRedisService redisService;
    private final OrderRepository orderRepository;
    private final OrderRedisRepository orderRedisRepository;
    private final OrderMapper orderMapper;
    
    @Transactional
    @Scheduled(fixedRate = 24 * 60 * 60 * 1000) // Run daily
    public void cleanupOldOrders() {
        String cutoff = LocalDateTime.now()
            .minus(Duration.ofDays(1))
            .format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        
        // First delete order items
        orderRepository.deleteOrderItemsByTimestampBefore(cutoff);
        
        // Then delete orders
        orderRepository.deleteByTimestampBefore(cutoff);
    }
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll().stream()
            .map(orderMapper::toModel)
            .collect(Collectors.toList());
    }
    
    public Order createOrder(OrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        double total = 0.0;

        for (OrderRequest.OrderItem item : request.getItems()) {
            Menu menu = menuService.getMenu(item.getMenuId());
            if (menu == null) {
                throw new IllegalArgumentException("Menu item not found: " + item.getMenuId());
            }
            
            OrderItem orderItem = new OrderItem(UUID.randomUUID().toString(), menu, item.getQuantity());
            orderItems.add(orderItem);
            total += menu.getPrice().doubleValue() * item.getQuantity();
        }

        Order order = Order.builder()
            .id(UUID.randomUUID().toString())
            .items(orderItems)
            .status(OrderStatus.RECEIVED)
            .timestamp(LocalDateTime.now().toString())
            .total(total)
            .build();
        
        // Save to database
        OrderEntity entity = orderMapper.toEntity(order);
        orderRepository.save(entity);
        
        // Save to Redis
        orderRedisRepository.save(order);
        
        messagingTemplate.convertAndSend("/topic/orders", order);
        
        return order;
    }
    
    public Order getOrder(String orderId) {
        // Try Redis first
        Optional<Order> order = orderRedisRepository.findById(orderId);
        if (order.isPresent()) {
            return order.get();
        }
        
        // Fallback to PostgreSQL
        return orderRepository.findById(orderId)
            .map(orderMapper::toModel)
            .orElse(null);
    }
    
    public Order updateOrderStatus(String orderId, OrderStatus newStatus) {
        Order order = getOrder(orderId);
        if (order != null) {
            order.setStatus(newStatus);
            orderRepository.save(orderMapper.toEntity(order));
            redisService.saveOrder(order);
            messagingTemplate.convertAndSend("/topic/orders/update", order);
            return order;
        }
        return null;
    }
    
    public Order updateOrderQuantity(String orderId, String menuId, int newQuantity) {
        Order order = getOrder(orderId);
        if (order != null && order.getStatus() != OrderStatus.COMPLETED) {
            if (newQuantity <= 0) {
                throw new IllegalArgumentException("Quantity must be greater than 0");
            }
            
            OrderItem itemToUpdate = order.getItems().stream()
                .filter(item -> item.getMenu().getId().equals(menuId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found in order"));
            
            itemToUpdate.setQuantity(newQuantity);
            
            // Recalculate total
            double total = order.getItems().stream()
                .mapToDouble(item -> item.getMenu().getPrice().doubleValue() * item.getQuantity())
                .sum();
            order.setTotal(total);
            
            // Save updates
            orderRepository.save(orderMapper.toEntity(order));
            redisService.saveOrder(order);
            messagingTemplate.convertAndSend("/topic/orders/update", order);
            
            return order;
        }
        return null;
    }
    
    public Order cancelOrder(String orderId) {
        Order order = getOrder(orderId);
        if (order != null && order.getStatus() != OrderStatus.COMPLETED) {
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(orderMapper.toEntity(order));
            redisService.saveOrder(order);
            messagingTemplate.convertAndSend("/topic/orders/update", order);
            log.info("Order cancelled - ID: {}", orderId);
            return order;
        }
        return null;
    }
}