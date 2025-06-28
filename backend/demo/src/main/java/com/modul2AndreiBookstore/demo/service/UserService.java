package com.modul2AndreiBookstore.demo.service;

import com.modul2AndreiBookstore.demo.entities.User;
import com.modul2AndreiBookstore.demo.repository.UserRepository;
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
import java.util.List;
import java.util.Random;

@Service
public class UserService {
    private static final Integer MINUTES_AVAILABLE_CODE = 5;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public User create(User user) {
        if (user.getId() != null) {
            throw new RuntimeException("You cannot provide an ID to a new user that you want to create");
        }
        if (user.getVerificationCode() != null) {
            throw new RuntimeException("You cannot provide a verification code to a user");
        }

        user.setPassword(encodePassword(user.getPassword()));
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);

        emailService.sendVerificationEmail(user.getEmail(), verificationCode);
        user.setVerificationCodeGenerationTime(LocalDateTime.now());
        return userRepository.save(user);
    }

    public User verify(Long userId, User updatedUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with ID " + userId + " not found"));

        LocalDateTime currentTime = LocalDateTime.now();
        Duration elapsedTime = Duration.between(user.getVerificationCodeGenerationTime(), currentTime);

        if (elapsedTime.toMinutes() > MINUTES_AVAILABLE_CODE) {
            user.setVerificationCode(null);
            userRepository.save(user);
            throw new IllegalStateException("Verification code expired. Request a new verification code.");
        }

        if (!user.getVerificationCode().equals(updatedUser.getVerificationCode())) {
            throw new IllegalStateException("Invalid code.");
        }

        user.setVerified(true);
        user.setVerificationCode("done");

        return userRepository.save(user);
    }

    public User resendVerificationCode(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with ID " + userId + " not found"));

        if (user.isVerified()) {
            return user;
        }

        LocalDateTime currentTime = LocalDateTime.now();
        Duration elapsedTime = Duration.between(user.getVerificationCodeGenerationTime(), currentTime);

        if (elapsedTime.toMinutes() > MINUTES_AVAILABLE_CODE - 1) {
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationCodeGenerationTime(LocalDateTime.now());
        }

        emailService.sendVerificationEmail(user.getEmail(), user.getVerificationCode());
        return userRepository.save(user);
    }

    public User login(User user) {
        List<User> users = userRepository.findByEmail(user.getEmail());
        if (users.isEmpty()) {
            throw new EntityNotFoundException("User with email " + user.getEmail() + " not found");
        }
        if (users.size() > 1) {
            throw new IllegalStateException("Multiple users found with email " + user.getEmail() + ". Please contact support.");
        }

        User existentUser = users.get(0);
        String encodedPassword = encodePassword(user.getPassword());
        if (!existentUser.isVerified() || !encodedPassword.equals(existentUser.getPassword())) {
            throw new InputMismatchException();
        }
        return existentUser;
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