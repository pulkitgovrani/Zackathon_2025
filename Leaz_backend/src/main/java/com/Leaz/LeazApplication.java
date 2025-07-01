package com.Leaz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController // Tells Spring this class will handle web requests
public class LeazApplication {

    public static void main(String[] args) {
        SpringApplication.run(LeazApplication.class, args);
    }

    /**
     * This method creates a web endpoint.
     * When you visit http://localhost:8080/ in your browser,
     * this method will be called and will return the text "Leaz Backend is Live!".
     */
    @GetMapping("/") // Maps to the root URL
    public String home() {
        return "Leaz Backend is Live!";
    }
}
