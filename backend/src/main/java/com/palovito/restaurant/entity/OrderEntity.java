package com.palovito.restaurant.entity;

import com.palovito.restaurant.model.OrderStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class OrderEntity {
    @Id
    private String id;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    private List<OrderItemEntity> items;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    private Instant timestamp;
    private double total;
} 