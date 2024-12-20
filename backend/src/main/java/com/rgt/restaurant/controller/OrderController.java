package com.rgt.restaurant.controller;

import com.rgt.restaurant.model.Order;
import com.rgt.restaurant.service.OrderService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.rgt.restaurant.model.OrderRequest;
import com.rgt.restaurant.model.OrderStatusRequest;
import com.rgt.restaurant.model.OrderQuantityRequest;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest orderRequest) {
        return ResponseEntity.ok(orderService.createOrder(orderRequest));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
        @PathVariable String orderId,
        @RequestBody OrderStatusRequest statusRequest
    ) {
        Order updatedOrder = orderService.updateOrderStatus(orderId, statusRequest.getStatus());
        if (updatedOrder == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedOrder);
    }

    @PatchMapping("/{orderId}/quantity")
    public ResponseEntity<Order> updateOrderQuantity(
        @PathVariable String orderId,
        @RequestBody OrderQuantityRequest quantityRequest
    ) {
        Order updatedOrder = orderService.updateOrderQuantity(orderId, quantityRequest.getQuantity());
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
} 