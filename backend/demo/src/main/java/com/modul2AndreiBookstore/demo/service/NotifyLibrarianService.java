package com.modul2AndreiBookstore.demo.service;

import com.modul2AndreiBookstore.demo.entities.Reservation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotifyLibrarianService {
    @Autowired
    private EmailService emailService;

    public void notifyLibrarianDelayedReservations(List<Reservation> reservationsDelayed) {
        for (Reservation reservation : reservationsDelayed) {
            String email = reservation.getExemplary().getBook().getLibrary().getLibrarian().getEmail();
            String firstName = reservation.getUser().getFirstName();
            String lastName = reservation.getUser().getLastName();
            String phoneNumber = reservation.getUser().getPhoneNumber();
            emailService.sendDelayedReservationMail(email, firstName, lastName, phoneNumber);
        }
    }
}