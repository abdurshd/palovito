package com.palovito.restaurant.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuRequest {
    private String name;
    private String description;
    private double price;
    private String categoryId;
    private String imageUrl;
    private boolean bestSeller;
    private boolean available;
    private int preparationTime;
    private int spicyLevel;
    private List<String> allergens;
    private Map<String, Integer> nutritionalInfo;
} 