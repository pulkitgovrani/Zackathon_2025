package com.Leaz;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    private final List<Document> documents = new ArrayList<>(Arrays.asList(
        new Document(1L, "Project Proposal V1", "This is the first draft of the project proposal...", 1, "In Review", 1L),
        new Document(2L, "Meeting Notes Q2", "Discussion points from the Q2 stakeholder meeting...", 1, "Final", 1L),
        new Document(3L, "Annual Report 2024", "Initial draft of the 2024 annual report...", 1, "Draft", 2L),
        new Document(4L, "Onboarding Checklist", "Checklist for new employee onboarding...", 1, "Final", null)
    ));
    
    private final AtomicLong idCounter = new AtomicLong(documents.size());

    public List<Document> getAllDocuments() {
        return documents;
    }

    public Optional<Document> getDocumentById(Long id) {
        return documents.stream()
                        .filter(doc -> doc.getId() == id)
                        .findFirst();
    }

    public List<Document> getDocumentsByBinderId(Long binderId) {
        return documents.stream()
                        .filter(doc -> binderId.equals(doc.getBinderId()))
                        .collect(Collectors.toList());
    }

    public Optional<Document> updateDocument(Long id, Document updatedDocument) {
        if (updatedDocument.getTitle() == null || updatedDocument.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Document title cannot be empty.");
        }
        Optional<Document> existingDocOpt = getDocumentById(id);
        if (existingDocOpt.isEmpty()) {
            return Optional.empty();
        }

        final String trimmedTitle = updatedDocument.getTitle().trim();
        boolean titleExists = documents.stream()
            .filter(doc -> doc.getId() != id)
            .anyMatch(doc -> doc.getTitle().trim().equalsIgnoreCase(trimmedTitle));

        if (titleExists) {
            throw new DuplicateNameException("A document with the title '" + updatedDocument.getTitle() + "' already exists.");
        }

        Document docToUpdate = existingDocOpt.get();
        docToUpdate.setTitle(updatedDocument.getTitle());
        docToUpdate.setContent(updatedDocument.getContent());
        docToUpdate.setStatus(updatedDocument.getStatus());
        docToUpdate.setBinderId(updatedDocument.getBinderId());
        docToUpdate.setLastModified(LocalDateTime.now());
        // Version would typically be incremented here
        // docToUpdate.setVersion(docToUpdate.getVersion() + 1);

        return Optional.of(docToUpdate);
    }

    public Document createDocument(Document newDocument) {
        if (newDocument.getTitle() == null || newDocument.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Document title cannot be empty.");
        }
        final String trimmedTitle = newDocument.getTitle().trim();
        boolean titleExists = documents.stream()
            .anyMatch(doc -> doc.getTitle().trim().equalsIgnoreCase(trimmedTitle));

        if (titleExists) {
            throw new DuplicateNameException("A document with the title '" + newDocument.getTitle() + "' already exists.");
        }

        newDocument.setId(idCounter.incrementAndGet());
        newDocument.setVersion(1);
        newDocument.setStatus("Draft");
        newDocument.setDateCreated(LocalDateTime.now());
        newDocument.setLastModified(LocalDateTime.now());
        documents.add(newDocument);
        return newDocument;
    }
}
