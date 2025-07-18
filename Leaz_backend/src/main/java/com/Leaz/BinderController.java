package com.Leaz;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * REST controller for handling all binder-related API requests.
 */
@RestController
@RequestMapping("/binders")
public class BinderController {

    private final BinderService binderService;
    private final DocumentService documentService;

    @Autowired
    public BinderController(BinderService binderService, DocumentService documentService) {
        this.binderService = binderService;
        this.documentService = documentService;
    }

    /**
     * Fetches binders. If a parentId is provided, it fetches sub-binders.
     * Otherwise, it fetches only top-level (root) binders.
     */
    @GetMapping
    public List<Binder> listBinders(@RequestParam(required = false) Long parentId) {
        if (parentId != null) {
            return binderService.getBindersByParentId(parentId);
        }
        return binderService.getRootBinders();
    }
    
    /**
     * Fetches a flat list of all binders, used for populating dropdown menus.
     */
    @GetMapping("/all")
    public List<Binder> listAllBindersForDropdown() {
        return binderService.getAllBinders();
    }

    /**
     * Fetches a single binder by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Binder> getBinderById(@PathVariable Long id) {
        return binderService.getBinderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Fetches all documents contained within a specific binder.
     */
    @GetMapping("/{binderId}/documents")
    public List<Document> getDocumentsInBinder(@PathVariable Long binderId) {
        return documentService.getDocumentsByBinderId(binderId);
    }

    /**
     * Creates a new binder.
     */
    @PostMapping
    public Binder createBinder(@RequestBody Binder binder) {
        return binderService.createBinder(binder);
    }

    /**
     * Updates a binder's name.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Binder> updateBinder(@PathVariable Long id, @RequestBody Binder binder) {
        return binderService.updateBinder(id, binder)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Deletes a binder and all its contents.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBinder(@PathVariable Long id) {
        binderService.deleteBinder(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Moves a binder to a new parent.
     */
    @PutMapping("/{id}/move")
    public ResponseEntity<Binder> moveBinder(@PathVariable Long id, @RequestBody Map<String, Long> payload) {
        Long newParentId = payload.get("parentId");
        return binderService.moveBinder(id, newParentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}