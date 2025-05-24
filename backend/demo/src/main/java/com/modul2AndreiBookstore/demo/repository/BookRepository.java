package com.modul2AndreiBookstore.demo.repository;

import com.modul2AndreiBookstore.demo.entities.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Page<Book> findAll(Pageable pageable);

    @Query("SELECT b FROM com.modul2AndreiBookstore.demo.entities.Book b WHERE " +
           "(:author IS NULL OR LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%'))) OR " +
           "(:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%')))")
    Page<Book> findBooks(@Param("author") String author, @Param("title") String title, Pageable pageable);

    @Query(value = """
                SELECT book FROM book book
                JOIN book.user users
                WHERE (cast(:startDate as date) IS NULL OR book.appearanceDate>=:startDate)
                 AND (cast(:endDate as date) IS NULL OR   book.appearanceDate<=:endDate)
                 AND  (:nrOfPages IS NULL or  book.nrOfPages=:nrOfPages)
            
            """)
    Page<Book> findFilteredBooks(LocalDate startDate, LocalDate endDate, int nrOfPages, Pageable pageable);

    @Query(value = """
                    SELECT book FROM user user
                    JOIN user.books book
                    WHERE user.id=:userId
                    AND (cast(:startDate as date) IS NULL OR book.appearanceDate>=:startDate)
                    AND (cast(:endDate as date) IS NULL OR   book.appearanceDate<=:endDate)
                    AND  (:nrOfPages IS NULL or  book.nrOfPages=:nrOfPages)
            """)
    Page<Book> findFilteredBooksforUser(Long userId, LocalDate startDate, LocalDate endDate, int nrOfPages, Pageable pageable);

    // Find books by title containing the search term (case-insensitive)
    List<Book> findByTitleContainingIgnoreCase(String title);

    // Find a book by its ISBN
    Optional<Book> findByIsbn(String isbn);

    // Find books by author name containing the search term (case-insensitive)
    List<Book> findByAuthorContainingIgnoreCase(String author);
}
