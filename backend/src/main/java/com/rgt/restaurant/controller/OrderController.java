package com.rgt.restaurant.controller;

import com.rgt.restaurant.model.Order;
import com.rgt.restaurant.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.rgt.restaurant.model.OrderRequest;

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
} 