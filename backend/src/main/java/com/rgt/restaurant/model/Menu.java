package com.rgt.restaurant.model;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Menu {
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private Category category;
    private String imageUrl;
    private boolean isBestSeller;
    private boolean isAvailable;
    private Integer preparationTime;
    private Integer spicyLevel;
    private List<String> allergens;
    private Map<String, String> nutritionalInfo;

    public Menu(
        String id,
        String name,
        String description,
        double price,
        Category category,
        String imageUrl,
        boolean bestSeller,
        boolean available,
        int preparationTime,
        int spicyLevel,
        List<String> allergens,
        Map<String, String> nutritionalInfo
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = BigDecimal.valueOf(price);
        this.category = category;
        this.imageUrl = imageUrl;
        this.isBestSeller = bestSeller;
        this.isAvailable = available;
        this.preparationTime = preparationTime;
        this.spicyLevel = spicyLevel;
        this.allergens = allergens;
        this.nutritionalInfo = nutritionalInfo;
    }
} 