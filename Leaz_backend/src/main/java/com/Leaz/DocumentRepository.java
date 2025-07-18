package com.Leaz;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Spring Data JPA repository for {@link Document} entities.
 * This interface handles all database operations for documents.
 */
@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    /**
     * Finds all documents that belong to a specific binder.
     * @param binderId The ID of the binder.
     * @return A list of documents within that binder.
     */
    List<Document> findByBinderId(Long binderId);

    /**
     * Checks if a document with a given title already exists anywhere in the system.
     * @param title The title to check for.
     * @return True if a document with that title exists, otherwise false.
     */
    boolean existsByTitle(String title);

    /**
     * Checks if a document with a given title exists, excluding a document with a specific ID.
     * This is used when renaming a document to ensure the new title is not already taken by another document.
     * @param title The new title to check for.
     * @param id The ID of the document being updated, to exclude it from the check.
     * @return True if another document has that title, otherwise false.
     */
    boolean existsByTitleAndIdNot(String title, Long id);
}
