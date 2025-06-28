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
import com.modul2AndreiBookstore.demo.repository.ReviewRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookService {
    private static final Logger logger = LoggerFactory.getLogger(BookService.class);
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private LibraryRepository libraryRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Transactional
    public Book addBookToLibrary(Long libraryId, Book book) {
        if (book.getId() != null) {
            throw new RuntimeException("You cannot provide an ID to a new book that you want to create");
        }

        Library existentLibrary = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Library with id " + libraryId + " not found"));

        // Set the relationship
        book.setLibrary(existentLibrary);
        
        // Save the book first
        Book savedBook = bookRepository.save(book);
        
        // Add to collection (this won't trigger additional saves due to mappedBy)
        existentLibrary.addBook(savedBook);
        
        return savedBook;
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

        // Use the new safe search method with explicit text casting
        return bookRepository.searchBooksByTitleOrAuthor(searchTerm.trim());
    }

    public List<Book> getTopRatedBooks(Integer limit) {
        List<Book> allBooks = bookRepository.findAll();
        
        // Calculate average rating for each book and sort by rating
        return allBooks.stream()
                .filter(book -> !book.getReviews().isEmpty()) // Only books with reviews
                .sorted((book1, book2) -> {
                    double avg1 = book1.getReviews().stream()
                            .mapToInt(Review::getStars)
                            .average()
                            .orElse(0.0);
                    double avg2 = book2.getReviews().stream()
                            .mapToInt(Review::getStars)
                            .average()
                            .orElse(0.0);
                    return Double.compare(avg2, avg1); // Descending order
                })
                .limit(limit != null ? limit : 6)
                .collect(java.util.stream.Collectors.toList());
    }

    public void deleteBook(Long id) {
        Optional<Book> bookOptional = bookRepository.findById(id);
        if (bookOptional.isPresent()) {
            bookRepository.delete(bookOptional.get());
        } else {
            throw new EntityNotFoundException("Book with id " + id + " not found");
        }
    }

    @Transactional
    public void populateSampleBooksWithReviews() {
        // Check if we already have books with reviews
        List<Book> booksWithReviews = bookRepository.findAll().stream()
                .filter(book -> !book.getReviews().isEmpty())
                .toList();
        
        if (!booksWithReviews.isEmpty()) {
            return; // Already have sample data
        }

        // Get the first library or create one if none exists
        Library library = libraryRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> {
                    Library newLibrary = new Library();
                    newLibrary.setName("Biblioteca Centrală");
                    newLibrary.setAdress("Str. Principală nr. 1");
                    newLibrary.setPhoneNumber("0123456789");
                    return libraryRepository.save(newLibrary);
                });

        // Create sample books with good ratings
        createSampleBook(library, "Harry Potter și Piatra Filozofală", "J.K. Rowling", 
                "978-0-7475-3269-9", Category.FANTASY, 
                "https://covers.openlibrary.org/b/isbn/9780747532699-L.jpg",
                "Povestea unui băiat care descoperă că este vrăjitor.", new int[]{5, 5, 4, 5, 4});

        createSampleBook(library, "1984", "George Orwell", 
                "978-0-452-28423-4", Category.LITERATURE,
                "https://covers.openlibrary.org/b/isbn/9780452284234-L.jpg",
                "O distopie despre controlul totalitar.", new int[]{5, 4, 5, 5, 4});

        createSampleBook(library, "Dune", "Frank Herbert", 
                "978-0-441-17271-9", Category.SF,
                "https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg",
                "Epopee science fiction pe planeta Arrakis.", new int[]{4, 5, 5, 4, 5});

        createSampleBook(library, "Mândrie și Prejudecată", "Jane Austen", 
                "978-0-14-143951-8", Category.ROMANCE,
                "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
                "Povestea de dragoste dintre Elizabeth și Darcy.", new int[]{4, 4, 5, 4, 5});

        createSampleBook(library, "Crima de pe Orientul Express", "Agatha Christie", 
                "978-0-00-711926-0", Category.MYSTERY,
                "https://covers.openlibrary.org/b/isbn/9780007119264-L.jpg",
                "Hercule Poirot rezolvă o crimă în tren.", new int[]{5, 4, 4, 5, 4});

        createSampleBook(library, "Sapiens", "Yuval Noah Harari", 
                "978-0-06-231609-7", Category.SCIENCE,
                "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
                "Istoria scurtă a omenirii.", new int[]{5, 5, 4, 4, 5});
    }

    private void createSampleBook(Library library, String title, String author, String isbn, 
                                 Category category, String coverUrl, String description, int[] ratings) {
        Book book = new Book();
        book.setTitle(title);
        book.setAuthor(author);
        book.setIsbn(isbn);
        book.setCategory(category);
        book.setCoverImageUrl(coverUrl);
        book.setDescription(description);
        book.setAppearanceDate(LocalDate.now().minusYears(1));
        book.setNrOfPages(300 + (int)(Math.random() * 200));
        book.setLanguage("Română");
        book.setLibrary(library);

        Book savedBook = bookRepository.save(book);

        // Create sample reviews
        User sampleUser = userRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setFirstName("Test");
                    newUser.setLastName("User");
                    newUser.setEmail("test@example.com");
                    newUser.setPassword("password");
                    return userRepository.save(newUser);
                });

        for (int i = 0; i < ratings.length; i++) {
            Review review = new Review();
            review.setStars(ratings[i]);
            review.setMessage("Carte excelentă! O recomand cu căldură.");
            review.setDateOfCreation(LocalDate.now().minusDays(i * 10));
            review.setBook(savedBook);
            review.setUser(sampleUser);
            
            savedBook.addReview(review);
            sampleUser.addReview(review);
        }

        bookRepository.save(savedBook);
    }

    public Long getTotalBooksCount() {
        return bookRepository.count();
    }

}
