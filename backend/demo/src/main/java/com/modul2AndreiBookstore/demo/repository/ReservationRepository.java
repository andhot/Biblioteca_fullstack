package com.modul2AndreiBookstore.demo.repository;

import com.modul2AndreiBookstore.demo.entities.Reservation;
import com.modul2AndreiBookstore.demo.entities.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
}