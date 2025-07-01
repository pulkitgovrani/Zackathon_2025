package com.Leaz;

import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    private final List<Document> documents = Arrays.asList(
        new Document(1L, "Project Proposal V1", "This is the first draft of the project proposal...", 1, "In Review", 1L),
        new Document(2L, "Meeting Notes Q2", "Discussion points from the Q2 stakeholder meeting...", 1, "Final", 1L),
        new Document(3L, "Annual Report 2024", "Initial draft of the 2024 annual report...", 1, "Draft", 2L),
        new Document(4L, "Onboarding Checklist", "Checklist for new employee onboarding...", 1, "Final", null)
    );

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
}
