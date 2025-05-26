package com.modul2AndreiBookstore.demo.repository;

import com.modul2AndreiBookstore.demo.entities.Reservation;
import com.modul2AndreiBookstore.demo.entities.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query(value = """
        SELECT reservation FROM reservation reservation
        WHERE reservation.startDate < :today
        AND reservation.reservationStatus = 'PENDING'
    """)
    List<Reservation> findAllReservationsToBeCanceled(LocalDate today);

    @Query(value = """
        SELECT reservation FROM reservation reservation
        WHERE reservation.endDate < :today
        AND reservation.reservationStatus = 'IN_PROGRESS'
    """)
    List<Reservation> findAllReservationsToBeDelayed(LocalDate today);

    @Query(value = """
        SELECT reservation FROM reservation reservation
        WHERE reservation.exemplary.book.library.id = :libraryId
        AND reservation.startDate >= :startDate
        AND reservation.endDate <= :endDate
        AND (:reservationStatusList IS NULL OR reservation.reservationStatus IN :reservationStatusList)
        ORDER BY reservation.startDate ASC
    """)
    Page<Reservation> findReservationsForLibraryInInterval(Long libraryId,
                                                           Pageable pageable,
                                                           LocalDate startDate,
                                                           LocalDate endDate,
                                                           List<ReservationStatus> reservationStatusList);

    @Query(value = """
        SELECT reservation FROM reservation reservation
        WHERE reservation.user.id = :userId
        AND (cast(:startDate as date) IS NULL OR reservation.startDate >= :startDate)
        AND (cast(:endDate as date) IS NULL OR reservation.endDate <= :endDate)
        AND (:reservationStatusList IS NULL OR reservation.reservationStatus IN :reservationStatusList)
        ORDER BY reservation.reservationStatus ASC
    """)
    Page<Reservation> findReservationsForUserByStatus(Long userId,
                                                      Pageable pageable,
                                                      LocalDate startDate,
                                                      LocalDate endDate,
                                                      List<ReservationStatus> reservationStatusList);

    // Statistics methods
    Long countByReservationStatus(ReservationStatus status);
    
    Long countByExemplaryBookLibraryId(Long libraryId);
    
    Long countByExemplaryBookLibraryIdAndReservationStatus(Long libraryId, ReservationStatus status);

    @Query("SELECT CONCAT(YEAR(r.startDate), '-', " +
           "CASE WHEN MONTH(r.startDate) < 10 THEN CONCAT('0', MONTH(r.startDate)) ELSE CAST(MONTH(r.startDate) AS string) END), COUNT(r) " +
           "FROM reservation r WHERE r.startDate >= :startDate GROUP BY YEAR(r.startDate), MONTH(r.startDate) " +
           "ORDER BY YEAR(r.startDate), MONTH(r.startDate)")
    List<Object[]> countReservationsByMonth(@Param("startDate") LocalDate startDate);

    @Query("SELECT CONCAT(YEAR(r.startDate), '-', " +
           "CASE WHEN MONTH(r.startDate) < 10 THEN CONCAT('0', MONTH(r.startDate)) ELSE CAST(MONTH(r.startDate) AS string) END), COUNT(r) " +
           "FROM reservation r WHERE r.exemplary.book.library.id = :libraryId AND r.startDate >= :startDate " +
           "GROUP BY YEAR(r.startDate), MONTH(r.startDate) ORDER BY YEAR(r.startDate), MONTH(r.startDate)")
    List<Object[]> countReservationsByMonthForLibrary(@Param("libraryId") Long libraryId, @Param("startDate") LocalDate startDate);

    @Query(value = "SELECT AVG(EXTRACT(EPOCH FROM (r.end_date - r.start_date)) / 86400) FROM reservation r WHERE r.reservation_status = 'FINISHED'", nativeQuery = true)
    List<Object[]> getAverageReservationDuration();

    @Query(value = "SELECT AVG(EXTRACT(EPOCH FROM (r.end_date - r.start_date)) / 86400) FROM reservation r " +
           "JOIN exemplary e ON r.exemplary_id = e.id JOIN book b ON e.book_id = b.id " +
           "WHERE b.library_id = :libraryId AND r.reservation_status = 'FINISHED'", nativeQuery = true)
    List<Object[]> getAverageReservationDurationForLibrary(@Param("libraryId") Long libraryId);
}