package com.palovito.restaurant.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
public class CategoryEntity {
    @Id
    private String id;
    
    private String name;
    private String description;

    public CategoryEntity(String id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}
