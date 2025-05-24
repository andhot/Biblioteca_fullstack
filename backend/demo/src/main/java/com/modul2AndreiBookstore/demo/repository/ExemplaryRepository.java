package com.modul2AndreiBookstore.demo.repository;

import com.modul2AndreiBookstore.demo.entities.Exemplary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface ExemplaryRepository extends JpaRepository<Exemplary, Long> {
    Page<Exemplary> findByBookId(Long bookId, Pageable pageable);
    void deleteById(Long exemplaryId);

    @Query(value = """
        SELECT * FROM exemplary exemplary
        WHERE exemplary.book_id = :bookId
        AND exemplary.id NOT IN (
            SELECT reservation.exemplary_id FROM reservation reservation
            WHERE reservation.exemplary_id = exemplary.id
            AND NOT (reservation.end_date < :startDate OR reservation.start_date > :endDate)
            AND reservation.reservation_status IN ('IN_PROGRESS', 'PENDING')
            OR reservation.reservation_status = 'DELAYED'
        )
        LIMIT 1
    """, nativeQuery = true)
    Optional<Exemplary> findFirstAvailableExemplary(Long bookId, LocalDate startDate, LocalDate endDate);
}