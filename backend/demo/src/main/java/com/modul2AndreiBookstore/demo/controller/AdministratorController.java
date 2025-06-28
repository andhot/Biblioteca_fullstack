package com.modul2AndreiBookstore.demo.controller;

import com.modul2AndreiBookstore.demo.dto.AdministratorDTO;
import com.modul2AndreiBookstore.demo.dto.ErrorResponse;
import com.modul2AndreiBookstore.demo.dto.UserDTO;
import com.modul2AndreiBookstore.demo.dto.validation.ValidationOrder;
import com.modul2AndreiBookstore.demo.entities.Administrator;
import com.modul2AndreiBookstore.demo.entities.User;
import com.modul2AndreiBookstore.demo.mapper.AdministratorMapper;
import com.modul2AndreiBookstore.demo.mapper.UserMapper;
import com.modul2AndreiBookstore.demo.service.AdministratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController()
@RequestMapping("/administrators")
public class AdministratorController {
    @Autowired
    private AdministratorService administratorService;

    @PostMapping()
    public ResponseEntity<?> create(@Validated(ValidationOrder.class)
                                    @RequestBody AdministratorDTO administratorDTO) {
        Administrator administratorToCreate = AdministratorMapper.administratorDTO2Administrator(administratorDTO);
        Administrator createdAdministrator = administratorService.create(administratorToCreate);
        return ResponseEntity.ok(AdministratorMapper.administrator2AdministratorDTO(createdAdministrator));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdministratorDTO administratorDTO) {
        Administrator administratorToLogin = AdministratorMapper.administratorDTO2Administrator(administratorDTO);
        Administrator existentAdministrator = administratorService.login(administratorToLogin);
        return ResponseEntity.ok(AdministratorMapper.administrator2AdministratorDTO(existentAdministrator));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> verify(@PathVariable Long id, @RequestBody AdministratorDTO administratorDTO) {
        try {
            System.out.println("Received verification request for administrator ID: " + id);
            System.out.println("Received DTO: " + administratorDTO);
            System.out.println("Verification code from DTO: " + administratorDTO.getVerificationCode());
            
            Administrator administratorToVerify = AdministratorMapper.administratorDTO2AdministratorWithoutPassword(administratorDTO);
            System.out.println("Converted to Administrator entity: " + administratorToVerify);
            System.out.println("Verification code in entity: " + administratorToVerify.getVerificationCode());
            
            Administrator verifiedAdministrator = administratorService.verify(id, administratorToVerify);
            return ResponseEntity.ok(AdministratorMapper.administrator2AdministratorDTO(verifiedAdministrator));
        } catch (Exception e) {
            System.out.println("Verification error: " + e.getMessage());
            e.printStackTrace(); // Print the full stack trace
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/resendCode/{id}")
    public ResponseEntity<?> resendVerificationCode(@PathVariable Long id) {
        Administrator administrator = administratorService.resendVerificationCode(id);
        return ResponseEntity.ok(AdministratorMapper.administrator2AdministratorDTO(administrator));
    }

    // User management endpoints
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = administratorService.getAllUsers();
        List<UserDTO> userDTOs = users.stream()
                .map(UserMapper::user2UserDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId) {
        User user = administratorService.getUserById(userId);
        return ResponseEntity.ok(UserMapper.user2UserDTO(user));
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody UserDTO userDTO) {
        try {
            User userDetails = UserMapper.userDTO2User(userDTO);
            User updatedUser = administratorService.updateUser(userId, userDetails);
            return ResponseEntity.ok(UserMapper.user2UserDTO(updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/users/{userId}/block")
    public ResponseEntity<?> blockUser(@PathVariable Long userId) {
        try {
            User blockedUser = administratorService.blockUser(userId);
            return ResponseEntity.ok(Map.of(
                "message", "User blocked successfully",
                "user", UserMapper.user2UserDTO(blockedUser)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/users/{userId}/unblock")
    public ResponseEntity<?> unblockUser(@PathVariable Long userId) {
        try {
            User unblockedUser = administratorService.unblockUser(userId);
            return ResponseEntity.ok(Map.of(
                "message", "User unblocked successfully",
                "user", UserMapper.user2UserDTO(unblockedUser)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            administratorService.deleteUser(userId);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        Map<String, Object> stats = Map.of(
            "totalUsers", administratorService.getTotalUsers(),
            "activeUsers", administratorService.getActiveUsers(),
            "blockedUsers", administratorService.getBlockedUsers()
        );
        return ResponseEntity.ok(stats);
    }
} 