package com.modul2AndreiBookstore.demo.controller;

import com.modul2AndreiBookstore.demo.dto.UserDTO;
import com.modul2AndreiBookstore.demo.dto.validation.ValidationOrder;
import com.modul2AndreiBookstore.demo.entities.User;
import com.modul2AndreiBookstore.demo.mapper.UserMapper;
import com.modul2AndreiBookstore.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping()
    public ResponseEntity<?> create(@Validated(ValidationOrder.class)
                                    @RequestBody UserDTO userDTO) {
        User userToCreate = UserMapper.userDTO2User(userDTO);
        User createdUser = userService.create(userToCreate);
        return ResponseEntity.ok(UserMapper.user2UserDTO(createdUser));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userDTO) {
        User userToLogin = UserMapper.userDTO2User(userDTO);
        User existentUser = userService.login(userToLogin);
        return ResponseEntity.ok(UserMapper.user2UserDTO(existentUser));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> verify(@PathVariable Long userId, @RequestBody UserDTO updatedUserDTO) {
        User userToUpdate = UserMapper.userDTO2User(updatedUserDTO);
        User updatedUser = userService.verify(userId, userToUpdate);
        return ResponseEntity.ok(UserMapper.user2UserDTO(updatedUser));
    }

    @PutMapping("/resendCode/{userId}")
    public ResponseEntity<?> resendVerificationCode(@PathVariable Long userId) {
        User user = userService.resendVerificationCode(userId);
        return ResponseEntity.ok(UserMapper.user2UserDTO(user));
    }
}