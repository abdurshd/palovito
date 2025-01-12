package com.palovito.restaurant.repository;

import com.palovito.restaurant.entity.OrderEntity;

import java.time.Instant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, String> {
    @Modifying
    @Query("DELETE FROM OrderEntity o WHERE o.timestamp < :cutoff")
    void deleteByTimestampBefore(@Param("cutoff") Instant cutoff);
} 