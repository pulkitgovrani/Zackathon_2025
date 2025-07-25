package com.Leaz;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/ai-assistant")
public class AIAssistantController {
    @Autowired
    private DocumentService documentService;
    @Autowired
    private BinderService binderService;
    @Autowired
    private OpenAIService openAIService;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chatWithAI(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");
        // 1. Use OpenAI to parse intent and extract entities
        Map<String, Object> aiResult = openAIService.processUserMessage(userMessage);
        // 2. Perform actions (search, create binder, move documents)
        // aiResult contains: action, binderName, documentKeywords, etc.
        String action = (String) aiResult.get("action");
        String binderName = (String) aiResult.get("binderName");
        List<String> keywords = (List<String>) aiResult.get("keywords");
        List<Document> foundDocs = new ArrayList<>();
        if (keywords != null && !keywords.isEmpty()) {
            foundDocs = openAIService.semanticSearchDocuments(keywords, documentService.getAllDocuments());
            if (foundDocs.isEmpty()) {
                foundDocs = openAIService.keywordSearchDocuments(keywords, documentService.getAllDocuments());
            }
        }
        Binder createdBinder = null;
        if ("create_and_move".equals(action) && binderName != null && !foundDocs.isEmpty()) {
            Binder binder = new Binder();
            binder.setName(binderName);
            createdBinder = binderService.createBinder(binder);
            for (Document doc : foundDocs) {
                documentService.moveDocument(doc.getId(), createdBinder.getId());
            }
        }
        Map<String, Object> response = new HashMap<>();
        response.put("action", action);
        response.put("binderName", binderName);
        response.put("createdBinder", createdBinder);
        response.put("movedDocuments", foundDocs);
        response.put("aiResult", aiResult);
        return ResponseEntity.ok(response);
    }
} 