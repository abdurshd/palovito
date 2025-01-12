package com.palovito.restaurant.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
// import java.util.Map;
// import java.util.concurrent.ConcurrentHashMap;
import java.util.UUID;
import java.time.Instant;
import java.util.concurrent.CompletableFuture;
import com.palovito.restaurant.model.Order;
import com.palovito.restaurant.model.OrderStatus;
import com.palovito.restaurant.model.Menu;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import java.time.Duration;
import java.util.List;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Value;
import com.palovito.restaurant.model.OrderRequest;
import com.palovito.restaurant.model.OrderItem;
import com.palovito.restaurant.entity.OrderEntity;
import com.palovito.restaurant.repository.OrderRepository;
import com.palovito.restaurant.repository.OrderRedisRepository;
// import com.palovito.restaurant.service.OrderRedisService;
import com.palovito.restaurant.mapper.OrderMapper;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

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
    
    @Value("${order.processing.initial-delay:5000}")
    private long initialDelay;
    
    @Value("${order.processing.completion-delay:10000}")
    private long completionDelay;
    
    @Transactional
    @Scheduled(fixedRate = 24 * 60 * 60 * 1000) // Run daily
    public void cleanupOldOrders() {
        Instant cutoff = Instant.now().minus(Duration.ofDays(1));
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
            
            OrderItem orderItem = new OrderItem(menu, item.getQuantity());
            orderItems.add(orderItem);
            total += menu.getPrice().doubleValue() * item.getQuantity();
        }

        Order order = new Order(
            UUID.randomUUID().toString(),
            orderItems,
            OrderStatus.RECEIVED,
            Instant.now(),
            total
        );
        
        // Save to database
        OrderEntity entity = orderMapper.toEntity(order);
        orderRepository.save(entity);
        
        // Save to Redis
        orderRedisRepository.save(order);
        
        messagingTemplate.convertAndSend("/topic/orders", order);
        
        CompletableFuture.runAsync(() -> processOrder(order));
        return order;
    }
    
    private void processOrder(Order order) {
        CompletableFuture.runAsync(() -> {
            try {
                log.info("Starting order processing - ID: {}", order.getId());
                Thread.sleep(initialDelay);
                
                // Get fresh order from database
                Order currentOrder = getOrder(order.getId());
                if (currentOrder != null && currentOrder.getStatus() == OrderStatus.RECEIVED) {
                    currentOrder.setStatus(OrderStatus.PROCESSING);
                    orderRepository.save(orderMapper.toEntity(currentOrder));
                    redisService.saveOrder(currentOrder);
                    messagingTemplate.convertAndSend("/topic/orders/update", currentOrder);
                }
            } catch (InterruptedException e) {
                log.error("Order processing interrupted - ID: {}", order.getId(), e);
                Thread.currentThread().interrupt();
            }
        });
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