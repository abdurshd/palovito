package com.palovito.restaurant.entity;

import com.palovito.restaurant.model.OrderStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "orders")
@Data
public class OrderEntity {
    @Id
    private String id;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItemEntity> items = new ArrayList<>();
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    private String timestamp;
    private double total;
} 