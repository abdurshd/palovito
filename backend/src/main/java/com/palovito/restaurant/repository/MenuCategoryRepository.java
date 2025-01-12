package com.palovito.restaurant.repository;

import com.palovito.restaurant.entity.MenuCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuCategoryRepository extends JpaRepository<MenuCategoryEntity, String> {
    @Modifying
    @Query("DELETE FROM MenuCategoryEntity mc WHERE mc.menuId = :menuId")
    void deleteByMenuId(@Param("menuId") String menuId);
} 