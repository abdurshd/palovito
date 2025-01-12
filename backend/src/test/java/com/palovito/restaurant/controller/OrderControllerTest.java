package com.palovito.restaurant.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.palovito.restaurant.model.Order;
import com.palovito.restaurant.model.OrderRequest;
import com.palovito.restaurant.model.OrderStatus;
import com.palovito.restaurant.model.StatusUpdateRequest;
import com.palovito.restaurant.model.OrderItem;
import com.palovito.restaurant.model.Menu;
import com.palovito.restaurant.model.Category;
import com.palovito.restaurant.service.OrderService;
import com.palovito.restaurant.config.SecurityConfig;
import com.palovito.restaurant.config.WebSocketConfig;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderController.class)
@ExtendWith(SpringExtension.class)
@Import({SecurityConfig.class, WebSocketConfig.class})
class OrderControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SimpMessagingTemplate messagingTemplate;

    @Test
    void createOrder_WithValidRequest_ShouldReturnCreatedOrder() throws Exception {
        // Given
        OrderRequest request = new OrderRequest();
        List<OrderRequest.OrderItem> items = new ArrayList<>();
        OrderRequest.OrderItem item = new OrderRequest.OrderItem();
        item.setMenuId("menu1");
        item.setQuantity(2);
        items.add(item);
        request.setItems(items);

        Menu menu = Menu.builder()
            .id("menu1")
            .name("김치찌개")
            .price(BigDecimal.valueOf(15000))
            .category(new Category("cat1", "찌개류", "한국식 찌개"))
            .build();

        OrderItem orderItem = new OrderItem();
        orderItem.setMenu(menu);
        orderItem.setQuantity(2);

        Order expectedOrder = Order.builder()
            .id("order1")
            .status(OrderStatus.RECEIVED)
            .items(Arrays.asList(orderItem))
            .timestamp(Instant.now().toString())
            .total(30000.0)
            .build();

        when(orderService.createOrder(any(OrderRequest.class))).thenReturn(expectedOrder);

        // When & Then
        mockMvc.perform(post("/api/order")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("order1"))
                .andExpect(jsonPath("$.status").value("RECEIVED"))
                .andExpect(jsonPath("$.total").value(30000.0));
    }

    @Test
    void getAllOrders_ShouldReturnListOfOrders() throws Exception {
        // Given
        List<Order> orders = Arrays.asList(
            Order.builder()
                .id("1")
                .status(OrderStatus.RECEIVED)
                .items(new ArrayList<>())
                .timestamp(Instant.now().toString())
                .total(25000.0)
                .build(),
            Order.builder()
                .id("2")
                .status(OrderStatus.PROCESSING)
                .items(new ArrayList<>())
                .timestamp(Instant.now().toString())
                .total(35000.0)
                .build()
        );
        when(orderService.getAllOrders()).thenReturn(orders);

        // When & Then
        mockMvc.perform(get("/api/order"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[1].id").value("2"));
    }

    @Test
    void updateOrderStatus_WithValidStatus_ShouldReturnUpdatedOrder() throws Exception {
        // Given
        String orderId = "order1";
        StatusUpdateRequest request = new StatusUpdateRequest();
        request.setStatus(OrderStatus.PROCESSING);

        Order updatedOrder = Order.builder()
            .id(orderId)
            .status(OrderStatus.PROCESSING)
            .items(new ArrayList<>())
            .timestamp(Instant.now().toString())
            .total(0.0)
            .build();

        when(orderService.updateOrderStatus(orderId, OrderStatus.PROCESSING)).thenReturn(updatedOrder);

        // When & Then
        mockMvc.perform(patch("/api/order/{orderId}/status", orderId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(orderId))
                .andExpect(jsonPath("$.status").value("PROCESSING"));
    }

    @Test
    void cancelOrder_WithValidOrderId_ShouldReturnCancelledOrder() throws Exception {
        // Given
        String orderId = "order1";
        Order cancelledOrder = Order.builder()
            .id(orderId)
            .status(OrderStatus.CANCELLED)
            .items(new ArrayList<>())
            .timestamp(Instant.now().toString())
            .total(0.0)
            .build();

        when(orderService.cancelOrder(orderId)).thenReturn(cancelledOrder);

        // When & Then
        mockMvc.perform(patch("/api/order/{orderId}/cancel", orderId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(orderId))
                .andExpect(jsonPath("$.status").value("CANCELLED"));
    }
}