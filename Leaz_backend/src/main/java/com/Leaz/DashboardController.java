package com.Leaz;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for the root/dashboard endpoint.
 */
@RestController
public class DashboardController {

    /**
     * Provides the main navigation links for the application.
     * @return A DashboardNavigation object with paths to main resources.
     */
    @GetMapping("/")
    public DashboardNavigation getDashboard() {
        return new DashboardNavigation();
    }
}