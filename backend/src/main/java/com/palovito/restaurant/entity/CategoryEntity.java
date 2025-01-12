package com.palovito.restaurant.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "categories")
@Data
public class CategoryEntity {
    @Id
    private String id;
    
    private String name;
    private String description;
}
