package com.rgt.restaurant.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {
    private String id;
    private Menu menu;
    private int quantity;
    private OrderStatus status;
    private String timestamp;
}