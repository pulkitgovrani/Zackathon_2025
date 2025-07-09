package com.Leaz;

import java.time.LocalDateTime;

/**
 * Represents a 'document' with its content and metadata.
 * This class corresponds to the `documents` table in the database.
 */
public class Document {
    private long id;
    private String title;
    private String content;
    private int version;
    private String status;
    private LocalDateTime dateCreated;
    private LocalDateTime lastModified;
    private Long binderId; // Can be null if the document is not in a binder

    public Document() {
        // This empty constructor is required by Spring for data binding.
    }

    // A full constructor for creating new documents for our mock data
    public Document(long id, String title, String content, int version, String status, Long binderId) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.version = version;
        this.status = status;
        this.binderId = binderId;
        this.dateCreated = LocalDateTime.now();
        this.lastModified = LocalDateTime.now();
    }

    // Getters and Setters for all fields
    public long getId() { return id; }
    public void setId(long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public int getVersion() { return version; }
    public void setVersion(int version) { this.version = version; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getDateCreated() { return dateCreated; }
    public void setDateCreated(LocalDateTime dateCreated) { this.dateCreated = dateCreated; }
    public LocalDateTime getLastModified() { return lastModified; }
    public void setLastModified(LocalDateTime lastModified) { this.lastModified = lastModified; }
    public Long getBinderId() { return binderId; }
    public void setBinderId(Long binderId) { this.binderId = binderId; }
}
