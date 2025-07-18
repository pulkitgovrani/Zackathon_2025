package com.Leaz;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * Service class for managing binder-related business logic.
 */
@Service
public class BinderService {

    @Autowired
    private BinderRepository binderRepository;

    /**
     * Retrieves a list of all top-level binders (those without a parent).
     * @return A list of root binders.
     */
    public List<Binder> getRootBinders() {
        return binderRepository.findByParentIdIsNull();
    }

    /**
     * Retrieves a list of all binders that are direct children of a given parent.
     * @param parentId The ID of the parent binder.
     * @return A list of sub-binders.
     */
    public List<Binder> getBindersByParentId(Long parentId) {
        return binderRepository.findByParentId(parentId);
    }

    /**
     * Finds a single binder by its unique ID.
     * @param id The ID of the binder to find.
     * @return An Optional containing the binder if found.
     */
    public Optional<Binder> getBinderById(Long id) {
        return binderRepository.findById(id);
    }
    
    /**
     * Retrieves a flat list of all binders in the system.
     * @return A list of all binders.
     */
    public List<Binder> getAllBinders() {
        return binderRepository.findAll();
    }

    /**
     * Creates a new binder, ensuring its name is unique within its location (parent binder).
     * @param newBinder The binder object to create.
     * @return The saved binder with its new ID.
     */
    public Binder createBinder(Binder newBinder) {
        if (newBinder.getName() == null || newBinder.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Binder name cannot be empty.");
        }
        if (binderRepository.existsByNameAndParentId(newBinder.getName().trim(), newBinder.getParentId())) {
            throw new DuplicateNameException("A binder with this name already exists in this location.");
        }
        return binderRepository.save(newBinder);
    }

    /**
     * Updates an existing binder's name, checking for duplicates.
     * @param id The ID of the binder to update.
     * @param updatedBinder The binder object with the new name.
     * @return An Optional containing the updated binder.
     */
    public Optional<Binder> updateBinder(Long id, Binder updatedBinder) {
        if (updatedBinder.getName() == null || updatedBinder.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Binder name cannot be empty.");
        }
        return binderRepository.findById(id).map(binder -> {
            if (binderRepository.existsByNameAndParentId(updatedBinder.getName().trim(), binder.getParentId())) {
                throw new DuplicateNameException("A binder with this name already exists in this location.");
            }
            binder.setName(updatedBinder.getName());
            return binderRepository.save(binder);
        });
    }
    
    /**
     * Deletes a binder and all of its contents (sub-binders and documents).
     * @param id The ID of the binder to delete.
     */
    public void deleteBinder(Long id) {
        if (!binderRepository.existsById(id)) {
            throw new NotFoundException("Binder with ID " + id + " not found.");
        }
        binderRepository.deleteById(id);
    }

    /**
     * Moves a binder to a new parent binder.
     * @param binderId The ID of the binder to move.
     * @param newParentId The ID of the new parent binder (can be null for the root level).
     * @return An Optional containing the updated binder.
     */
    public Optional<Binder> moveBinder(Long binderId, Long newParentId) {
        Binder binderToMove = binderRepository.findById(binderId)
            .orElseThrow(() -> new NotFoundException("Binder with ID " + binderId + " not found."));

        // Prevent a binder from being moved into itself or one of its own children.
        if (Objects.equals(binderId, newParentId) || isDescendant(binderId, newParentId)) {
            throw new IllegalArgumentException("A binder cannot be moved into itself or one of its sub-binders.");
        }
        binderToMove.setParentId(newParentId);
        return Optional.of(binderRepository.save(binderToMove));
    }

    /**
     * Helper method to check if a binder is a descendant of another.
     * @param parentId The potential ancestor binder's ID.
     * @param childId The potential descendant binder's ID.
     * @return True if childId is a descendant of parentId.
     */
    private boolean isDescendant(Long parentId, Long childId) {
        if (childId == null) return false;
        Long currentId = childId;
        while (currentId != null) {
            Binder currentBinder = binderRepository.findById(currentId).orElse(null);
            if (currentBinder == null) return false;
            if (Objects.equals(currentBinder.getParentId(), parentId)) return true;
            currentId = currentBinder.getParentId();
        }
        return false;
    }
}
