package com.Leaz;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    // Using ArrayList to allow modification
    private final List<Document> documents = new ArrayList<>(Arrays.asList(
        new Document(1L, "Project Proposal V1", "This is the first draft of the project proposal...", 1, "In Review", 1L),
        new Document(2L, "Meeting Notes Q2", "Discussion points from the Q2 stakeholder meeting...", 1, "Final", 1L),
        new Document(3L, "Annual Report 2024", "Initial draft of the 2024 annual report...", 1, "Draft", 2L),
        new Document(4L, "Onboarding Checklist", "Checklist for new employee onboarding...", 1, "Final", null)
    ));

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

    /**
     * NEW: Updates a document in our mock database.
     * In a real app, this would save to a SQL database.
     * @param updatedDocument The document object with the new content.
     * @return The updated document.
     */
    public Optional<Document> updateDocument(Long id, Document updatedDocument) {
        for (int i = 0; i < documents.size(); i++) {
            if (documents.get(i).getId() == id) {
                updatedDocument.setLastModified(LocalDateTime.now()); // Update timestamp
                documents.set(i, updatedDocument);
                return Optional.of(updatedDocument);
            }
        }
        return Optional.empty(); // Document not found
    }
}
