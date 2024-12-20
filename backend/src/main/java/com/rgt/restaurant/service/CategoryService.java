package com.rgt.restaurant.service;

import com.rgt.restaurant.model.Category;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
@RequiredArgsConstructor
public class CategoryService {
    private final Map<String, Category> categories = new ConcurrentHashMap<>();
    private final MenuCategoryService menuCategoryService;

    public Category createCategory(String name, String description) {
        Category category = new Category(UUID.randomUUID().toString(), name, description);
        categories.put(category.getId(), category);
        return category;
    }

    public List<Category> getAllCategories() {
        return new ArrayList<>(categories.values());
    }

    public Category getCategory(String id) {
        return categories.get(id);
    }

    public void deleteCategory(String id) {
        if (!categories.containsKey(id)) {
            throw new IllegalArgumentException("Category not found");
        }
        
        if (menuCategoryService.categoryHasMenus(id)) {
            throw new IllegalStateException("Cannot delete category with existing menu items");
        }
        
        categories.remove(id);
    }

    public Category updateCategory(String id, String name, String description) {
        Category category = categories.get(id);
        if (category == null) {
            log.warn("Attempted to update non-existent category {}", id);
            throw new IllegalArgumentException("Category not found");
        }
        
        category.setName(name);
        category.setDescription(description);
        categories.put(id, category);
        log.info("Category updated - ID: {}, Name: {}", id, name);
        return category;
    }
} 