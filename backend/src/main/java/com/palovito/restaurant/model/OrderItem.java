package com.palovito.restaurant.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    private String id;
    private Menu menu;
    private int quantity;

    // public OrderItem(String id, Menu menu, int quantity) {
    //     this.id = id;
    //     this.menu = menu;
    //     this.quantity = quantity;
    // }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
} 