package com.palovito.restaurant.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.palovito.restaurant.model.Order;
import com.palovito.restaurant.entity.OrderEntity;
import com.palovito.restaurant.repository.OrderRepository;
import com.palovito.restaurant.mapper.OrderMapper;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderSyncService {
    private final OrderRedisService redisService;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    
    @Scheduled(fixedDelayString = "${order.sync.interval}")
    @Transactional
    public void syncOrdersToDatabase() {
        try {
            Set<String> orderKeys = redisService.getAllOrderKeys();
            for (String key : orderKeys) {
                Order order = redisService.getOrder(key);
                if (order != null) {
                    OrderEntity entity = orderMapper.toEntity(order);
                    orderRepository.save(entity);
                    log.debug("Synced order {} to database", key);
                }
            }
        } catch (Exception e) {
            log.error("Error syncing orders to database", e);
        }
    }
} 