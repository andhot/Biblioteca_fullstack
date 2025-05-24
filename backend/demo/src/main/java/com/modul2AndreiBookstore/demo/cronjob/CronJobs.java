package com.modul2AndreiBookstore.demo.cronjob;

import com.modul2AndreiBookstore.demo.entities.Reservation;
import com.modul2AndreiBookstore.demo.entities.ReservationStatus;
import com.modul2AndreiBookstore.demo.repository.ReservationRepository;
import com.modul2AndreiBookstore.demo.service.NotifyLibrarianService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDate;
import java.util.List;

@Configuration
@EnableScheduling
public class CronJobs {
    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private NotifyLibrarianService notifyLibrarianService;

    @Scheduled(cron = "0 0 0 * * *") // every day at 00:00
    public void updateReservationStatus() {
        LocalDate now = LocalDate.now();
        List<Reservation> reservationsToBeCanceled = reservationRepository
                .findAllReservationsToBeCanceled(now);
        List<Reservation> reservationsToBeDelayed = reservationRepository
                .findAllReservationsToBeDelayed(now);

        reservationsToBeCanceled.forEach(reservation ->
                reservation.setReservationStatus(ReservationStatus.CANCELED));
        reservationsToBeDelayed.forEach(reservation ->
                reservation.setReservationStatus(ReservationStatus.DELAYED));

        reservationRepository.saveAll(reservationsToBeCanceled);
        reservationRepository.saveAll(reservationsToBeDelayed);

        if (!reservationsToBeDelayed.isEmpty()) {
            notifyLibrarianService.notifyLibrarianDelayedReservations(reservationsToBeDelayed);
        }
    }
}