package com.palovito.restaurant.repository;

import com.palovito.restaurant.entity.MenuEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface MenuRepository extends JpaRepository<MenuEntity, String> {
    List<MenuEntity> findByCategoryId(String categoryId);

    @Modifying
    @Query("DELETE FROM MenuEntity m WHERE m.id = :id")
    void deleteById(@Param("id") String id);
}