package com.modul2AndreiBookstore.demo.dto;

import com.modul2AndreiBookstore.demo.dto.validation.AdvancedValidation;
import com.modul2AndreiBookstore.demo.dto.validation.BasicValidation;
import com.modul2AndreiBookstore.demo.dto.validation.ValidPhoneNumber;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

public class LibraryDTO {
    private Long id;
    @NotNull(groups = BasicValidation.class)
    private String name;
    @NotNull(groups = BasicValidation.class)
    private String adress;
    @NotNull(groups = BasicValidation.class)
    @ValidPhoneNumber(groups = AdvancedValidation.class)
    private String phoneNumber;
    private List<BookDTO> books = new ArrayList<>();
    private LibrarianDTO librarian;

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

    public String getAdress() {
        return adress;
    }

    public void setAdress(String adress) {
        this.adress = adress;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public List<BookDTO> getBooks() {
        return books;
    }

    public void setBooks(List<BookDTO> books) {
        this.books = books;
    }

    public LibrarianDTO getLibrarian() {
        return librarian;
    }

    public void setLibrarian(LibrarianDTO librarian) {
        this.librarian = librarian;
    }
}
