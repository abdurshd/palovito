package com.palovito.restaurant.mapper;

import com.palovito.restaurant.entity.MenuEntity;
import com.palovito.restaurant.model.Menu;
import org.springframework.stereotype.Component;

@Component
public class MenuMapper {
    
    public MenuEntity toEntity(Menu menu) {
        if (menu == null) {
            return null;
        }
        
        MenuEntity entity = new MenuEntity();
        entity.setId(menu.getId());
        entity.setName(menu.getName());
        entity.setPrice(menu.getPrice());
        entity.setDescription(menu.getDescription());
        return entity;
    }
    
    public Menu toModel(MenuEntity entity) {
        if (entity == null) {
            return null;
        }
        
        return Menu.builder()
            .id(entity.getId())
            .name(entity.getName())
            .price(entity.getPrice())
            .description(entity.getDescription())
            .build();
    }
}
