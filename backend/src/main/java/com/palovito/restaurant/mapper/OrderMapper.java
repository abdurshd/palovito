package com.palovito.restaurant.mapper;

import com.palovito.restaurant.entity.OrderEntity;
import com.palovito.restaurant.entity.OrderItemEntity;
import com.palovito.restaurant.model.Order;
import com.palovito.restaurant.model.OrderItem;
import com.palovito.restaurant.model.OrderStatus;
import org.springframework.stereotype.Component;
import java.time.Instant;
import java.util.stream.Collectors;

@Component
public class OrderMapper {
    private final MenuMapper menuMapper;
    
    public OrderMapper(MenuMapper menuMapper) {
        this.menuMapper = menuMapper;
    }
    
    public OrderEntity toEntity(Order order) {
        OrderEntity entity = new OrderEntity();
        entity.setId(order.getId());
        entity.setStatus(order.getStatus());
        entity.setTimestamp(Instant.parse(order.getTimestamp()));
        entity.setTotal(order.getTotal());
        
        entity.setItems(order.getItems().stream()
            .map(this::toOrderItemEntity)
            .collect(Collectors.toList()));
            
        return entity;
    }
    
    public Order toModel(OrderEntity entity) {
        return Order.builder()
            .id(entity.getId())
            .status(entity.getStatus())
            .timestamp(entity.getTimestamp().toString())
            .total(entity.getTotal())
            .items(entity.getItems().stream()
                .map(this::toOrderItem)
                .collect(Collectors.toList()))
            .build();
    }
    
    private OrderItemEntity toOrderItemEntity(OrderItem item) {
        OrderItemEntity entity = new OrderItemEntity();
        entity.setQuantity(item.getQuantity());
        // You'll need to implement MenuMapper for this conversion
        entity.setMenu(menuMapper.toEntity(item.getMenu()));
        return entity;
    }
    
    private OrderItem toOrderItem(OrderItemEntity entity) {
        return new OrderItem(
            menuMapper.toModel(entity.getMenu()),
            entity.getQuantity()
        );
    }
} 