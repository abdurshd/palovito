package com.rgt.restaurant.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.HashSet;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MenuCategoryService {
    private final Map<String, Set<String>> categoryMenus = new ConcurrentHashMap<>();

    public void addMenuToCategory(String categoryId, String menuId) {
        categoryMenus.computeIfAbsent(categoryId, k -> new HashSet<>()).add(menuId);
        log.info("Added menu {} to category {}", menuId, categoryId);
    }

    public void removeMenuFromCategory(String categoryId, String menuId) {
        if (categoryMenus.containsKey(categoryId)) {
            categoryMenus.get(categoryId).remove(menuId);
            log.info("Removed menu {} from category {}", menuId, categoryId);
        }
    }

    public boolean categoryHasMenus(String categoryId) {
        Set<String> menus = categoryMenus.get(categoryId);
        return menus != null && !menus.isEmpty();
    }

    public Set<String> getMenusForCategory(String categoryId) {
        return categoryMenus.getOrDefault(categoryId, new HashSet<>());
    }
} 