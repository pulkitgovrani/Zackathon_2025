package com.Leaz;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for managing document-related business logic.
 * This class acts as an intermediary between the controller and the repository.
 */
@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    /**
     * Retrieves all documents from the database.
     * @return A list of all documents.
     */
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    /**
     * Retrieves a single document by its unique ID.
     * @param id The ID of the document.
     * @return An Optional containing the document if found.
     */
    public Optional<Document> getDocumentById(Long id) {
        return documentRepository.findById(id);
    }

    /**
     * Retrieves all documents that are located within a specific binder.
     * @param binderId The ID of the binder.
     * @return A list of documents.
     */
    public List<Document> getDocumentsByBinderId(Long binderId) {
        return documentRepository.findByBinderId(binderId);
    }

    /**
     * Updates an existing document's properties.
     * @param id The ID of the document to update.
     * @param updatedDocument A document object containing the new data.
     * @return An Optional containing the updated document if successful.
     * @throws IllegalArgumentException if the document title is empty.
     * @throws DuplicateNameException if the new title is already taken by another document.
     */
    public Optional<Document> updateDocument(Long id, Document updatedDocument) {
        if (updatedDocument.getTitle() == null || updatedDocument.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Document title cannot be empty.");
        }
        if (documentRepository.existsByTitleAndIdNot(updatedDocument.getTitle().trim(), id)) {
            throw new DuplicateNameException("A document with this title already exists.");
        }
        return documentRepository.findById(id).map(doc -> {
            doc.setTitle(updatedDocument.getTitle());
            doc.setContent(updatedDocument.getContent());
            doc.setStatus(updatedDocument.getStatus());
            doc.setBinderId(updatedDocument.getBinderId());
            doc.setLastModified(LocalDateTime.now());
            return documentRepository.save(doc);
        });
    }

    /**
     * Creates a new document.
     * @param newDocument The document object to be saved.
     * @return The newly created document with its generated ID.
     * @throws IllegalArgumentException if the document title is empty.
     * @throws DuplicateNameException if the title is already taken.
     */
    public Document createDocument(Document newDocument) {
        if (newDocument.getTitle() == null || newDocument.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Document title cannot be empty.");
        }
        if (documentRepository.existsByTitle(newDocument.getTitle().trim())) {
            throw new DuplicateNameException("A document with this title already exists.");
        }
        return documentRepository.save(newDocument);
    }

    /**
     * Deletes a document by its ID.
     * @param id The ID of the document to delete.
     */
    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }

    /**
     * Updates only the status of a document.
     * @param id The ID of the document to update.
     * @param status The new status string.
     * @return An Optional containing the updated document.
     */
    public Optional<Document> updateDocumentStatus(Long id, String status) {
        return documentRepository.findById(id).map(doc -> {
            doc.setStatus(status);
            doc.setLastModified(LocalDateTime.now());
            return documentRepository.save(doc);
        });
    }

    /**
     * Moves a document to a different binder.
     * @param documentId The ID of the document to move.
     * @param newBinderId The ID of the destination binder (can be null).
     * @return An Optional containing the updated document.
     */
    public Optional<Document> moveDocument(Long documentId, Long newBinderId) {
        return documentRepository.findById(documentId).map(doc -> {
            doc.setBinderId(newBinderId);
            doc.setLastModified(LocalDateTime.now());
            return documentRepository.save(doc);
        });
    }

    /**
     * Creates a copy of an existing document.
     * The copy will have a unique title (e.g., "Title - Copy") and be in 'Draft' status.
     * @param id The ID of the document to copy.
     * @return The newly created document copy.
     * @throws NotFoundException if the original document does not exist.
     */
    public Document copyDocument(Long id) {
        Document original = documentRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Document with ID " + id + " not found."));

        String baseTitle = original.getTitle().replaceAll(" - Copy(\\s*\\(\\d+\\))?$", "") + " - Copy";
        String newTitle = baseTitle;
        int copyCount = 2;
        while (documentRepository.existsByTitle(newTitle)) {
            newTitle = baseTitle + " (" + copyCount++ + ")";
        }

        Document copy = new Document();
        copy.setTitle(newTitle);
        copy.setContent(original.getContent());
        copy.setBinderId(original.getBinderId());
        
        return documentRepository.save(copy);
    }
}
