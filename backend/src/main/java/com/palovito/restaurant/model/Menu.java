package com.palovito.restaurant.model;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Menu {
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private Category category;
    private String imageUrl;
    private boolean bestSeller;
    private boolean available;
    private int preparationTime;
    private int spicyLevel;
    private List<String> allergens;
    private Map<String, Integer> nutritionalInfo;

    public Menu(
        String id,
        String name,
        String description,
        double price,
        Category category,
        String imageUrl,
        boolean isBestSeller,
        boolean isAvailable,
        int preparationTime,
        int spicyLevel,
        List<String> allergens,
        Map<String, Integer> nutritionalInfo
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = BigDecimal.valueOf(price);
        this.category = category;
        this.imageUrl = imageUrl;
        this.bestSeller = isBestSeller;
        this.available = isAvailable;
        this.preparationTime = preparationTime;
        this.spicyLevel = spicyLevel;
        this.allergens = allergens;
        this.nutritionalInfo = nutritionalInfo;
    }
} 