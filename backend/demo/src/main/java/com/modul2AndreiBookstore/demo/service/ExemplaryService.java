package com.modul2AndreiBookstore.demo.service;

import com.modul2AndreiBookstore.demo.repository.BookRepository;
import com.modul2AndreiBookstore.demo.repository.ExemplaryRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.modul2AndreiBookstore.demo.entities.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExemplaryService {
    @Autowired
    private ExemplaryRepository exemplaryRepository;

    @Autowired
    private BookRepository bookRepository;

    @Transactional
    public List<Exemplary> create(Long bookId, Integer nrExemplaries, Exemplary exemplary) {
        if (exemplary.getId() != null) {
            throw new RuntimeException("You cannot provide an ID to a new exemplary that you want to create");
        }

        Book existentBook = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Book with id " + bookId + " not found"));

        List<Exemplary> exemplaries = new ArrayList<>();

        for (int i = 0; i < nrExemplaries; ++i) {
            Exemplary newExemplary = new Exemplary();
            newExemplary.setPublisher(exemplary.getPublisher());
            newExemplary.setMaxBorrowDays(exemplary.getMaxBorrowDays());
            newExemplary.setBook(existentBook);

            // Save the exemplary first
            Exemplary savedExemplary = exemplaryRepository.save(newExemplary);
            
            // Add to collection (this won't trigger additional saves due to mappedBy)
            existentBook.addExemplary(savedExemplary);
            exemplaries.add(savedExemplary);
        }

        return exemplaries;
    }

    public Page<Exemplary> findAllPaginated(Long bookId, Integer pageNumber, Integer numberOfElements) {
        Pageable pageable = (pageNumber != null && numberOfElements != null)
                ? PageRequest.of(pageNumber, numberOfElements)
                : Pageable.unpaged();

        return exemplaryRepository.findByBookId(bookId, pageable);
    }

    public Exemplary updateMaxBorrowDays(Long exemplaryId, Integer maxBorrowDays) {
        Exemplary exemplary = exemplaryRepository.findById(exemplaryId)
                .orElseThrow(() -> new EntityNotFoundException("Exemplary with id " + exemplaryId + " not found"));

        exemplary.setMaxBorrowDays(maxBorrowDays);
        return exemplaryRepository.save(exemplary);
    }

    public void removeExemplary(Long exemplaryId) {
        if (!exemplaryRepository.existsById(exemplaryId)) {
            throw new EntityNotFoundException("Exemplary with id " + exemplaryId + " not found");
        }
        exemplaryRepository.deleteById(exemplaryId);
    }

    @Transactional
    public void removeExemplaryFromBook(Long bookId, Long exemplaryId) {
        Exemplary existentExemplary = exemplaryRepository.findById(exemplaryId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Exemplary with id " + exemplaryId + " not found"));

        Book existentBook = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Book with id " + bookId + " not found"));

        existentBook.removeExemplary(existentExemplary);
        existentExemplary.setBook(null);
        bookRepository.save(existentBook);
    }
}
