package com.modul2AndreiBookstore.demo.mapper;
import com.modul2AndreiBookstore.demo.dto.LibraryDTO;
import com.modul2AndreiBookstore.demo.entities.*;
public class LibraryMapper {
    public static Library libraryDTO2Library(LibraryDTO libraryDTO) {
        Library library = new Library();
        library.setName(libraryDTO.getName());
        library.setAdress(libraryDTO.getAdress());
        library.setPhoneNumber(libraryDTO.getPhoneNumber());
        if (libraryDTO.getBooks() != null) {
            library.setBooks(BookMapper.bookDTOs2Books(libraryDTO.getBooks()));
        }
        if (libraryDTO.getLibrarian() != null) {
            library.setLibrarian(LibrarianMapper.librarianDTO2Librarian(libraryDTO.getLibrarian()));
        }
        return library;
    }

    public static LibraryDTO library2LibraryDTO(Library library) {
        LibraryDTO libraryDTO = new LibraryDTO();
        libraryDTO.setId(library.getId());
        libraryDTO.setName(library.getName());
        libraryDTO.setAdress(library.getAdress());
        libraryDTO.setPhoneNumber(library.getPhoneNumber());
        if (library.getBooks() != null) {
            libraryDTO.setBooks(BookMapper.books2BookDTOs(library.getBooks()));
        }
        if (library.getLibrarian() != null) {
            libraryDTO.setLibrarian(LibrarianMapper.librarian2LibrarianDTO(library.getLibrarian()));
        }
        return libraryDTO;
    }

    public static Library libraryDTO2LibraryWithoutBooks(LibraryDTO libraryDTO) {
        Library library = new Library();
        library.setName(libraryDTO.getName());
        library.setAdress(libraryDTO.getAdress());
        library.setPhoneNumber(libraryDTO.getPhoneNumber());
        if (libraryDTO.getLibrarian() != null) {
            library.setLibrarian(LibrarianMapper.librarianDTO2Librarian(libraryDTO.getLibrarian()));
        }
        return library;
    }

    public static LibraryDTO library2LibraryDTOWithoutBooks(Library library) {
        LibraryDTO libraryDTO = new LibraryDTO();
        libraryDTO.setId(library.getId());
        libraryDTO.setName(library.getName());
        libraryDTO.setAdress(library.getAdress());
        libraryDTO.setPhoneNumber(library.getPhoneNumber());
        if (library.getLibrarian() != null) {
            libraryDTO.setLibrarian(LibrarianMapper.librarian2LibrarianDTO(library.getLibrarian()));
        }
        return libraryDTO;
    }
}