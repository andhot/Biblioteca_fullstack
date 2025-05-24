package com.modul2AndreiBookstore.demo.service;

import com.modul2AndreiBookstore.demo.dto.UserSearchDTO;
import com.modul2AndreiBookstore.demo.repository.BookRepository;
import com.modul2AndreiBookstore.demo.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.modul2AndreiBookstore.demo.entities.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BookService {
    private static final Logger logger = LoggerFactory.getLogger(BookService.class);
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private LibraryRepository libraryRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Book addBookToLibrary(Long libraryId, Book book) {
        if (book.getId() != null) {
            throw new RuntimeException("You cannot provide an ID to a new book that you want to create");
        }

        Library existentLibrary = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Library with id " + libraryId + " not found"));

        existentLibrary.addBook(book);
        libraryRepository.save(existentLibrary);
        book.setLibrary(existentLibrary);
        return bookRepository.save(book);
    }

    @Transactional
    public void removeBookFromLibrary(Long libraryId, Long bookId) {
        Library existentLibrary = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Library with id " + libraryId + " not found"));

        Book existentBook = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Book with id " + bookId + " not found"));

        existentLibrary.removeBook(existentBook);
        existentBook.setLibrary(null);
        bookRepository.save(existentBook);
        libraryRepository.save(existentLibrary);
    }

    public Book getBookById(Long bookId) {
        return bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Book with id " + bookId + " not found"));
    }

    public Page<Book> searchBooks(String author, String title, Integer page, Integer size) {
        logger.info("Searching books with author: {} and title: {}, page: {}, size: {}", author, title, page, size);
        Pageable pageable = (page != null && size != null)
                ? PageRequest.of(page, size)
                : Pageable.unpaged();

        Page<Book> booksPage = bookRepository.findBooks(author, title, pageable);
        logger.info("Repository findBooks returned page with {} total elements and {} books in content.", booksPage.getTotalElements(), booksPage.getContent().size());
        return booksPage;
    }

    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    public Book update(Long bookId, Book bookToUpdate) {
        return bookRepository.findById(bookId).map(existentBook -> {
            existentBook.setIsbn(bookToUpdate.getIsbn());
            existentBook.setTitle(bookToUpdate.getTitle());
            existentBook.setAuthor(bookToUpdate.getAuthor());
            existentBook.setAppearanceDate(bookToUpdate.getAppearanceDate());
            existentBook.setNrOfPages(bookToUpdate.getNrOfPages());
            existentBook.setCategory(bookToUpdate.getCategory());
            existentBook.setLanguage(bookToUpdate.getLanguage());
            existentBook.setCoverImageUrl(bookToUpdate.getCoverImageUrl());
            return bookRepository.save(existentBook);
        }).orElseThrow(() -> new EntityNotFoundException("Book with ID " + bookId + " not found"));
    }

    public Page<Book> findAllPaginated(Pageable pageable) {
        return bookRepository.findAll(pageable);
    }


    @Transactional
    public Book addBookToFavourite(Long bookId, Long userId) {

        Book existingbook = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Book with id " + bookId + " not found"));

        User existingUser = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User with id " + userId + " not found"));


        existingbook.addUser(existingUser);
        existingUser.addBook(existingbook);

        return bookRepository.save(existingbook);

    }

    @Transactional
    public void removeBookFromFavourite(Long bookId, Long userId) {


        Book existingbook = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Book with id " + bookId + " not found"));

        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "User with id " + userId + " not found"));

        existingbook.removeUser(existingUser);
        existingUser.removeBook(existingbook);

        bookRepository.save(existingbook);

    }

    // Method to find favorite books for a user
    public List<Book> findUserFavorites(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id " + userId + " not found"));
        return user.getBooks(); // Assuming getBooks() on User entity returns the list of favorite books
    }


    public Page<Book> filterBooksbetween2dates(LocalDate startDate, LocalDate endDate, int nrOfPages, Integer page, Integer size) {

        Pageable pageable = (page != null && size != null)
                ? PageRequest.of(page, size)
                : Pageable.unpaged();

        return bookRepository.findFilteredBooks(startDate, endDate, nrOfPages, pageable);

    }


    public Page<Book> filterBooksbetween2datesforUser(Long userId, UserSearchDTO userSearchDTO, Integer page, Integer size) {

        Pageable pageable = (page != null && size != null)
                ? PageRequest.of(page, size)
                : Pageable.unpaged();

        if (userSearchDTO.getStartDate() != null || userSearchDTO.getEndDate() != null) {

            userSearchDTO.setStartDate(null);
            userSearchDTO.setEndDate(null);
        }

        return bookRepository.findFilteredBooksforUser(userId, userSearchDTO.getStartDate(), userSearchDTO.getEndDate(), userSearchDTO.getNrOfPages(), pageable);

    }

    public List<Book> searchBooks(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return findAll(); // Return all books if search term is empty
        }

        // Try to find by ISBN first (assuming ISBN is unique)
        Optional<Book> bookByIsbn = bookRepository.findByIsbn(searchTerm.trim());
        if (bookByIsbn.isPresent()) {
            return List.of(bookByIsbn.get()); // Return a list containing the single book
        }

        // If not found by ISBN, search by title or author name
        List<Book> booksByTitle = bookRepository.findByTitleContainingIgnoreCase(searchTerm.trim());
        List<Book> booksByAuthor = bookRepository.findByAuthorContainingIgnoreCase(searchTerm.trim());

        // Combine results and remove duplicates (if any)
        List<Book> searchResults = new java.util.ArrayList<>();
        searchResults.addAll(booksByTitle);
        // Add books from author search that are not already in the list (based on ID)
        booksByAuthor.stream()
                     .filter(book -> !searchResults.stream().anyMatch(existing -> existing.getId().equals(book.getId())))
                     .forEach(searchResults::add);

        return searchResults;
    }

    public void deleteBook(Long id) {
        Optional<Book> bookOptional = bookRepository.findById(id);
        if (bookOptional.isPresent()) {
            bookRepository.delete(bookOptional.get());
        } else {
            throw new EntityNotFoundException("Book with id " + id + " not found");
        }
    }

}
