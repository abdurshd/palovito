package com.rgt.restaurant.service;

import com.rgt.restaurant.model.Menu;
import com.rgt.restaurant.model.Category;
import com.rgt.restaurant.model.MenuRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class MenuService {
    private final Map<String, Menu> menus = new ConcurrentHashMap<>();
    private final CategoryService categoryService;
    private final MenuCategoryService menuCategoryService;

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
                true,
                request.getPreparationTime(),
                request.getSpicyLevel(),
                request.getAllergens(),
                request.getNutritionalInfo()
            );

            menus.put(menu.getId(), menu);
            menuCategoryService.addMenuToCategory(category.getId(), menu.getId());
            log.info("Menu item created - ID: {}, Name: {}", menu.getId(), menu.getName());
            return menu;
        } catch (Exception e) {
            log.error("Error creating menu item: {}", e.getMessage());
            throw new RuntimeException("Failed to create menu item", e);
        }
    }

    public List<Menu> getAllMenus() {
        return new ArrayList<>(menus.values());
    }

    public List<Menu> getMenusByCategory(String categoryId) {
        return menus.values().stream()
            .filter(menu -> menu.getCategory().getId().equals(categoryId))
            .collect(Collectors.toList());
    }

    public Menu getMenu(String id) {
        Menu menu = menus.get(id);
        if (menu == null) {
            throw new IllegalArgumentException("Menu not found");
        }
        return menu;
    }

    public Menu updateMenu(String id, MenuRequest request) {
        Menu existingMenu = menus.get(id);
        if (existingMenu == null) {
            log.error("Menu not found with ID: {}", id);
            throw new IllegalArgumentException("Menu not found");
        }

        Category category = categoryService.getCategory(request.getCategoryId());
        if (category == null) {
            log.error("Category not found with ID: {}", request.getCategoryId());
            throw new IllegalArgumentException("Category not found");
        }

        try {
            Menu updatedMenu = new Menu(
                id,
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

            menus.put(id, updatedMenu);
            log.info("Menu item updated - ID: {}, Name: {}", id, updatedMenu.getName());
            return updatedMenu;
        } catch (Exception e) {
            log.error("Error updating menu item: {}", e.getMessage());
            throw new RuntimeException("Failed to update menu item", e);
        }
    }
} 