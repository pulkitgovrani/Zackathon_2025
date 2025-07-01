package com.Leaz;

import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class BinderService {

    private final List<Binder> binders = Arrays.asList(
        new Binder(1L, "Q3 Client Contracts"),
        new Binder(2L, "Internal Policies")
    );

    public List<Binder> getAllBinders() {
        return binders;
    }

    public Optional<Binder> getBinderById(Long id) {
        return binders.stream()
                      .filter(binder -> binder.getId() == id)
                      .findFirst();
    }
}
