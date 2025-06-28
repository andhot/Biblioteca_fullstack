package com.modul2AndreiBookstore.demo.service;

import com.modul2AndreiBookstore.demo.entities.Administrator;
import com.modul2AndreiBookstore.demo.entities.Book;
import com.modul2AndreiBookstore.demo.entities.User;
import com.modul2AndreiBookstore.demo.repository.AdministratorRepository;
import com.modul2AndreiBookstore.demo.repository.BookRepository;
import com.modul2AndreiBookstore.demo.repository.ReservationRepository;
import com.modul2AndreiBookstore.demo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.InputMismatchException;
import java.util.List;
import java.util.Random;

@Service
public class AdministratorService {
    private static final Integer MINUTES_AVAILABLE_CODE = 5;

    @Autowired
    private AdministratorRepository administratorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private EmailService emailService;

    public Administrator create(Administrator administrator) {
        if (administrator.getId() != null) {
            throw new RuntimeException("You cannot provide an ID to a new administrator that you want to create");
        }
        if (administrator.getVerificationCode() != null) {
            throw new RuntimeException("You cannot provide a verification code to an administrator");
        }

        administrator.setPassword(encodePassword(administrator.getPassword()));
        String verificationCode = generateVerificationCode();
        administrator.setVerificationCode(verificationCode);
        administrator.setVerificationCodeGenerationTime(LocalDateTime.now());

        emailService.sendVerificationEmail(administrator.getEmail(), verificationCode);
        return administratorRepository.save(administrator);
    }

    public Administrator verify(Long administratorId, Administrator updatedAdministrator) {
        System.out.println("Starting verification for administrator ID: " + administratorId);
        
        Administrator administrator = administratorRepository.findById(administratorId)
                .orElseThrow(() -> new EntityNotFoundException("Administrator with ID " + administratorId + " not found"));

        System.out.println("Found administrator: " + administrator.getFirstName() + " " + administrator.getLastName() + " with email: " + administrator.getEmail());
        System.out.println("Stored verification code: " + administrator.getVerificationCode());
        System.out.println("Received verification code: " + updatedAdministrator.getVerificationCode());

        LocalDateTime currentTime = LocalDateTime.now();
        Duration elapsedTime = Duration.between(administrator.getVerificationCodeGenerationTime(), currentTime);
        System.out.println("Time elapsed since code generation: " + elapsedTime.toMinutes() + " minutes");

        if (elapsedTime.toMinutes() > MINUTES_AVAILABLE_CODE) {
            System.out.println("Verification code expired");
            administrator.setVerificationCode(null);
            administratorRepository.save(administrator);
            throw new IllegalStateException("Verification code expired. Request a new verification code.");
        }

        if (administrator.getVerificationCode() == null || updatedAdministrator.getVerificationCode() == null) {
            System.out.println("Verification code is null");
            throw new IllegalStateException("Invalid verification code.");
        }

        if (!administrator.getVerificationCode().equals(updatedAdministrator.getVerificationCode())) {
            System.out.println("Verification codes do not match");
            throw new IllegalStateException("Invalid code.");
        }

        System.out.println("Verification successful");
        administrator.setVerified(true);
        administrator.setActive(true);
        administrator.setVerificationCode("done");

        return administratorRepository.save(administrator);
    }

    public Administrator resendVerificationCode(Long administratorId) {
        Administrator administrator = administratorRepository.findById(administratorId)
                .orElseThrow(() -> new EntityNotFoundException("Administrator with ID " + administratorId + " not found"));

        if (administrator.isVerified()) {
            return administrator;
        }

        LocalDateTime currentTime = LocalDateTime.now();
        Duration elapsedTime = Duration.between(administrator.getVerificationCodeGenerationTime(), currentTime);

        if (elapsedTime.toMinutes() > MINUTES_AVAILABLE_CODE - 1) {
            administrator.setVerificationCode(generateVerificationCode());
            administrator.setVerificationCodeGenerationTime(LocalDateTime.now());
        }

        emailService.sendVerificationEmail(administrator.getEmail(), administrator.getVerificationCode());
        return administratorRepository.save(administrator);
    }

    public Administrator login(Administrator administrator) {
        Administrator existentAdministrator = administratorRepository.findByEmailAndIsActiveTrue(administrator.getEmail())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Administrator with email " + administrator.getEmail() + " not found"));

        String encodedPassword = encodePassword(administrator.getPassword());
        if (!existentAdministrator.isVerified() || !encodedPassword.equals(existentAdministrator.getPassword())) {
            throw new InputMismatchException();
        }
        
        // Update last login
        existentAdministrator.setLastLogin(LocalDateTime.now());
        return administratorRepository.save(existentAdministrator);
    }

    // User management methods
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with ID " + userId + " not found"));
    }

    public User updateUser(Long userId, User userDetails) {
        User user = getUserById(userId);

        // Update fields that are allowed to be changed by an admin
        // We are not updating email to avoid re-verification logic complexity for now
        // We are not updating the password from this flow for security reasons
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setPhoneNumber(userDetails.getPhoneNumber());
        user.setYearOfBirth(userDetails.getYearOfBirth());
        user.setCountry(userDetails.getCountry());
        user.setGender(userDetails.getGender());
        
        return userRepository.save(user);
    }

    public User blockUser(Long userId) {
        User user = getUserById(userId);
        user.setVerified(false); // Using isVerified as a block status
        return userRepository.save(user);
    }

    public User unblockUser(Long userId) {
        User user = getUserById(userId);
        user.setVerified(true); // Using isVerified as a block status
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        User user = getUserById(userId);

        // Check for active reservations before deleting
        long reservationCount = reservationRepository.countByUserId(userId);
        if (reservationCount > 0) {
            throw new IllegalStateException("Acest utilizator nu poate fi șters deoarece are " +
                    reservationCount + " rezervări asociate. Vă rugăm să anulați/finalizați " +
                    "rezervările înainte de a șterge utilizatorul.");
        }

        // Handle breaking the Many-to-Many relationship with favorite books
        // We need to iterate over a copy of the list to avoid ConcurrentModificationException
        List<Book> favoriteBooks = new ArrayList<>(user.getBooks());
        for (Book book : favoriteBooks) {
            book.getUser().remove(user); // Remove the user from the book's list of favoriters
        }
        user.getBooks().clear(); // Clear the user's list of favorite books

        // Now it's safe to delete the user
        userRepository.delete(user);
    }

    public long getTotalUsers() {
        return userRepository.findAll().size();
    }

    public long getActiveUsers() {
        try {
            return userRepository.findAll().stream()
                    .filter(User::isVerified)
                    .count();
        } catch (Exception e) {
            System.err.println("Error getting active users: " + e.getMessage());
            return 0;
        }
    }

    public long getBlockedUsers() {
        try {
            return userRepository.findAll().stream()
                    .filter(user -> !user.isVerified())
                    .count();
        } catch (Exception e) {
            System.err.println("Error getting blocked users: " + e.getMessage());
            return 0;
        }
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