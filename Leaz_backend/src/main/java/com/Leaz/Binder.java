package com.Leaz;

import java.time.LocalDateTime;

/**
 * Represents a 'binder' which acts as a folder for documents.
 * This class corresponds to the `binders` table in the database.
 */
public class Binder {
    private long id;
    private String name;
    private LocalDateTime dateCreated;
    private Long parentId; // NEW: To support nested binders

    // Default constructor for JSON deserialization
    public Binder() {}

    // A simple constructor for our mock data
    public Binder(long id, String name, Long parentId) {
        this.id = id;
        this.name = name;
        this.parentId = parentId;
        this.dateCreated = LocalDateTime.now();
    }

    // Getters and Setters
    public long getId() { return id; }
    public void setId(long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDateTime getDateCreated() { return dateCreated; }
    public void setDateCreated(LocalDateTime dateCreated) { this.dateCreated = dateCreated; }
    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }
}