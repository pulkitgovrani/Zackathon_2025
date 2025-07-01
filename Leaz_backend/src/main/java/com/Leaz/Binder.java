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

    // A simple constructor for our mock data
    public Binder(long id, String name) {
        this.id = id;
        this.name = name;
        this.dateCreated = LocalDateTime.now(); // In a real app, the DB would set this
    }

    // Getters and Setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(LocalDateTime dateCreated) {
        this.dateCreated = dateCreated;
    }
}
