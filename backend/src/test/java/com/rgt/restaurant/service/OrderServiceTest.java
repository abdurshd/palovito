package com.rgt.restaurant.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import com.rgt.restaurant.model.Order;
import com.rgt.restaurant.model.OrderRequest;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private OrderService orderService;

    @Test
    void createOrder_ShouldReturnOrderWithCorrectDetails() {
        // Given
        OrderRequest request = new OrderRequest();
        request.setFoodName("Pizza");
        request.setQuantity(2);

        // When
        Order result = orderService.createOrder(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getFoodName()).isEqualTo("Pizza");
        assertThat(result.getQuantity()).isEqualTo(2);
        verify(messagingTemplate).convertAndSend(eq("/topic/orders"), any(Order.class));
    }
} 