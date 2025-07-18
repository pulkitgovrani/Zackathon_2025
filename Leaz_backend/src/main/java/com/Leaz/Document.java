package com.Leaz;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a 'document' with its content and metadata.
 * This class is a JPA entity that maps to the `documents` table in the database.
 */
@Entity
@Table(name = "documents")
public class Document {

    /** The unique identifier for the document. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The title of the document. Must be unique and cannot be null. */
    @Column(nullable = false, unique = true)
    private String title;

    /** The main content of the document, stored as a large text block. */
    @Lob 
    private String content;

    /** The current status of the document (e.g., 'Draft', 'Final'). Defaults to 'Draft'. */
    @Column(nullable = false)
    private String status = "Draft";

    /** The timestamp when the document was first created. */
    @Column(name = "date_created", updatable = false)
    private LocalDateTime dateCreated = LocalDateTime.now();

    /** The timestamp when the document was last modified. */
    @Column(name = "last_modified")
    private LocalDateTime lastModified = LocalDateTime.now();

    /** The ID of the binder this document belongs to. Can be null. */
    @Column(name = "binder_id")
    private Long binderId;

    // Default constructor for JPA
    public Document() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getDateCreated() { return dateCreated; }
    public void setDateCreated(LocalDateTime dateCreated) { this.dateCreated = dateCreated; }
    public LocalDateTime getLastModified() { return lastModified; }
    public void setLastModified(LocalDateTime lastModified) { this.lastModified = lastModified; }
    public Long getBinderId() { return binderId; }
    public void setBinderId(Long binderId) { this.binderId = binderId; }
}