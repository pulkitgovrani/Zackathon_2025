package com.Leaz;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/binders")
@CrossOrigin(origins = "http://localhost:4200", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.OPTIONS})
public class BinderController {

    private final BinderService binderService;
    private final DocumentService documentService;

    @Autowired
    public BinderController(BinderService binderService, DocumentService documentService) {
        this.binderService = binderService;
        this.documentService = documentService;
    }

    @GetMapping
    public List<Binder> listBinders(@RequestParam(required = false) Long parentId) {
        if (parentId != null) {
            return binderService.getBindersByParentId(parentId);
        }
        return binderService.getRootBinders();
    }
    
    /**
     * NEW: Endpoint to get a flat list of all binders for dropdowns.
     */
    @GetMapping("/all")
    public List<Binder> listAllBindersForDropdown() {
        return binderService.getAllBinders();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Binder> getBinderById(@PathVariable Long id) {
        return binderService.getBinderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{binderId}/documents")
    public List<Document> getDocumentsInBinder(@PathVariable Long binderId) {
        return documentService.getDocumentsByBinderId(binderId);
    }

    @PostMapping
    public Binder createBinder(@RequestBody Binder binder) {
        return binderService.createBinder(binder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Binder> updateBinder(@PathVariable Long id, @RequestBody Binder binder) {
        return binderService.updateBinder(id, binder)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
