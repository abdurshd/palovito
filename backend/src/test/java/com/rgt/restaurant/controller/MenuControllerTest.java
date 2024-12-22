package com.rgt.restaurant.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rgt.restaurant.model.Category;
import com.rgt.restaurant.model.Menu;
import com.rgt.restaurant.model.MenuRequest;
import com.rgt.restaurant.service.MenuService;
import com.rgt.restaurant.config.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.hamcrest.Matchers.hasSize;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MenuController.class)
@ExtendWith(MockitoExtension.class)
@Import({SecurityConfig.class})
class MenuControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MenuService menuService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createMenu_WithValidRequest_ShouldReturnCreatedMenu() throws Exception {
        // Given
        MenuRequest request = new MenuRequest();
        request.setName("김치찌개");
        request.setDescription("매운 김치찌개");
        request.setPrice(15000.0);
        request.setCategoryId("cat1");

        Category category = new Category("cat1", "찌개류", "한국식 찌개");
        Menu createdMenu = Menu.builder()
                .id("menu1")
                .name("김치찌개")
                .description("매운 김치찌개")
                .price(BigDecimal.valueOf(15000))
                .category(category)
                .build();

        when(menuService.createMenu(any(MenuRequest.class))).thenReturn(createdMenu);

        // When & Then
        mockMvc.perform(post("/api/menu")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("menu1"))
                .andExpect(jsonPath("$.name").value("김치찌개"))
                .andExpect(jsonPath("$.price").value(15000.0));
    }

    @Test
    void getAllMenus_ShouldReturnListOfMenus() throws Exception {
        // Given
        Category category = new Category("cat1", "찌개류", "한국식 찌개");
        List<Menu> menus = Arrays.asList(
            Menu.builder()
                .id("1")
                .name("김치찌개")
                .description("매운 김치찌개")
                .price(BigDecimal.valueOf(15000))
                .category(category)
                .build(),
            Menu.builder()
                .id("2")
                .name("된장찌개")
                .description("구수한 된장찌개")
                .price(BigDecimal.valueOf(14000))
                .category(category)
                .build()
        );
        when(menuService.getAllMenus()).thenReturn(menus);

        // When & Then
        mockMvc.perform(get("/api/menu"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].name").value("김치찌개"))
                .andExpect(jsonPath("$[1].id").value("2"))
                .andExpect(jsonPath("$[1].name").value("된장찌개"));
    }

    @Test
    void getMenusByCategory_ShouldReturnMenusForCategory() throws Exception {
        // Given
        String categoryId = "cat1";
        Category category = new Category(categoryId, "찌개류", "한국식 찌개");
        List<Menu> menus = Arrays.asList(
            Menu.builder()
                .id("1")
                .name("김치찌개")
                .description("매운 김치찌개")
                .price(BigDecimal.valueOf(15000))
                .category(category)
                .build()
        );
        when(menuService.getMenusByCategory(categoryId)).thenReturn(menus);

        // When & Then
        mockMvc.perform(get("/api/menu/category/{categoryId}", categoryId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].name").value("김치찌개"));
    }

    @Test
    void updateMenu_WithValidRequest_ShouldReturnUpdatedMenu() throws Exception {
        // Given
        String menuId = "menu1";
        MenuRequest request = new MenuRequest();
        request.setName("매운 김치찌개");
        request.setDescription("아주 매운 김치찌개");
        request.setPrice(16000.0);
        request.setCategoryId("cat1");

        Category category = new Category("cat1", "찌개류", "한국식 찌개");
        Menu updatedMenu = Menu.builder()
                .id(menuId)
                .name("매운 김치찌개")
                .description("아주 매운 김치찌개")
                .price(BigDecimal.valueOf(16000))
                .category(category)
                .build();

        when(menuService.updateMenu(eq(menuId), any(MenuRequest.class))).thenReturn(updatedMenu);

        // When & Then
        mockMvc.perform(put("/api/menu/{id}", menuId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(menuId))
                .andExpect(jsonPath("$.name").value("매운 김치찌개"))
                .andExpect(jsonPath("$.price").value(16000.0));
    }
} 