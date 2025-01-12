package com.palovito.restaurant.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import com.palovito.restaurant.model.Order;
import com.palovito.restaurant.model.OrderRequest;
import com.palovito.restaurant.model.OrderStatus;
import com.palovito.restaurant.model.Menu;
import com.palovito.restaurant.model.Category;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    @Mock
    private MenuService menuService;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private OrderService orderService;

    @Test
    void createOrder_ShouldReturnOrderWithCorrectDetails() {
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

        when(menuService.getMenu("menu1")).thenReturn(menu);
        doNothing().when(messagingTemplate).convertAndSend(anyString(), any(Order.class));

        // Set initial delay to a large value to prevent status change during test
        ReflectionTestUtils.setField(orderService, "initialDelay", 10000L);
        ReflectionTestUtils.setField(orderService, "manuallyUpdatedOrders", new ConcurrentHashMap<>());

        // When
        Order result = orderService.createOrder(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isNotNull();
        assertThat(result.getItems()).hasSize(1);
        assertThat(result.getItems().get(0).getMenu().getId()).isEqualTo("menu1");
        assertThat(result.getItems().get(0).getQuantity()).isEqualTo(2);
        assertThat(result.getStatus()).isEqualTo(OrderStatus.RECEIVED);
        double expectedTotal = menu.getPrice().doubleValue() * 2;
        assertThat(result.getTotal()).isEqualTo(expectedTotal);
        verify(messagingTemplate).convertAndSend(eq("/topic/orders"), any(Order.class));
    }

    @Test
    void updateOrderStatus_ShouldUpdateStatusAndNotifyClients() {
        // Given
        String orderId = "order1";
        String timestamp = Instant.now().toString();
        Order existingOrder = Order.builder()
            .id(orderId)
            .status(OrderStatus.RECEIVED)
            .items(new ArrayList<>())
            .timestamp(timestamp)
            .total(0.0)
            .build();
        
        ReflectionTestUtils.setField(orderService, "orders", 
            new ConcurrentHashMap<>(Map.of(orderId, existingOrder)));

        // When
        Order result = orderService.updateOrderStatus(orderId, OrderStatus.PROCESSING);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(OrderStatus.PROCESSING);
        assertThat(result.getTimestamp()).isEqualTo(timestamp);
        verify(messagingTemplate).convertAndSend(eq("/topic/orders/update"), any(Order.class));
    }
} 