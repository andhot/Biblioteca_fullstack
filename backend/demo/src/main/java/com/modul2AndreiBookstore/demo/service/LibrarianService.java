package com.modul2AndreiBookstore.demo.service;

import com.modul2AndreiBookstore.demo.entities.*;
import com.modul2AndreiBookstore.demo.repository.LibrarianRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.InputMismatchException;
import java.util.Random;

@Service
public class LibrarianService {
    private static final Integer MINUTES_AVAILABLE_CODE = 5;

    @Autowired
    private LibrarianRepository librarianRepository;

    @Autowired
    private EmailService emailService;

    public Librarian create(Librarian librarian) {
        if (librarian.getId() != null) {
            throw new RuntimeException("You cannot provide an ID to a new librarian that you want to create");
        }
        if (librarian.getVerificationCode() != null) {
            throw new RuntimeException("You cannot provide a verification code to a librarian");
        }

        librarian.setPassword(encodePassword(librarian.getPassword()));
        String verificationCode = generateVerificationCode();
        librarian.setVerificationCode(verificationCode);
        librarian.setVerificationCodeGenerationTime(LocalDateTime.now());

        emailService.sendVerificationEmail(librarian.getEmail(), verificationCode);
        return librarianRepository.save(librarian);
    }

    public Librarian verify(Long librarianId, Librarian updatedLibrarian) {
        System.out.println("Starting verification for librarian ID: " + librarianId);
        
        Librarian librarian = librarianRepository.findById(librarianId)
                .orElseThrow(() -> new EntityNotFoundException("Librarian with ID " + librarianId + " not found"));

        System.out.println("Found librarian: " + librarian.getName() + " with email: " + librarian.getEmail());
        System.out.println("Stored verification code: " + librarian.getVerificationCode());
        System.out.println("Received verification code: " + updatedLibrarian.getVerificationCode());

        LocalDateTime currentTime = LocalDateTime.now();
        Duration elapsedTime = Duration.between(librarian.getVerificationCodeGenerationTime(), currentTime);
        System.out.println("Time elapsed since code generation: " + elapsedTime.toMinutes() + " minutes");

        if (elapsedTime.toMinutes() > MINUTES_AVAILABLE_CODE) {
            System.out.println("Verification code expired");
            librarian.setVerificationCode(null);
            librarianRepository.save(librarian);
            throw new IllegalStateException("Verification code expired. Request a new verification code.");
        }

        if (librarian.getVerificationCode() == null || updatedLibrarian.getVerificationCode() == null) {
            System.out.println("Verification code is null");
            throw new IllegalStateException("Invalid verification code.");
        }

        if (!librarian.getVerificationCode().equals(updatedLibrarian.getVerificationCode())) {
            System.out.println("Verification codes do not match");
            throw new IllegalStateException("Invalid code.");
        }

        System.out.println("Verification successful");
        librarian.setVerified(true);
        librarian.setVerificationCode("done");

        return librarianRepository.save(librarian);
    }

    public Librarian resendVerificationCode(Long librarianId) {
        Librarian librarian = librarianRepository.findById(librarianId)
                .orElseThrow(() -> new EntityNotFoundException("Librarian with ID " + librarianId + " not found"));

        if (librarian.isVerified()) {
            return librarian;
        }

        LocalDateTime currentTime = LocalDateTime.now();
        Duration elapsedTime = Duration.between(librarian.getVerificationCodeGenerationTime(), currentTime);

        if (elapsedTime.toMinutes() > MINUTES_AVAILABLE_CODE - 1) {
            librarian.setVerificationCode(generateVerificationCode());
            librarian.setVerificationCodeGenerationTime(LocalDateTime.now());
        }

        emailService.sendVerificationEmail(librarian.getEmail(), librarian.getVerificationCode());
        return librarianRepository.save(librarian);
    }

    public Librarian login(Librarian librarian) {
        Librarian existentLibrarian = librarianRepository.findByEmail(librarian.getEmail())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Librarian with email " + librarian.getEmail() + " not found"));

        String encodedPassword = encodePassword(librarian.getPassword());
        if (!existentLibrarian.isVerified() || !encodedPassword.equals(existentLibrarian.getPassword())) {
            throw new InputMismatchException();
        }
        return existentLibrarian;
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // Generate 6-digit code
        return String.valueOf(code);
    }

    private String encodePassword(String password) {
        String encodedPassword = null;
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            encodedPassword = Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e);
        }
        return encodedPassword;
    }
}