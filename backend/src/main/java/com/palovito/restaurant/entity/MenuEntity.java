package com.palovito.restaurant.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "menus")
@Data
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
} 