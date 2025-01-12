package com.palovito.restaurant.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "order_items")
@Data
public class OrderItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "menu_id")
    private MenuEntity menu;
    
    private int quantity;
    
    @ManyToOne
    @JoinColumn(name = "order_id")
    private OrderEntity order;
} 