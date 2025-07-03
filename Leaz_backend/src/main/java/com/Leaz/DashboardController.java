package com.Leaz;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {

    /**
     * The root endpoint that provides navigation links to the main resources.
     * Accessible at GET http://localhost:8080/
     */
    @GetMapping("/")
    public DashboardNavigation getDashboard() {
        return new DashboardNavigation();
    }
}
