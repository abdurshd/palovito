package com.rgt.restaurant.model;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class MenuRequest {
    private String name;
    private String description;
    private double price;
    private String categoryId;
    private String imageUrl;
    private boolean bestSeller;
    private int preparationTime;
    private int spicyLevel;
    private List<String> allergens;
    private Map<String, String> nutritionalInfo;
} 