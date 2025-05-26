package com.modul2AndreiBookstore.demo.controller;

import com.modul2AndreiBookstore.demo.dto.LibrarianDTO;
import com.modul2AndreiBookstore.demo.dto.ErrorResponse;
import com.modul2AndreiBookstore.demo.dto.validation.ValidationOrder;
import com.modul2AndreiBookstore.demo.entities.Librarian;
import com.modul2AndreiBookstore.demo.mapper.LibrarianMapper;
import com.modul2AndreiBookstore.demo.service.LibrarianService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("/librarians")
public class LibrarianController {
    @Autowired
    private LibrarianService librarianService;

    @PostMapping()
    public ResponseEntity<?> create(@Validated(ValidationOrder.class)
                                    @RequestBody LibrarianDTO librarianDTO) {
        Librarian librarianToCreate = LibrarianMapper.librarianDTO2Librarian(librarianDTO);
        Librarian createdLibrarian = librarianService.create(librarianToCreate);
        return ResponseEntity.ok(LibrarianMapper.librarian2LibrarianDTO(createdLibrarian));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LibrarianDTO librarianDTO) {
        Librarian librarianToLogin = LibrarianMapper.librarianDTO2LibrarianWithoutLibrary(librarianDTO);
        Librarian existentLibrarian = librarianService.login(librarianToLogin);
        return ResponseEntity.ok(LibrarianMapper.librarian2LibrarianDTO(existentLibrarian));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> verify(@PathVariable Long id, @RequestBody LibrarianDTO librarianDTO) {
        try {
            System.out.println("Received verification request for librarian ID: " + id);
            System.out.println("Received DTO: " + librarianDTO);
            System.out.println("Verification code from DTO: " + librarianDTO.getVerificationCode());
            
            Librarian librarianToVerify = LibrarianMapper.librarianDTO2LibrarianWithoutLibrary(librarianDTO);
            System.out.println("Converted to Librarian entity: " + librarianToVerify);
            System.out.println("Verification code in entity: " + librarianToVerify.getVerificationCode());
            
            Librarian verifiedLibrarian = librarianService.verify(id, librarianToVerify);
            return ResponseEntity.ok(LibrarianMapper.librarian2LibrarianDTOWithoutLibrary(verifiedLibrarian));
        } catch (Exception e) {
            System.out.println("Verification error: " + e.getMessage());
            e.printStackTrace(); // Print the full stack trace
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/resendCode/{id}")
    public ResponseEntity<?> resendVerificationCode(@PathVariable Long id) {
        Librarian librarian = librarianService.resendVerificationCode(id);
        return ResponseEntity.ok(LibrarianMapper.librarian2LibrarianDTOWithoutLibrary(librarian));
    }
}