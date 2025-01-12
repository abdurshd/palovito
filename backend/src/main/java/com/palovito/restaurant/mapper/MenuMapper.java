package com.palovito.restaurant.mapper;

import com.palovito.restaurant.entity.MenuEntity;
import com.palovito.restaurant.model.Menu;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class MenuMapper {
    private final CategoryMapper categoryMapper;

    public MenuMapper(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    public MenuEntity toEntity(Menu menu) {
        return MenuEntity.builder()
            .id(menu.getId())
            .name(menu.getName())
            .description(menu.getDescription())
            .price(menu.getPrice())
            .category(categoryMapper.toEntity(menu.getCategory()))
            .imageUrl(menu.getImageUrl())
            .bestSeller(menu.isBestSeller())
            .available(menu.isAvailable())
            .preparationTime(menu.getPreparationTime())
            .spicyLevel(menu.getSpicyLevel())
            .allergens(menu.getAllergens() != null ? String.join(",", menu.getAllergens()) : "")
            .nutritionalInfo(convertNutritionalInfoToString(menu.getNutritionalInfo()))
            .build();
    }

    public Menu toModel(MenuEntity entity) {
        if (entity == null) {
            return null;
        }

        return Menu.builder()
            .id(entity.getId())
            .name(entity.getName())
            .description(entity.getDescription())
            .price(entity.getPrice())
            .category(entity.getCategory() != null ? categoryMapper.toModel(entity.getCategory()) : null)
            .imageUrl(entity.getImageUrl())
            .bestSeller(entity.isBestSeller())
            .available(entity.isAvailable())
            .preparationTime(entity.getPreparationTime())
            .spicyLevel(entity.getSpicyLevel())
            .allergens(entity.getAllergens() != null && !entity.getAllergens().isEmpty() ? 
                Arrays.asList(entity.getAllergens().split(",")) : List.of())
            .nutritionalInfo(entity.getNutritionalInfo() != null && !entity.getNutritionalInfo().isEmpty() ?
                convertStringToNutritionalInfo(entity.getNutritionalInfo()) : Map.of())
            .build();
    }

    private String convertNutritionalInfoToString(Map<String, Integer> nutritionalInfo) {
        if (nutritionalInfo == null || nutritionalInfo.isEmpty()) {
            return "";
        }
        return nutritionalInfo.entrySet().stream()
            .map(entry -> entry.getKey() + ":" + entry.getValue())
            .collect(Collectors.joining(","));
    }

    private Map<String, Integer> convertStringToNutritionalInfo(String nutritionalInfo) {
        if (nutritionalInfo == null || nutritionalInfo.isEmpty()) {
            return Map.of();
        }
        return Arrays.stream(nutritionalInfo.split(","))
            .map(entry -> entry.split(":"))
            .collect(Collectors.toMap(
                entry -> entry[0],
                entry -> Integer.parseInt(entry[1])
            ));
    }
}
