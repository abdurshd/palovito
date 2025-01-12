package com.palovito.restaurant.integration;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;
import com.palovito.restaurant.RestaurantServiceApplication;
import com.palovito.restaurant.model.Order;
import com.palovito.restaurant.model.OrderRequest;
import com.palovito.restaurant.model.OrderStatus;
import com.palovito.restaurant.model.MenuRequest;
import com.palovito.restaurant.model.Menu;
import com.palovito.restaurant.service.MenuService;
import com.palovito.restaurant.service.CategoryService;
import com.palovito.restaurant.model.CategoryRequest;
import com.palovito.restaurant.model.Category;
import static org.assertj.core.api.Assertions.assertThat;
import java.util.ArrayList;
import java.util.List;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.annotation.DirtiesContext;
import com.palovito.restaurant.config.SecurityConfig;
import com.palovito.restaurant.config.WebSocketConfig;

@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    classes = {RestaurantServiceApplication.class, SecurityConfig.class, WebSocketConfig.class}
)
@TestPropertySource(properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.sql.init.mode=never",
    "spring.websocket.enabled=true",
    "spring.main.allow-bean-definition-overriding=true"
})
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@ActiveProfiles("test")
class OrderControllerIntegrationTest {
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Autowired
    private MenuService menuService;
    
    @Autowired
    private CategoryService categoryService;
    
    @BeforeEach
    void setUp() {
        // Clear existing data
        menuService.deleteAllMenus();
        categoryService.deleteAllCategories();

        // Create category
        CategoryRequest categoryRequest = new CategoryRequest();
        categoryRequest.setName("찌개류");
        categoryRequest.setDescription("한국식 찌개");
        Category category = categoryService.createCategory(categoryRequest.getName(), categoryRequest.getDescription());

        // Create menu
        MenuRequest menuRequest = MenuRequest.builder()
            .name("김치찌개")
            .description("매운 김치찌개")
            .price(15000.0)
            .categoryId(category.getId())
            .available(true)
            .build();
            
        try {
            menuService.createMenu(menuRequest);
            Thread.sleep(100); // Add small delay to ensure menu is created
        } catch (Exception e) {
            System.err.println("Error setting up test menu: " + e.getMessage());
        }
    }
    
    @Test
    void createOrder_WithValidData_ShouldReturnOrder() {
        // Get menu ID
        List<Menu> menus = menuService.getAllMenus();
        assertThat(menus).isNotEmpty();
        String menuId = menus.get(0).getId();
        
        // Create order request
        OrderRequest.OrderItem item = new OrderRequest.OrderItem();
        item.setMenuId(menuId);
        item.setQuantity(2);
        
        OrderRequest request = new OrderRequest();
        request.setItems(new ArrayList<>());
        request.getItems().add(item);
        
        // Send request
        ResponseEntity<Order> response = restTemplate.postForEntity(
            "/api/order", request, Order.class);
        
        // Verify response
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getItems()).hasSize(1);
        assertThat(response.getBody().getStatus()).isEqualTo(OrderStatus.RECEIVED);
        assertThat(response.getBody().getTotal()).isEqualTo(30000.0);
        assertThat(response.getBody().getItems().get(0).getMenu().getId()).isEqualTo(menuId);
    }
}