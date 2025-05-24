package com.modul2AndreiBookstore.demo.service;

import com.modul2AndreiBookstore.demo.dto.ReservationSearchDTO;
import com.modul2AndreiBookstore.demo.entities.*;
import com.modul2AndreiBookstore.demo.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Objects;

@Service
public class ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ExemplaryRepository exemplaryRepository;

    @Autowired
    private LibrarianRepository librarianRepository;

    @Autowired
    private LibraryRepository libraryRepository;

    @Transactional
    public Reservation create(Reservation reservation, Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found"));

        Exemplary exemplary = exemplaryRepository
                .findFirstAvailableExemplary(bookId, reservation.getStartDate(), reservation.getEndDate())
                .orElseThrow(() -> new IllegalStateException("No available exemplaries in the period."));

        long daysBetween = Duration.between(
                        reservation.getStartDate().atStartOfDay(),
                        reservation.getEndDate().atStartOfDay())
                .toDays();

        if (daysBetween > exemplary.getMaxBorrowDays()) {
            throw new UnsupportedOperationException("Reservation too long, must be maximum " +
                    exemplary.getMaxBorrowDays() + " days");
        }

        reservation.setReservationStatus(ReservationStatus.PENDING);
        reservation.setUser(user);
        reservation.setExemplary(exemplary);
        exemplary.setLocalDateTime(LocalDateTime.now());

        exemplaryRepository.save(exemplary);
        return reservationRepository.save(reservation);
    }

    public Reservation changeStatus(Long librarianId, Long reservationId, Reservation reservationToUpdate) {
        Librarian librarian = librarianRepository.findById(librarianId)
                .orElseThrow(() -> new EntityNotFoundException("Librarian not found"));
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new EntityNotFoundException("Reservation not found"));

        if (!Objects.equals(librarian.getLibrary().getId(),
                reservation.getExemplary().getBook().getLibrary().getId())) {
            throw new IllegalStateException("No access for librarian to the reservation");
        }

        ReservationStatus currentStatus = reservation.getReservationStatus();
        if (!currentStatus.isNextStatePossible(reservationToUpdate.getReservationStatus())) {
            throw new IllegalStateException("Not possible");
        }
        reservation.setReservationStatus(reservationToUpdate.getReservationStatus());

        return reservationRepository.save(reservation);
    }

    public Page<Reservation> getReservationsForLibraryInInterval(Long libraryId,
                                                                 Integer page,
                                                                 Integer size,
                                                                 ReservationSearchDTO reservationSearchDTO) {
        libraryRepository.findById(libraryId).orElseThrow(() -> new EntityNotFoundException("Library not found"));

        Pageable pageable = (page != null && size != null)
                ? PageRequest.of(page, size)
                : Pageable.unpaged();

        if (reservationSearchDTO.getStartDate() == null || reservationSearchDTO.getEndDate() == null) {
            throw new EntityNotFoundException("missing start date or end date");
        }

        return reservationRepository.findReservationsForLibraryInInterval(libraryId, pageable,
                reservationSearchDTO.getStartDate(), reservationSearchDTO.getEndDate(),
                reservationSearchDTO.getReservationStatusList());
    }

    public Page<Reservation> getReservationsForUserByStatus(Long userId,
                                                            Integer page,
                                                            Integer size,
                                                            ReservationSearchDTO reservationSearchDTO) {
        userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));

        Pageable pageable = (page != null && size != null)
                ? PageRequest.of(page, size)
                : Pageable.unpaged();

        if (reservationSearchDTO.getStartDate() == null || reservationSearchDTO.getEndDate() == null) {
            reservationSearchDTO.setStartDate(null);
            reservationSearchDTO.setEndDate(null);
        }

        return reservationRepository.findReservationsForUserByStatus(userId, pageable,
                reservationSearchDTO.getStartDate(), reservationSearchDTO.getEndDate(),
                reservationSearchDTO.getReservationStatusList());
    }
}
