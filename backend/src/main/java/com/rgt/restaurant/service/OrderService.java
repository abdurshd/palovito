package com.rgt.restaurant.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.UUID;
import java.time.Instant;
import java.util.concurrent.CompletableFuture;
import com.rgt.restaurant.model.Order;
import com.rgt.restaurant.model.OrderStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import java.time.Duration;
import java.util.List;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Value;
import com.rgt.restaurant.model.OrderRequest;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {
    private final Map<String, Order> orders = new ConcurrentHashMap<>();
    private final SimpMessagingTemplate messagingTemplate;
    
    @Scheduled(fixedRate = 24 * 60 * 60 * 1000) // Run daily
    public void cleanupOldOrders() {
        Instant cutoff = Instant.now().minus(Duration.ofDays(1));
        orders.entrySet().removeIf(entry -> 
            Instant.parse(entry.getValue().getTimestamp()).isBefore(cutoff));
    }
    
    public List<Order> getAllOrders() {
        return new ArrayList<>(orders.values());
    }
    
    @Value("${order.processing.initial-delay:5000}")
    private long initialDelay;
    
    @Value("${order.processing.completion-delay:10000}")
    private long completionDelay;
    
    public Order createOrder(OrderRequest request) {
        return createOrder(request.getFoodName(), request.getQuantity());
    }
    
    private Order createOrder(String foodName, int quantity) {
        log.info("Creating new order - Food: {}, Quantity: {}", foodName, quantity);
        
        if (foodName.isBlank() || quantity <= 0) {
            log.error("Invalid order data - Food: {}, Quantity: {}", foodName, quantity);
            throw new IllegalArgumentException("Invalid order data");
        }
        
        Order order = new Order(
            UUID.randomUUID().toString(),
            foodName,
            quantity,
            OrderStatus.RECEIVED,
            Instant.now().toString()
        );
        
        orders.put(order.getId(), order);
        log.info("Order created successfully - ID: {}", order.getId());
        messagingTemplate.convertAndSend("/topic/orders", order);
        
        CompletableFuture.runAsync(() -> processOrder(order));
        return order;
    }
    
    private void processOrder(Order order) {
        try {
            log.info("Starting order processing - ID: {}", order.getId());
            Thread.sleep(initialDelay);
            
            order.setStatus(OrderStatus.PROCESSING);
            log.info("Order status updated to PROCESSING - ID: {}", order.getId());
            messagingTemplate.convertAndSend("/topic/orders/update", order);
            
            Thread.sleep(completionDelay);
            order.setStatus(OrderStatus.COMPLETED);
            log.info("Order completed successfully - ID: {}", order.getId());
            messagingTemplate.convertAndSend("/topic/orders/update", order);
            
        } catch (InterruptedException e) {
            log.error("Order processing interrupted - ID: {}", order.getId(), e);
            Thread.currentThread().interrupt();
        }
    }
    
    public Order getOrder(String orderId) {
        return orders.get(orderId);
    }
}