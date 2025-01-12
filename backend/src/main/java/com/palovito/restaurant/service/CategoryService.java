package com.palovito.restaurant.service;

import com.palovito.restaurant.model.Category;
import com.palovito.restaurant.repository.CategoryRepository;
import com.palovito.restaurant.mapper.CategoryMapper;
import com.palovito.restaurant.entity.CategoryEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final MenuCategoryService menuCategoryService;
    private final CategoryMapper categoryMapper;

    public Category createCategory(String name, String description) {
        Category category = new Category(UUID.randomUUID().toString(), name, description);
        CategoryEntity entity = categoryMapper.toEntity(category);
        categoryRepository.save(entity);
        return category;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll().stream()
            .map(categoryMapper::toModel)
            .collect(Collectors.toList());
    }

    public Category getCategory(String id) {
        return categoryRepository.findById(id)
            .map(categoryMapper::toModel)
            .orElse(null);
    }

    public void deleteCategory(String id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Category not found");
        }
        
        if (menuCategoryService.categoryHasMenus(id)) {
            throw new IllegalStateException("Cannot delete category with existing menu items");
        }
        
        categoryRepository.deleteById(id);
    }

    public Category updateCategory(String id, String name, String description) {
        return categoryRepository.findById(id)
            .map(entity -> {
                entity.setName(name);
                entity.setDescription(description);
                categoryRepository.save(entity);
                log.info("Category updated - ID: {}, Name: {}", id, name);
                return categoryMapper.toModel(entity);
            })
            .orElseThrow(() -> {
                log.warn("Attempted to update non-existent category {}", id);
                return new IllegalArgumentException("Category not found");
            });
    }

    public void deleteAllCategories() {
        categoryRepository.deleteAll();
    }
} 