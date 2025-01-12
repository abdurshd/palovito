package com.palovito.restaurant.model;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private List<OrderItem> items;

    @Data
    public static class OrderItem {
        private String menuId;
        private int quantity;
    }
} 