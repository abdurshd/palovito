package com.palovito.restaurant.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
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
import com.palovito.restaurant.service.OrderRedisService;
import com.palovito.restaurant.mapper.OrderMapper;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {
    private final Map<String, Order> orders = new ConcurrentHashMap<>();
    private final Map<String, CompletableFuture<?>> processingOrders = new ConcurrentHashMap<>();
    private final Map<String, Boolean> manuallyUpdatedOrders = new ConcurrentHashMap<>();
    private final SimpMessagingTemplate messagingTemplate;
    private final MenuService menuService;
    private final OrderRedisService redisService;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    
    @Value("${order.processing.initial-delay:5000}")
    private long initialDelay;
    
    @Value("${order.processing.completion-delay:10000}")
    private long completionDelay;
    
    @Scheduled(fixedRate = 24 * 60 * 60 * 1000) // Run daily
    public void cleanupOldOrders() {
        Instant cutoff = Instant.now().minus(Duration.ofDays(1));
        orders.entrySet().removeIf(entry -> 
            Instant.parse(entry.getValue().getTimestamp()).isBefore(cutoff));
    }
    
    public List<Order> getAllOrders() {
        return new ArrayList<>(orders.values());
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
            Instant.now().toString(),
            total
        );
        
        orders.put(order.getId(), order);
        manuallyUpdatedOrders.put(order.getId(), false);
        
        // Save to Redis for immediate access
        redisService.saveOrder(order);
        
        // Async save to PostgreSQL
        CompletableFuture.runAsync(() -> {
            OrderEntity entity = orderMapper.toEntity(order);
            orderRepository.save(entity);
        });
        
        messagingTemplate.convertAndSend("/topic/orders", order);
        
        if (!manuallyUpdatedOrders.get(order.getId())) {
            CompletableFuture.runAsync(() -> processOrder(order));
        }
        return order;
    }
    
    private void processOrder(Order order) {
        CompletableFuture<?> future = CompletableFuture.runAsync(() -> {
            try {
                log.info("Starting order processing - ID: {}", order.getId());
                Thread.sleep(initialDelay);
                
                if (!manuallyUpdatedOrders.get(order.getId()) && 
                    orders.get(order.getId()).getStatus() == OrderStatus.RECEIVED) {
                    order.setStatus(OrderStatus.PROCESSING);
                    orders.put(order.getId(), order);
                    log.info("Order status updated to PROCESSING - ID: {}", order.getId());
                    messagingTemplate.convertAndSend("/topic/orders/update", order);
                }
            } catch (InterruptedException e) {
                log.error("Order processing interrupted - ID: {}", order.getId(), e);
                Thread.currentThread().interrupt();
            } finally {
                processingOrders.remove(order.getId());
            }
        });
        processingOrders.put(order.getId(), future);
    }
    
    public Order getOrder(String orderId) {
        // Try Redis first
        Order order = redisService.getOrder(orderId);
        if (order != null) {
            return order;
        }
        
        // Fallback to PostgreSQL
        return orderRepository.findById(orderId)
            .map(orderMapper::toModel)
            .orElse(null);
    }
    
    public Order updateOrderStatus(String orderId, OrderStatus newStatus) {
        Order order = orders.get(orderId);
        if (order != null) {
            order.setStatus(newStatus);
            orders.put(orderId, order);
            messagingTemplate.convertAndSend("/topic/orders/update", order);
            log.info("Order status updated - ID: {}, New Status: {}", orderId, newStatus);
            return order;
        }
        return null;
    }
    
    public Order updateOrderQuantity(String orderId, String menuId, int newQuantity) {
        Order order = orders.get(orderId);
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
            
            orders.put(orderId, order);
            messagingTemplate.convertAndSend("/topic/orders/update", order);
            log.info("Order quantity updated - ID: {}, Menu: {}, New Quantity: {}", orderId, menuId, newQuantity);
            return order;
        }
        return null;
    }
    
    public Order cancelOrder(String orderId) {
        Order order = orders.get(orderId);
        if (order != null && order.getStatus() != OrderStatus.COMPLETED) {
            // Cancel any ongoing automatic processing
            CompletableFuture<?> processingFuture = processingOrders.get(orderId);
            if (processingFuture != null) {
                processingFuture.cancel(true);
                processingOrders.remove(orderId);
            }
            
            // Mark as manually updated to prevent further automatic updates
            manuallyUpdatedOrders.put(orderId, true);
            
            // Update status to cancelled
            order.setStatus(OrderStatus.CANCELLED);
            orders.put(orderId, order);
            messagingTemplate.convertAndSend("/topic/orders/update", order);
            log.info("Order cancelled - ID: {}", orderId);
            return order;
        }
        return null;
    }
}