package com.palovito.restaurant.controller;

import com.palovito.restaurant.model.Order;
import com.palovito.restaurant.service.OrderService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.palovito.restaurant.model.OrderRequest;
import com.palovito.restaurant.model.StatusUpdateRequest;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest orderRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(orderRequest));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
        @PathVariable String orderId,
        @RequestBody StatusUpdateRequest status
    ) {
        Order updatedOrder = orderService.updateOrderStatus(orderId, status.getStatus());
        if (updatedOrder == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedOrder);
    }

    @PatchMapping("/{orderId}/quantity")
    public ResponseEntity<Order> updateOrderQuantity(
        @PathVariable String orderId,
        @RequestParam String menuId,
        @RequestBody int quantity
    ) {
        Order updatedOrder = orderService.updateOrderQuantity(orderId, menuId, quantity);
        if (updatedOrder == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedOrder);
    }

    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable String orderId) {
        Order cancelledOrder = orderService.cancelOrder(orderId);
        if (cancelledOrder == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cancelledOrder);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrder(@PathVariable String orderId) {
        Order order = orderService.getOrder(orderId);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(order);
    }

    @PatchMapping("/{orderId}/items/{itemId}/quantity")
    public ResponseEntity<Order> updateItemQuantity(
        @PathVariable String orderId,
        @PathVariable String itemId,
        @RequestBody int quantity
    ) {
        Order updatedOrder = orderService.updateOrderQuantity(orderId, itemId, quantity);
        if (updatedOrder == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedOrder);
    }
} 