package com.palovito.restaurant.mapper;

import com.palovito.restaurant.model.Category;
import com.palovito.restaurant.entity.CategoryEntity;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {
    public CategoryEntity toEntity(Category category) {
        return new CategoryEntity(
            category.getId(),
            category.getName(),
            category.getDescription()
        );
    }
    
    public Category toModel(CategoryEntity entity) {
        return new Category(
            entity.getId(),
            entity.getName(),
            entity.getDescription()
        );
    }
} 