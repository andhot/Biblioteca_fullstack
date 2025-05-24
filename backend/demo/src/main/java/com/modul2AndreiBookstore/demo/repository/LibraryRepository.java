package com.modul2AndreiBookstore.demo.repository;

import com.modul2AndreiBookstore.demo.entities.Library;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LibraryRepository extends JpaRepository<Library, Long> {

    // Interface for DTO projection
    interface LibraryNameOnly {
        Long getId();
        String getName();
    }

    // Method to fetch libraries using the projection
    List<LibraryNameOnly> findAllProjectedBy();
}
