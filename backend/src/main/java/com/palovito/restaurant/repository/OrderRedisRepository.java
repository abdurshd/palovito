package com.palovito.restaurant.repository;

import com.palovito.restaurant.model.Order;
import org.springframework.data.keyvalue.repository.KeyValueRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRedisRepository extends KeyValueRepository<Order, String> {
} 