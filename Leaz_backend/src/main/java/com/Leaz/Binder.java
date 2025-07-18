package com.Leaz;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a 'binder' which acts as a folder for documents.
 * This class is a JPA entity that maps to the `binders` table in the database.
 */
@Entity
@Table(name = "binders")
public class Binder {

    /** The unique identifier for the binder. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The name of the binder, which cannot be null. */
    @Column(nullable = false)
    private String name;

    /** The timestamp when the binder was created. This is not updatable. */
    @Column(name = "date_created", updatable = false)
    private LocalDateTime dateCreated = LocalDateTime.now();

    /** The ID of the parent binder, if this is a sub-binder. Null for top-level binders. */
    @Column(name = "parent_id")
    private Long parentId;

    // Default constructor for JPA
    public Binder() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDateTime getDateCreated() { return dateCreated; }
    public void setDateCreated(LocalDateTime dateCreated) { this.dateCreated = dateCreated; }
    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }
}