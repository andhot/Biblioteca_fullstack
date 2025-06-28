package com.modul2AndreiBookstore.demo.controller;

import com.modul2AndreiBookstore.demo.dto.BookDTO;
import com.modul2AndreiBookstore.demo.dto.UserSearchDTO;
import com.modul2AndreiBookstore.demo.entities.Book;
import com.modul2AndreiBookstore.demo.mapper.BookMapper;
import com.modul2AndreiBookstore.demo.service.BookService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/books")
public class BookController {
    @Autowired
    private BookService bookService;

    @PostMapping("/add/{libraryId}")
    public synchronized ResponseEntity<?> addBookToLibrary(@PathVariable(name = "libraryId") Long libraryId,
                                              @RequestBody BookDTO bookDTO) {
        
        System.out.println("=== BOOK CREATION REQUEST ===");
        System.out.println("LibraryId: " + libraryId);
        System.out.println("Book: " + bookDTO.getTitle() + " by " + bookDTO.getAuthor());
        System.out.println("Timestamp: " + java.time.LocalDateTime.now());
        System.out.println("Thread: " + Thread.currentThread().getName());
        
        try {
            Book bookToCreate = BookMapper.bookDTO2BookWithoutLibrary(bookDTO);
            Book createdBook = bookService.addBookToLibrary(libraryId, bookToCreate);
            
            System.out.println("Book created successfully with ID: " + createdBook.getId());
            System.out.println("=== END BOOK CREATION ===");
            
            return ResponseEntity.ok(BookMapper.book2BookDTOWithoutLibrary(createdBook));
        } catch (RuntimeException e) {
            System.out.println("Error creating book: " + e.getMessage());
            System.out.println("=== END BOOK CREATION (ERROR) ===");
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getTotalBooksCount() {
        try {
            Long count = bookService.getTotalBooksCount();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0L);
        }
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<?> getBookById(@PathVariable(name = "bookId") Long bookId) {
        Book foundBook = bookService.getBookById(bookId);
        BookDTO bookDTO = BookMapper.book2BookDTOWithoutLibrary(foundBook);
        return ResponseEntity.ok(bookDTO);
    }

    @GetMapping()
    public ResponseEntity<?> findAll() {
        List<Book> books = bookService.findAll();
        List<BookDTO> bookDTOs = books.stream()
                .map(BookMapper::book2BookDTOWithoutLibrary)
                .toList();
        return ResponseEntity.ok(bookDTOs);
    }

    @GetMapping("/pagination")
    public ResponseEntity<?> findPaginated(Pageable pageable) {
        Page<Book> booksPage = bookService.findAllPaginated(pageable);
        Page<BookDTO> bookDTOPage = booksPage.map(BookMapper::book2BookDTOWithoutLibrary);
        return ResponseEntity.ok(bookDTOPage);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchBooks(@RequestParam(required = false) String author,
                                         @RequestParam(required = false) String title,
                                         @RequestParam(required = false) Integer page,
                                         @RequestParam(required = false) Integer size) {
        Page<Book> booksPage = bookService.searchBooks(author, title, page, size);
        Page<BookDTO> bookDTOPage = booksPage.map(BookMapper::book2BookDTOWithoutLibrary);
        return ResponseEntity.ok(bookDTOPage);
    }

    @GetMapping("/search-by-term")
    public ResponseEntity<List<BookDTO>> searchBooksByTerm(@RequestParam String term) {
        List<Book> books = bookService.searchBooks(term);
        if (books.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<BookDTO> bookDTOs = books.stream()
            .map(BookMapper::book2BookDTOWithoutLibrary)
            .toList();
        return ResponseEntity.ok(bookDTOs);
    }

    @PutMapping("/remove/{libraryId}/{bookId}")
    public ResponseEntity<?> removeBookFromLibrary(@PathVariable(name = "libraryId") Long libraryId,
                                                   @PathVariable(name = "bookId") Long bookId) {
        bookService.removeBookFromLibrary(libraryId, bookId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{bookId}")
    public ResponseEntity<?> updateBook(@PathVariable Long bookId, @RequestBody BookDTO updatedBookDTO) {
        try {
            Book bookToUpdate = BookMapper.bookDTO2Book(updatedBookDTO);
            Book updatedBook = bookService.update(bookId, bookToUpdate);
            return ResponseEntity.ok(BookMapper.book2BookDTO(updatedBook));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/addtofav/{userid}/{bookid}")
    public ResponseEntity<?> addToFav(@PathVariable Long userid, @PathVariable Long bookid) {
        Book book = bookService.addBookToFavourite(bookid, userid);
        return ResponseEntity.ok(BookMapper.book2BookDTOWithoutLibrary(book));
    }

    @DeleteMapping("/deletefromfav/{userId}/{bookId}")
    public ResponseEntity<?> deleteFromFav(@PathVariable Long userId, @PathVariable Long bookId) {
        bookService.removeBookFromFavourite(bookId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/favorites/user/{userId}")
    public ResponseEntity<?> getUserFavorites(@PathVariable Long userId) {
        List<Book> favoriteBooks = bookService.findUserFavorites(userId);
        List<BookDTO> favoriteBookDTOs = favoriteBooks.stream()
                .map(BookMapper::book2BookDTOWithoutLibrary)
                .toList();
        return ResponseEntity.ok(favoriteBookDTOs);
    }

    @GetMapping("/filtedsearch")
    public ResponseEntity<?> filterBooksbetween2dates(@RequestParam(required = false) LocalDate startDate,
                                         @RequestParam(required = false) LocalDate endDate,
                                         @RequestParam(required = false) int nrOfPages,
                                         @RequestParam(required = false) Integer page,
                                         @RequestParam(required = false) Integer size) {
        Page<Book> booksPage = bookService.filterBooksbetween2dates(startDate, endDate, nrOfPages, page, size);
        Page<BookDTO> bookDTOPage = booksPage.map(BookMapper::book2BookDTOWithoutLibrary);
        return ResponseEntity.ok(bookDTOPage);
    }

    @GetMapping("/filtedsearchforuser/{userId}")
    public ResponseEntity<?> filterBooksbetween2datesforUser(@PathVariable Long userId,
                                         @RequestParam(required = false) Integer page,
                                         @RequestParam(required = false) Integer size,
                                         @RequestBody UserSearchDTO userSearchDTO) {

        Page<Book> booksPage = bookService.filterBooksbetween2datesforUser(userId, userSearchDTO, page, size);
        Page<BookDTO> bookDTOPage = booksPage.map(BookMapper::book2BookDTOWithoutLibrary);
        return ResponseEntity.ok(bookDTOPage);
    }

    @GetMapping("/top-rated")
    public ResponseEntity<?> getTopRatedBooks(@RequestParam(required = false, defaultValue = "6") Integer limit) {
        List<Book> topRatedBooks = bookService.getTopRatedBooks(limit);
        List<BookDTO> bookDTOs = topRatedBooks.stream()
                .map(BookMapper::book2BookDTOWithoutLibrary)
                .toList();
        return ResponseEntity.ok(bookDTOs);
    }

    @PostMapping("/populate-sample-data")
    public ResponseEntity<?> populateSampleData() {
        try {
            bookService.populateSampleBooksWithReviews();
            return ResponseEntity.ok("Sample data populated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error populating sample data: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        try {
            bookService.deleteBook(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

