package com.rgt.restaurant.controller;

import com.rgt.restaurant.model.Menu;
import com.rgt.restaurant.model.MenuRequest;
import com.rgt.restaurant.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {
    private final MenuService menuService;

    @PostMapping
    public ResponseEntity<Menu> createMenu(@RequestBody MenuRequest request) {
        try {
            Menu menu = menuService.createMenu(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(menu);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Menu>> getAllMenus() {
        return ResponseEntity.ok(menuService.getAllMenus());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Menu>> getMenusByCategory(@PathVariable String categoryId) {
        return ResponseEntity.ok(menuService.getMenusByCategory(categoryId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Menu> updateMenu(@PathVariable String id, @RequestBody MenuRequest request) {
        try {
            Menu menu = menuService.updateMenu(id, request);
            return ResponseEntity.ok(menu);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 