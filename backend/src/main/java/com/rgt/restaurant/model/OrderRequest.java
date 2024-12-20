package com.rgt.restaurant.model;

import lombok.Data;

@Data
public class OrderRequest {
    private String foodName;
    private int quantity;
} 