package com.modul2AndreiBookstore.demo.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity(name = "librarian")
@Table(name = "librarian", schema = "public")
public class Librarian {
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "VERIFIED")
    private boolean verified = false;

    @Column(name = "VERIFICATION_CODE")
    private String verificationCode;

    @Column(name = "VERIFICATION_CODE_GENERATION_TIME")
    private LocalDateTime verificationCodeGenerationTime;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "library_id", referencedColumnName = "id")
    private Library library;

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

    public Library getLibrary() {
        return library;
    }

    public void setLibrary(Library library) {
        this.library = library;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public LocalDateTime getVerificationCodeGenerationTime() {
        return verificationCodeGenerationTime;
    }

    public void setVerificationCodeGenerationTime(LocalDateTime verificationCodeGenerationTime) {
        this.verificationCodeGenerationTime = verificationCodeGenerationTime;
    }
}