package com.modul2AndreiBookstore.demo.mapper;
import com.modul2AndreiBookstore.demo.dto.LibrarianDTO;
import com.modul2AndreiBookstore.demo.entities.*;
public class LibrarianMapper {
    public static Librarian librarianDTO2Librarian(LibrarianDTO librarianDTO) {
        Librarian librarian = new Librarian();
        librarian.setId(librarianDTO.getId());
        librarian.setName(librarianDTO.getName());
        librarian.setEmail(librarianDTO.getEmail());
        librarian.setPassword(librarianDTO.getPassword());
        librarian.setVerificationCode(librarianDTO.getVerificationCode());
        if (librarianDTO.getLibrary() != null) {
            librarian.setLibrary(LibraryMapper.libraryDTO2Library(librarianDTO.getLibrary()));
        }
        return librarian;
    }

    public static LibrarianDTO librarian2LibrarianDTO(Librarian librarian) {
        LibrarianDTO librarianDTO = new LibrarianDTO();
        librarianDTO.setId(librarian.getId());
        librarianDTO.setName(librarian.getName());
        librarianDTO.setEmail(librarian.getEmail());
        librarianDTO.setPassword(librarian.getPassword());
        librarianDTO.setVerificationCode(librarian.getVerificationCode());
        if (librarian.getLibrary() != null) {
            librarianDTO.setLibrary(LibraryMapper.library2LibraryDTO(librarian.getLibrary()));
        }
        return librarianDTO;
    }

    public static Librarian librarianDTO2LibrarianWithoutLibrary(LibrarianDTO librarianDTO) {
        Librarian librarian = new Librarian();
        librarian.setId(librarianDTO.getId());
        librarian.setName(librarianDTO.getName());
        librarian.setEmail(librarianDTO.getEmail());
        librarian.setPassword(librarianDTO.getPassword());
        librarian.setVerificationCode(librarianDTO.getVerificationCode());
        return librarian;
    }

    public static LibrarianDTO librarian2LibrarianDTOWithoutLibrary(Librarian librarian) {
        LibrarianDTO librarianDTO = new LibrarianDTO();
        librarianDTO.setId(librarian.getId());
        librarianDTO.setName(librarian.getName());
        librarianDTO.setEmail(librarian.getEmail());
        librarianDTO.setPassword(librarian.getPassword());
        librarianDTO.setVerificationCode(librarian.getVerificationCode());
        return librarianDTO;
    }
}