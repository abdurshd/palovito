package com.palovito.restaurant.mapper;

import com.palovito.restaurant.entity.OrderEntity;
import com.palovito.restaurant.entity.OrderItemEntity;
import com.palovito.restaurant.model.Order;
import com.palovito.restaurant.model.OrderItem;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

@Component
public class OrderMapper {
    private final MenuMapper menuMapper;
    
    public OrderMapper(MenuMapper menuMapper) {
        this.menuMapper = menuMapper;
    }
    
    public OrderEntity toEntity(Order model) {
        OrderEntity entity = new OrderEntity();
        entity.setId(model.getId());
        entity.setItems(model.getItems().stream().map(this::toEntity).collect(Collectors.toList()));
        entity.setStatus(model.getStatus());
        entity.setTimestamp(model.getTimestamp());
        entity.setTotal(model.getTotal());
        return entity;
    }
    
    public Order toModel(OrderEntity entity) {
        return Order.builder()
            .id(entity.getId())
            .status(entity.getStatus())
            .timestamp(entity.getTimestamp())
            .total(entity.getTotal())
            .items(entity.getItems().stream()
                .map(this::toOrderItem)
                .collect(Collectors.toList()))
            .build();
    }
    
    private OrderItemEntity toEntity(OrderItem item) {
        OrderItemEntity entity = new OrderItemEntity();
        entity.setQuantity(item.getQuantity());
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