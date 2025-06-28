package com.modul2AndreiBookstore.demo.dto;

import com.modul2AndreiBookstore.demo.dto.validation.AdvancedValidation;
import com.modul2AndreiBookstore.demo.dto.validation.BasicValidation;
import com.modul2AndreiBookstore.demo.dto.validation.ValidEmail;
import com.modul2AndreiBookstore.demo.dto.validation.ValidPassword;
import jakarta.validation.constraints.NotNull;

public class AdministratorDTO {
    private Long id;
    
    @NotNull(groups = BasicValidation.class)
    private String firstName;
    
    @NotNull(groups = BasicValidation.class)
    private String lastName;
    
    @NotNull(groups = BasicValidation.class)
    @ValidEmail(groups = AdvancedValidation.class)
    private String email;
    
    @NotNull(groups = BasicValidation.class)
    @ValidPassword(groups = AdvancedValidation.class)
    private String password;
    
    private String verificationCode;
    private boolean isActive;
    private String createdAt;
    private String lastLogin;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(String lastLogin) {
        this.lastLogin = lastLogin;
    }
} 