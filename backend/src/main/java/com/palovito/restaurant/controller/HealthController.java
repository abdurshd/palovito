package com.palovito.restaurant.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {
    private final RedisTemplate<String, Object> redisTemplate;
    private final JdbcTemplate jdbcTemplate;
    
    @GetMapping("/redis")
    public String checkRedis() {
        redisTemplate.opsForValue().set("health", "ok");
        return "Redis is working";
    }
    
    @GetMapping("/db")
    public String checkDatabase() {
        jdbcTemplate.queryForObject("SELECT 1", Integer.class);
        return "Database is working";
    }
} 