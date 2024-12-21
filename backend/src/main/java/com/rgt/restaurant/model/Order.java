package com.rgt.restaurant.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {
    private String id;
    private List<OrderItem> items;
    private OrderStatus status;
    private String timestamp;
    private double total;
}