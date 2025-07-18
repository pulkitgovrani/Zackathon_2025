package com.Leaz;

/**
 * A simple Data Transfer Object (DTO) to represent the main navigation links for the dashboard.
 * This object is returned by the root ("/") endpoint to guide the frontend application.
 */
public class DashboardNavigation {
    private final String binders = "/binders";
    private final String documents = "/documents";

    public String getBinders() {
        return binders;
    }

    public String getDocuments() {
        return documents;
    }
}
