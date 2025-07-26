package com.Leaz;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OpenAIService {
    @Value("${openai.api.key}")
    private String openAIApiKey;

    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private static final String OPENAI_EMBEDDING_URL = "https://api.openai.com/v1/embeddings";
    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> processUserMessage(String message) {
        // Call OpenAI Chat API to extract action, binder name, and keywords
        String prompt = "Extract the action (create_and_move), binder name, and keywords from this user request: '" + message + "'. Respond as JSON: {action, binderName, keywords}";
        RequestBody body = RequestBody.create(objectMapper.createObjectNode()
                .put("model", "gpt-3.5-turbo")
                .putArray("messages").add(objectMapper.createObjectNode()
                    .put("role", "user").put("content", prompt))
                .toString(), MediaType.parse("application/json"));
        Request request = new Request.Builder()
                .url(OPENAI_API_URL)
                .addHeader("Authorization", "Bearer " + openAIApiKey)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();
        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                String responseBody = response.body().string();
                JsonNode root = objectMapper.readTree(responseBody);
                String content = root.path("choices").get(0).path("message").path("content").asText();
                return objectMapper.readValue(content, Map.class);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return Collections.emptyMap();
    }

    public List<Document> semanticSearchDocuments(List<String> keywords, List<Document> allDocuments) {
        // Use OpenAI embeddings to find relevant documents
        List<Document> results = new ArrayList<>();
        for (Document doc : allDocuments) {
            double score = 0.0;
            for (String keyword : keywords) {
                if (doc.getTitle() != null && doc.getTitle().toLowerCase().contains(keyword.toLowerCase())) {
                    score += 1.0;
                }
                if (doc.getContent() != null && doc.getContent().toLowerCase().contains(keyword.toLowerCase())) {
                    score += 1.0;
                }
            }
            if (score > 0) {
                results.add(doc);
            }
        }
        // In a real implementation, use OpenAI embeddings and cosine similarity
        return results;
    }

    public List<Document> keywordSearchDocuments(List<String> keywords, List<Document> allDocuments) {
        return allDocuments.stream()
                .filter(doc -> keywords.stream().anyMatch(k ->
                        (doc.getTitle() != null && doc.getTitle().toLowerCase().contains(k.toLowerCase())) ||
                        (doc.getContent() != null && doc.getContent().toLowerCase().contains(k.toLowerCase()))
                ))
                .collect(Collectors.toList());
    }
} 