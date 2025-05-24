package com.modul2AndreiBookstore.demo.dto;

import com.modul2AndreiBookstore.demo.dto.validation.AdvancedValidation;
import com.modul2AndreiBookstore.demo.dto.validation.BasicValidation;
import com.modul2AndreiBookstore.demo.dto.validation.ValidEmail;
import com.modul2AndreiBookstore.demo.dto.validation.ValidPassword;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class LibrarianDTO {
    private Long id;
    @NotNull(groups = BasicValidation.class)
    private String name;
    @NotNull(groups = BasicValidation.class)
    @ValidEmail(groups = AdvancedValidation.class)
    private String email;
    @NotNull(groups = BasicValidation.class)
    @ValidPassword(groups = AdvancedValidation.class)
    private String password;
    @NotNull(groups = BasicValidation.class)
    @Valid
    private LibraryDTO library;
    private String verificationCode;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public LibraryDTO getLibrary() {
        return library;
    }

    public void setLibrary(LibraryDTO library) {
        this.library = library;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }
}