package com.palovito.restaurant.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.palovito.restaurant.model.Category;
import com.palovito.restaurant.model.CategoryRequest;
import com.palovito.restaurant.service.CategoryService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.hamcrest.Matchers.hasSize;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.context.annotation.Import;
import com.palovito.restaurant.config.SecurityConfig;

@WebMvcTest(CategoryController.class)
@ExtendWith(MockitoExtension.class)
@Import({SecurityConfig.class})
class CategoryControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CategoryService categoryService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createCategory_WithValidRequest_ShouldReturnCreatedCategory() throws Exception {
        // Given
        CategoryRequest request = new CategoryRequest();
        request.setName("찌개류");
        request.setDescription("다양한 한국식 찌개 요리");

        Category category = new Category("cat1", "찌개류", "다양한 한국식 찌개 요리");
        when(categoryService.createCategory(request.getName(), request.getDescription()))
            .thenReturn(category);

        // When & Then
        mockMvc.perform(post("/api/category")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("cat1"))
                .andExpect(jsonPath("$.name").value("찌개류"))
                .andExpect(jsonPath("$.description").value("다양한 한국식 찌개 요리"));
    }

    @Test
    void getAllCategories_ShouldReturnListOfCategories() throws Exception {
        // Given
        List<Category> categories = Arrays.asList(
            new Category("1", "찌개류", "한국식 찌개"),
            new Category("2", "구이류", "한국식 구이 요리")
        );
        when(categoryService.getAllCategories()).thenReturn(categories);

        // When & Then
        mockMvc.perform(get("/api/category"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].name").value("찌개류"))
                .andExpect(jsonPath("$[1].id").value("2"))
                .andExpect(jsonPath("$[1].name").value("구이류"));
    }

    @Test
    void updateCategory_WithValidRequest_ShouldReturnUpdatedCategory() throws Exception {
        // Given
        String categoryId = "cat1";
        CategoryRequest request = new CategoryRequest();
        request.setName("업데이트된 찌개류");
        request.setDescription("업데이트된 설명");

        Category updatedCategory = new Category(categoryId, "업데이트된 찌개류", "업데이트된 설명");
        when(categoryService.updateCategory(categoryId, request.getName(), request.getDescription()))
            .thenReturn(updatedCategory);

        // When & Then
        mockMvc.perform(put("/api/category/{id}", categoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(categoryId))
                .andExpect(jsonPath("$.name").value("업데이트된 찌개류"))
                .andExpect(jsonPath("$.description").value("업데이트된 설명"));
    }

    @Test
    void deleteCategory_WithValidId_ShouldReturnNoContent() throws Exception {
        // Given
        String categoryId = "cat1";
        doNothing().when(categoryService).deleteCategory(categoryId);

        // When & Then
        mockMvc.perform(delete("/api/category/{id}", categoryId))
                .andExpect(status().isNoContent());
    }
} 