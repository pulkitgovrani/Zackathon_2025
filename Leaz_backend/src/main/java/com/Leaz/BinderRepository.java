package com.Leaz;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Spring Data JPA repository for {@link Binder} entities.
 * This interface handles all database operations for binders.
 */
@Repository
public interface BinderRepository extends JpaRepository<Binder, Long> {

    /**
     * Finds all binders that are direct children of a specific parent binder.
     * Spring Data JPA automatically creates the query based on the method name.
     * @param parentId The ID of the parent binder.
     * @return A list of child binders.
     */
    List<Binder> findByParentId(Long parentId);

    /**
     * Finds all top-level binders (those that do not have a parent).
     * @return A list of root-level binders.
     */
    List<Binder> findByParentIdIsNull();

    /**
     * Checks if a binder with a given name already exists within a specific parent binder.
     * This is used to prevent duplicate binder names in the same folder.
     * @param name The name of the binder to check.
     * @param parentId The ID of the parent binder (can be null for root level).
     * @return True if a binder with that name exists, otherwise false.
     */
    boolean existsByNameAndParentId(String name, Long parentId);
}
