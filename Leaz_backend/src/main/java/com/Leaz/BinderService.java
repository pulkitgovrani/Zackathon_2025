package com.Leaz;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class BinderService {

    private final List<Binder> binders = new ArrayList<>(Arrays.asList(
        new Binder(1L, "Q3 Client Contracts", null),
        new Binder(2L, "Internal Policies", null),
        new Binder(3L, "Sub-folder for Q3", 1L)
    ));
    private final AtomicLong idCounter = new AtomicLong(binders.size());

    public List<Binder> getRootBinders() {
        return binders.stream()
                      .filter(binder -> binder.getParentId() == null)
                      .collect(Collectors.toList());
    }

    public List<Binder> getBindersByParentId(Long parentId) {
        return binders.stream()
                      .filter(binder -> parentId.equals(binder.getParentId()))
                      .collect(Collectors.toList());
    }

    public Optional<Binder> getBinderById(Long id) {
        return binders.stream()
                      .filter(binder -> binder.getId() == id)
                      .findFirst();
    }

    /**
     * NEW: Returns a flat list of all binders.
     */
    public List<Binder> getAllBinders() {
        return binders;
    }

    public Binder createBinder(Binder newBinder) {
        if (newBinder.getName() == null || newBinder.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Binder name cannot be empty.");
        }
        final String trimmedName = newBinder.getName().trim();
        boolean nameExists = binders.stream()
            .filter(binder -> Objects.equals(binder.getParentId(), newBinder.getParentId()))
            .anyMatch(binder -> binder.getName().trim().equalsIgnoreCase(trimmedName));

        if (nameExists) {
            throw new DuplicateNameException("A binder with the name '" + newBinder.getName() + "' already exists in this location.");
        }

        newBinder.setId(idCounter.incrementAndGet());
        newBinder.setDateCreated(LocalDateTime.now());
        binders.add(newBinder);
        return newBinder;
    }

    public Optional<Binder> updateBinder(Long id, Binder updatedBinder) {
        if (updatedBinder.getName() == null || updatedBinder.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Binder name cannot be empty.");
        }
        Optional<Binder> existingBinderOpt = getBinderById(id);
        if (existingBinderOpt.isEmpty()) {
            return Optional.empty();
        }

        final String trimmedName = updatedBinder.getName().trim();
        boolean nameExists = binders.stream()
            .filter(binder -> !Objects.equals(binder.getId(), id)) // Exclude self
            .filter(binder -> Objects.equals(binder.getParentId(), existingBinderOpt.get().getParentId()))
            .anyMatch(binder -> binder.getName().trim().equalsIgnoreCase(trimmedName));

        if (nameExists) {
            throw new DuplicateNameException("A binder with the name '" + updatedBinder.getName() + "' already exists in this location.");
        }
        
        existingBinderOpt.get().setName(updatedBinder.getName());
        return existingBinderOpt;
    }
}