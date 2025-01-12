package com.palovito.restaurant.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "menus")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuEntity {
    @Id
    private String id;
    
    private String name;
    private String description;
    private BigDecimal price;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private CategoryEntity category;
    
    private String imageUrl;
    private boolean bestSeller;
    private boolean available;
    private int preparationTime;
    private int spicyLevel;
    private String allergens;
    private String nutritionalInfo;
    
    @Builder.Default
    @OneToMany(mappedBy = "menu", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItemEntity> orderItems = new ArrayList<>();
} 