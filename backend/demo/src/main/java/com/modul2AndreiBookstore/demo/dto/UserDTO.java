package com.modul2AndreiBookstore.demo.dto;

import com.modul2AndreiBookstore.demo.dto.validation.*;
import com.modul2AndreiBookstore.demo.entities.Gender;
import jakarta.validation.constraints.NotNull;

public class UserDTO {
    private Long id;
    @NotNull(groups = BasicValidation.class)
    private String firstName;
    @NotNull(groups = BasicValidation.class)
    private String lastName;
    private Integer yearOfBirth;
    private Gender gender;
    @NotNull(groups = BasicValidation.class)
    @ValidEmail(groups = AdvancedValidation.class)
    private String email;
    @NotNull(groups = BasicValidation.class)
    @ValidPhoneNumber(groups = AdvancedValidation.class)
    private String phoneNumber;
    @NotNull(groups = BasicValidation.class)
    @ValidPassword(groups = AdvancedValidation.class)
    private String password;
    private boolean isVerified;
    private String verificationCode;
    private String country;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
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

    public Integer getYearOfBirth() {
        return yearOfBirth;
    }

    public void setYearOfBirth(Integer yearOfBirth) {
        this.yearOfBirth = yearOfBirth;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }
}
