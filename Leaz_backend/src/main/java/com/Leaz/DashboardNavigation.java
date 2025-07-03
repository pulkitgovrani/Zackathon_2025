package com.Leaz;

/**
 * Represents the main navigation links for the dashboard.
 * This object is returned by the root ("/") endpoint.
 */
public class DashboardNavigation {
    private final String binders = "/binders";
    private final String documents = "/documents";

    // Getters are used by Spring to serialize this object into JSON
    public String getBinders() {
        return binders;
    }

    public String getDocuments() {
        return documents;
    }
}
