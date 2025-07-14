package com.talkie.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.BufferingClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class GlobalConfig {
    @Bean
    public RestClient restClient () {
        return RestClient.builder().requestFactory(new BufferingClientHttpRequestFactory(new SimpleClientHttpRequestFactory())).build();
    }
}
