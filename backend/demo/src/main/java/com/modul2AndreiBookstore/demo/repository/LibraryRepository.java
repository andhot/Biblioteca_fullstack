package com.modul2AndreiBookstore.demo.repository;

import com.modul2AndreiBookstore.demo.entities.Library;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

    // Statistics methods
    @Query("SELECT l.name, COUNT(b) FROM library l LEFT JOIN l.books b GROUP BY l.id, l.name ORDER BY COUNT(b) DESC")
    List<Object[]> findTopLibrariesByBookCount();
}
