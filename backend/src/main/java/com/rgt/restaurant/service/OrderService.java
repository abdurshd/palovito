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
import com.rgt.restaurant.model.Menu;
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
    private final Map<String, CompletableFuture<?>> processingOrders = new ConcurrentHashMap<>();
    private final Map<String, Boolean> manuallyUpdatedOrders = new ConcurrentHashMap<>();
    private final SimpMessagingTemplate messagingTemplate;
    private final MenuService menuService;
    
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
        Menu menu = menuService.getMenu(request.getMenuId());
        if (menu == null) {
            throw new IllegalArgumentException("Menu item not found");
        }
        return createOrder(menu, request.getQuantity());
    }
    
    private Order createOrder(Menu menu, int quantity) {
        log.info("Creating new order - Menu: {}, Quantity: {}", menu.getName(), quantity);
        
        if (quantity <= 0) {
            log.error("Invalid order quantity: {}", quantity);
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
        
        Order order = new Order(
            UUID.randomUUID().toString(),
            menu,
            quantity,
            OrderStatus.RECEIVED,
            Instant.now().toString()
        );
        
        orders.put(order.getId(), order);
        manuallyUpdatedOrders.put(order.getId(), false);
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
        return orders.get(orderId);
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
    
    public Order updateOrderQuantity(String orderId, int newQuantity) {
        Order order = orders.get(orderId);
        if (order != null && order.getStatus() != OrderStatus.COMPLETED) {
            if (newQuantity <= 0) {
                throw new IllegalArgumentException("Quantity must be greater than 0");
            }
            order.setQuantity(newQuantity);
            orders.put(orderId, order);
            messagingTemplate.convertAndSend("/topic/orders/update", order);
            log.info("Order quantity updated - ID: {}, New Quantity: {}", orderId, newQuantity);
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