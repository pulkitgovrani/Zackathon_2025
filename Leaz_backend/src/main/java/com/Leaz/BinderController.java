package com.Leaz;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/binders")
@CrossOrigin(origins = "http://localhost:4200", methods = {RequestMethod.GET, RequestMethod.OPTIONS})
public class BinderController {

    private final BinderService binderService;
    private final DocumentService documentService;

    @Autowired
    public BinderController(BinderService binderService, DocumentService documentService) {
        this.binderService = binderService;
        this.documentService = documentService;
    }

    @GetMapping
    public List<Binder> listAllBinders() {
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
}