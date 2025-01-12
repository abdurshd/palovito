package com.palovito.restaurant.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "menu_category")
public class MenuCategoryEntity {
    @Id
    private String id;
    private String menuId;
    private String categoryId;
} 