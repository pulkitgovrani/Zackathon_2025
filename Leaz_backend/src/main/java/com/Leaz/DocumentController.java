package com.Leaz;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for handling all document-related API requests.
 * This class defines the public API endpoints for documents.
 */
@RestController
@RequestMapping("/documents")
public class DocumentController {

    private final DocumentService documentService;

    @Autowired
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    /**
     * Handles GET requests to /documents.
     * @return A list of all documents in the system.
     */
    @GetMapping
    public List<Document> listAllDocuments() {
        return documentService.getAllDocuments();
    }

    /**
     * Handles GET requests to /documents/{id}.
     * @param id The ID of the document to retrieve.
     * @return A ResponseEntity containing the document or a 404 Not Found error.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        return documentService.getDocumentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Handles PUT requests to /documents/{id}.
     * Updates an existing document with the data from the request body.
     * @param id The ID of the document to update.
     * @param document The document object with the new data.
     * @return A ResponseEntity containing the updated document or a 404 error.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Document> updateDocument(@PathVariable Long id, @RequestBody Document document) {
        return documentService.updateDocument(id, document)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Handles POST requests to /documents.
     * Creates a new document.
     * @param document The document data from the request body.
     * @return The newly created document.
     */
    @PostMapping
    public Document createDocument(@RequestBody Document document) {
        return documentService.createDocument(document);
    }

    /**
     * Handles DELETE requests to /documents/{id}.
     * @param id The ID of the document to delete.
     * @return A ResponseEntity with a 204 No Content status.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Handles PUT requests to /documents/{id}/status.
     * Updates only the status of a document.
     * @param id The ID of the document.
     * @param payload A map containing the new "status".
     * @return A ResponseEntity containing the updated document or a 404 error.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Document> updateDocumentStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return documentService.updateDocumentStatus(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Handles PUT requests to /documents/{id}/move.
     * Moves a document to a new binder.
     * @param id The ID of the document to move.
     * @param payload A map containing the "binderId" of the new location.
     * @return A ResponseEntity containing the updated document or a 404 error.
     */
    @PutMapping("/{id}/move")
    public ResponseEntity<Document> moveDocument(@PathVariable Long id, @RequestBody Map<String, Long> payload) {
        Long newBinderId = payload.get("binderId");
        return documentService.moveDocument(id, newBinderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Handles POST requests to /documents/{id}/copy.
     * Creates a copy of an existing document.
     * @param id The ID of the document to copy.
     * @return The newly created document copy.
     */
    @PostMapping("/{id}/copy")
    public Document copyDocument(@PathVariable Long id) {
        return documentService.copyDocument(id);
    }
}
