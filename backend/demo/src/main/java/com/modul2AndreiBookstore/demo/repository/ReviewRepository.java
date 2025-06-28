package com.modul2AndreiBookstore.demo.repository;

import com.modul2AndreiBookstore.demo.entities.Review;
import com.modul2AndreiBookstore.demo.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query(value = """
                SELECT review FROM review review
                WHERE review.book.id = :bookId
                ORDER BY review.dateOfCreation DESC
            """)
    Page<Review> findReviewsForBookASC(Long bookId,
                                       Pageable pageable);

    @Query(value = """
                SELECT COUNT(review) FROM review review
                WHERE review.book.id = :bookId AND review.user.id = :userId
            """)
    long countByBookIdAndUserId(Long bookId, Long userId);


}
