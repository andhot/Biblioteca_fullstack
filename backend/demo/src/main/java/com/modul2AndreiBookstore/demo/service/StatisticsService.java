package com.modul2AndreiBookstore.demo.service;

import com.modul2AndreiBookstore.demo.dto.StatisticsDTO;
import com.modul2AndreiBookstore.demo.entities.ReservationStatus;
import com.modul2AndreiBookstore.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LibraryRepository libraryRepository;

    @Autowired
    private ExemplaryRepository exemplaryRepository;

    public StatisticsDTO getGlobalStatistics() {
        StatisticsDTO statistics = new StatisticsDTO();

        // Basic counts
        statistics.setTotalBooks(bookRepository.count());
        statistics.setTotalReservations(reservationRepository.count());
        statistics.setTotalUsers(userRepository.count());
        statistics.setTotalLibraries(libraryRepository.count());
        statistics.setTotalExemplaries(exemplaryRepository.count());

        // Reservation statistics by status
        statistics.setActiveReservations(reservationRepository.countByReservationStatus(ReservationStatus.IN_PROGRESS));
        statistics.setCompletedReservations(reservationRepository.countByReservationStatus(ReservationStatus.FINISHED));
        statistics.setPendingReservations(reservationRepository.countByReservationStatus(ReservationStatus.PENDING));
        statistics.setCanceledReservations(reservationRepository.countByReservationStatus(ReservationStatus.CANCELED));

        // Books by category
        try {
            statistics.setBooksByCategory(getBooksByCategory());
        } catch (Exception e) {
            System.err.println("Error getting books by category: " + e.getMessage());
            statistics.setBooksByCategory(new HashMap<>());
        }

        // Reservations by month (last 6 months)
        try {
            statistics.setReservationsByMonth(getReservationsByMonth());
        } catch (Exception e) {
            System.err.println("Error getting reservations by month: " + e.getMessage());
            statistics.setReservationsByMonth(new HashMap<>());
        }

        // Top libraries by book count
        try {
            statistics.setTopLibrariesByBooks(getTopLibrariesByBooks());
        } catch (Exception e) {
            System.err.println("Error getting top libraries: " + e.getMessage());
            statistics.setTopLibrariesByBooks(new HashMap<>());
        }

        // Reservations by status (for charts)
        try {
            statistics.setReservationsByStatus(getReservationsByStatus());
        } catch (Exception e) {
            System.err.println("Error getting reservations by status: " + e.getMessage());
            statistics.setReservationsByStatus(new HashMap<>());
        }

        // Average reservation duration
        try {
            statistics.setAverageReservationDuration(getAverageReservationDuration());
        } catch (Exception e) {
            System.err.println("Error getting average reservation duration: " + e.getMessage());
            statistics.setAverageReservationDuration(0.0);
        }

        return statistics;
    }

    public StatisticsDTO getLibraryStatistics(Long libraryId) {
        StatisticsDTO statistics = new StatisticsDTO();

        // Basic counts for specific library
        statistics.setTotalBooks(bookRepository.countByLibraryId(libraryId));
        statistics.setTotalReservations(reservationRepository.countByExemplaryBookLibraryId(libraryId));
        statistics.setTotalExemplaries(exemplaryRepository.countByBookLibraryId(libraryId));

        // Reservation statistics by status for this library
        statistics.setActiveReservations(reservationRepository.countByExemplaryBookLibraryIdAndReservationStatus(libraryId, ReservationStatus.IN_PROGRESS));
        statistics.setCompletedReservations(reservationRepository.countByExemplaryBookLibraryIdAndReservationStatus(libraryId, ReservationStatus.FINISHED));
        statistics.setPendingReservations(reservationRepository.countByExemplaryBookLibraryIdAndReservationStatus(libraryId, ReservationStatus.PENDING));
        statistics.setCanceledReservations(reservationRepository.countByExemplaryBookLibraryIdAndReservationStatus(libraryId, ReservationStatus.CANCELED));

        // Books by category for this library
        statistics.setBooksByCategory(getBooksByCategoryForLibrary(libraryId));

        // Reservations by month for this library
        statistics.setReservationsByMonth(getReservationsByMonthForLibrary(libraryId));

        // Reservations by status for this library
        statistics.setReservationsByStatus(getReservationsByStatusForLibrary(libraryId));

        // Average reservation duration for this library
        statistics.setAverageReservationDuration(getAverageReservationDurationForLibrary(libraryId));

        return statistics;
    }

    private Map<String, Long> getBooksByCategory() {
        List<Object[]> results = bookRepository.countBooksByCategory();
        Map<String, Long> categoryMap = new HashMap<>();
        
        for (Object[] result : results) {
            Object categoryObj = result[0];
            String category = categoryObj != null ? categoryObj.toString() : "Necategorizat";
            Long count = (Long) result[1];
            categoryMap.put(category, count);
        }
        
        return categoryMap;
    }

    private Map<String, Long> getBooksByCategoryForLibrary(Long libraryId) {
        List<Object[]> results = bookRepository.countBooksByCategoryForLibrary(libraryId);
        Map<String, Long> categoryMap = new HashMap<>();
        
        for (Object[] result : results) {
            Object categoryObj = result[0];
            String category = categoryObj != null ? categoryObj.toString() : "Necategorizat";
            Long count = (Long) result[1];
            categoryMap.put(category, count);
        }
        
        return categoryMap;
    }

    private Map<String, Long> getReservationsByMonth() {
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        List<Object[]> results = reservationRepository.countReservationsByMonth(sixMonthsAgo);
        Map<String, Long> monthMap = new HashMap<>();
        
        for (Object[] result : results) {
            String month = (String) result[0];
            Long count = (Long) result[1];
            monthMap.put(month, count);
        }
        
        return monthMap;
    }

    private Map<String, Long> getReservationsByMonthForLibrary(Long libraryId) {
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        List<Object[]> results = reservationRepository.countReservationsByMonthForLibrary(libraryId, sixMonthsAgo);
        Map<String, Long> monthMap = new HashMap<>();
        
        for (Object[] result : results) {
            String month = (String) result[0];
            Long count = (Long) result[1];
            monthMap.put(month, count);
        }
        
        return monthMap;
    }

    private Map<String, Long> getTopLibrariesByBooks() {
        List<Object[]> results = libraryRepository.findTopLibrariesByBookCount();
        Map<String, Long> libraryMap = new HashMap<>();
        
        for (Object[] result : results) {
            String libraryName = (String) result[0];
            Long bookCount = (Long) result[1];
            libraryMap.put(libraryName, bookCount);
        }
        
        return libraryMap;
    }

    private Map<String, Long> getReservationsByStatus() {
        Map<String, Long> statusMap = new HashMap<>();
        
        for (ReservationStatus status : ReservationStatus.values()) {
            Long count = reservationRepository.countByReservationStatus(status);
            statusMap.put(status.name(), count);
        }
        
        return statusMap;
    }

    private Map<String, Long> getReservationsByStatusForLibrary(Long libraryId) {
        Map<String, Long> statusMap = new HashMap<>();
        
        for (ReservationStatus status : ReservationStatus.values()) {
            Long count = reservationRepository.countByExemplaryBookLibraryIdAndReservationStatus(libraryId, status);
            statusMap.put(status.name(), count);
        }
        
        return statusMap;
    }

    private Double getAverageReservationDuration() {
        List<Object[]> results = reservationRepository.getAverageReservationDuration();
        if (!results.isEmpty() && results.get(0)[0] != null) {
            return ((Number) results.get(0)[0]).doubleValue();
        }
        return 0.0;
    }

    private Double getAverageReservationDurationForLibrary(Long libraryId) {
        List<Object[]> results = reservationRepository.getAverageReservationDurationForLibrary(libraryId);
        if (!results.isEmpty() && results.get(0)[0] != null) {
            return ((Number) results.get(0)[0]).doubleValue();
        }
        return 0.0;
    }
} 