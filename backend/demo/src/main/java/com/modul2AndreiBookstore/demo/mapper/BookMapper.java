package com.modul2AndreiBookstore.demo.mapper;
import com.modul2AndreiBookstore.demo.dto.BookDTO;
import com.modul2AndreiBookstore.demo.entities.*;
import java.util.List;
import java.util.stream.Collectors;

public class BookMapper {
    public static Book bookDTO2Book(BookDTO bookDTO) {
        Book book = new Book();
        book.setIsbn(bookDTO.getIsbn());
        book.setTitle(bookDTO.getTitle());
        book.setAuthor(bookDTO.getAuthor());
        book.setAppearanceDate(bookDTO.getAppearanceDate());
        book.setNrOfPages(bookDTO.getNrOfPages());
        book.setCategory(bookDTO.getCategory());
        book.setLanguage(bookDTO.getLanguage());
        book.setCoverImageUrl(bookDTO.getCoverImageUrl());
        book.setDescription(bookDTO.getDescription());
        if (bookDTO.getLibrary() != null) {
            book.setLibrary(LibraryMapper.libraryDTO2Library(bookDTO.getLibrary()));
        }
        return book;
    }

    public static BookDTO book2BookDTO(Book book) {
        BookDTO bookDTO = new BookDTO();
        bookDTO.setId(book.getId());
        bookDTO.setIsbn(book.getIsbn());
        bookDTO.setTitle(book.getTitle());
        bookDTO.setAuthor(book.getAuthor());
        bookDTO.setAppearanceDate(book.getAppearanceDate());
        bookDTO.setNrOfPages(book.getNrOfPages());
        bookDTO.setCategory(book.getCategory());
        bookDTO.setLanguage(book.getLanguage());
        bookDTO.setCoverImageUrl(book.getCoverImageUrl());
        bookDTO.setDescription(book.getDescription());
        if (book.getLibrary() != null) {
            bookDTO.setLibrary(LibraryMapper.library2LibraryDTO(book.getLibrary()));
        }
        if (book.getExemplaries() != null) {
            bookDTO.setExemplaries(book.getExemplaries().stream()
                .map(ExemplaryMapper::exemplary2ExemplaryDTO)
                .collect(Collectors.toList()));
        }
        return bookDTO;
    }

    public static List<Book> bookDTOs2Books(List<BookDTO> bookDTOs) {
        return bookDTOs.stream()
                .map(BookMapper::bookDTO2Book)
                .toList();
    }

    public static List<BookDTO> books2BookDTOs(List<Book> books) {
        return books.stream()
                .map(BookMapper::book2BookDTO)
                .toList();
    }

    public static List<BookDTO> books2BookDTOsWithoutLibrary(List<Book> books) {
        return books.stream()
                .map(BookMapper::book2BookDTOWithoutLibrary)
                .toList();
    }

    public static Book bookDTO2BookWithoutLibrary(BookDTO bookDTO) {
        Book book = new Book();
        book.setIsbn(bookDTO.getIsbn());
        book.setTitle(bookDTO.getTitle());
        book.setAuthor(bookDTO.getAuthor());
        book.setAppearanceDate(bookDTO.getAppearanceDate());
        book.setNrOfPages(bookDTO.getNrOfPages());
        book.setCategory(bookDTO.getCategory());
        book.setLanguage(bookDTO.getLanguage());
        book.setCoverImageUrl(bookDTO.getCoverImageUrl());
        book.setDescription(bookDTO.getDescription());
        return book;
    }

    public static BookDTO book2BookDTOWithoutLibrary(Book book) {
        BookDTO bookDTO = new BookDTO();
        bookDTO.setId(book.getId());
        bookDTO.setIsbn(book.getIsbn());
        bookDTO.setTitle(book.getTitle());
        bookDTO.setAuthor(book.getAuthor());
        bookDTO.setAppearanceDate(book.getAppearanceDate());
        bookDTO.setNrOfPages(book.getNrOfPages());
        bookDTO.setCategory(book.getCategory());
        bookDTO.setLanguage(book.getLanguage());
        bookDTO.setCoverImageUrl(book.getCoverImageUrl());
        bookDTO.setDescription(book.getDescription());
        // Don't set library to avoid circular reference
        if (book.getExemplaries() != null) {
            bookDTO.setExemplaries(book.getExemplaries().stream()
                .map(ExemplaryMapper::exemplary2ExemplaryDTO)
                .collect(Collectors.toList()));
        }
        return bookDTO;
    }
}