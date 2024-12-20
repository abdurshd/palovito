package com.rgt.restaurant.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.rgt.restaurant.model.Order;
import com.rgt.restaurant.model.OrderRequest;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class OrderControllerIntegrationTest {
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void createOrder_WithValidData_ShouldReturnOrder() {
        OrderRequest request = new OrderRequest();
        request.setFoodName("Pizza");
        request.setQuantity(2);
        
        ResponseEntity<Order> response = restTemplate.postForEntity(
            "/api/order", request, Order.class);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getFoodName()).isEqualTo("Pizza");
    }
} 