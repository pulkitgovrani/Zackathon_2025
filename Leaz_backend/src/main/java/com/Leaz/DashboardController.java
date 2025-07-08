package com.Leaz;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:4200", methods = {RequestMethod.GET, RequestMethod.OPTIONS})
public class DashboardController {

    @GetMapping("/")
    public DashboardNavigation getDashboard() {
        return new DashboardNavigation();
    }
}