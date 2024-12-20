package com.rgt.restaurant.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.google.common.util.concurrent.RateLimiter;

@Configuration
public class RateLimitConfig {
    @Bean
    public RateLimiter rateLimiter() {
        return RateLimiter.create(100.0); // 100 requests per second
    }
} 