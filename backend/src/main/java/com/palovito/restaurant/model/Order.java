package com.palovito.restaurant.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

import org.springframework.data.redis.core.RedisHash;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash("Order")
public class Order {
    private String id;
    private List<OrderItem> items;
    private OrderStatus status;
    private Instant timestamp;
    private double total;
}