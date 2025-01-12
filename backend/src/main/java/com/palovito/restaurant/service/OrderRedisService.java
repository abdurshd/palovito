package com.palovito.restaurant.service;

import com.palovito.restaurant.model.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class OrderRedisService {
    private final RedisTemplate<String, Object> redisTemplate;
    private static final String ORDER_KEY_PREFIX = "order:";
    
    public Set<String> getAllOrderKeys() {
        return redisTemplate.keys(ORDER_KEY_PREFIX + "*");
    }
    
    public void updateOrder(Order order) {
        String key = ORDER_KEY_PREFIX + order.getId();
        redisTemplate.opsForValue().set(key, order, 1, TimeUnit.HOURS);
    }

    public Order getOrder(String orderId) {
        String key = ORDER_KEY_PREFIX + orderId;
        return (Order) redisTemplate.opsForValue().get(key);
    }

    public Order saveOrder(Order order) {
        updateOrder(order);
        return order;
    }
} 