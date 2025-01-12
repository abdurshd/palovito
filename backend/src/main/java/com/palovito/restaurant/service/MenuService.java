package com.palovito.restaurant.service;

import com.palovito.restaurant.model.Menu;
import com.palovito.restaurant.model.Category;
import com.palovito.restaurant.model.MenuRequest;
import com.palovito.restaurant.entity.MenuEntity;
import com.palovito.restaurant.mapper.MenuMapper;
import com.palovito.restaurant.repository.MenuRepository;
import com.palovito.restaurant.mapper.CategoryMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@Service
@Slf4j
@RequiredArgsConstructor
public class MenuService {
    private final MenuRepository menuRepository;
    private final CategoryService categoryService;
    private final MenuCategoryService menuCategoryService;
    private final MenuMapper menuMapper;
    private final CategoryMapper categoryMapper;

    public Menu createMenu(MenuRequest request) {
        Category category = categoryService.getCategory(request.getCategoryId());
        if (category == null) {
            log.error("Category not found with ID: {}", request.getCategoryId());
            throw new IllegalArgumentException("Category not found");
        }

        try {
            Menu menu = new Menu(
                UUID.randomUUID().toString(),
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                category,
                request.getImageUrl(),
                request.isBestSeller(),
                request.isAvailable(),
                request.getPreparationTime(),
                request.getSpicyLevel(),
                request.getAllergens(),
                request.getNutritionalInfo()
            );

            // Save to database
            MenuEntity entity = menuMapper.toEntity(menu);
            menuRepository.save(entity);
            
            menuCategoryService.addMenuToCategory(category.getId(), menu.getId());
            log.info("Menu item created - ID: {}, Name: {}", menu.getId(), menu.getName());
            return menu;
        } catch (Exception e) {
            log.error("Error creating menu item: {}", e.getMessage());
            throw new RuntimeException("Failed to create menu item", e);
        }
    }

    public List<Menu> getAllMenus() {
        return menuRepository.findAll().stream()
            .map(menuMapper::toModel)
            .collect(Collectors.toList());
    }

    public Menu getMenu(String id) {
        return menuRepository.findById(id)
            .map(menuMapper::toModel)
            .orElse(null);
    }

    public List<Menu> getMenusByCategory(String categoryId) {
        // Implement logic to get menus by category
        return menuRepository.findByCategoryId(categoryId).stream()
            .map(menuMapper::toModel)
            .collect(Collectors.toList());
    }

    
    public Menu updateMenu(String id, MenuRequest request) {
        return menuRepository.findById(id)
            .map(existingMenu -> {
                existingMenu.setName(request.getName());
                existingMenu.setDescription(request.getDescription());
                existingMenu.setPrice(BigDecimal.valueOf(request.getPrice()));
                existingMenu.setCategory(categoryMapper.toEntity(categoryService.getCategory(request.getCategoryId())));
                existingMenu.setImageUrl(request.getImageUrl());
                existingMenu.setBestSeller(request.isBestSeller());
                existingMenu.setAvailable(request.isAvailable());
                existingMenu.setPreparationTime(request.getPreparationTime());
                existingMenu.setSpicyLevel(request.getSpicyLevel());
                existingMenu.setAllergens(String.join(",", request.getAllergens()));
                existingMenu.setNutritionalInfo(request.getNutritionalInfo().toString());
                MenuEntity updatedEntity = menuRepository.save(existingMenu);
                return menuMapper.toModel(updatedEntity);
            })
            .orElseThrow(() -> new RuntimeException("Menu not found with id: " + id));
    }

    @Transactional
    public String deleteMenu(String id) {
        try {
            MenuEntity menu = menuRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found with id: " + id));
            
            // Remove from categories first
            menuCategoryService.removeMenuFromAllCategories(id);
            
            // Clear order items
            menu.getOrderItems().clear();
            
            // Then delete the menu
            menuRepository.delete(menu);
            log.info("Menu item deleted - ID: {}", id);
            return menu.getName() + " deleted successfully from " + menu.getCategory().getName() + " list";
        } catch (Exception e) {
            log.error("Error deleting menu item: {}", e.getMessage());
            throw new RuntimeException("Failed to delete menu item: " + e.getMessage(), e);
        }
    }

    public boolean existsById(String id) {
        return menuRepository.existsById(id);
    }

    public void deleteAllMenus() {
        menuRepository.deleteAll();
    }
} 