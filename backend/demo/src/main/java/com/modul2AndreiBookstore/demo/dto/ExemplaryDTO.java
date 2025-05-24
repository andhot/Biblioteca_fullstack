package com.modul2AndreiBookstore.demo.dto;

import com.modul2AndreiBookstore.demo.dto.validation.BasicValidation;
import jakarta.validation.constraints.NotNull;

public class ExemplaryDTO {
    private Long id;
    @NotNull(groups = BasicValidation.class)
    private String publisher;
    @NotNull(groups = BasicValidation.class)
    private Integer maxBorrowDays;
    private BookDTO book;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public Integer getMaxBorrowDays() {
        return maxBorrowDays;
    }

    public void setMaxBorrowDays(Integer maxBorrowDays) {
        this.maxBorrowDays = maxBorrowDays;
    }

    public BookDTO getBook() {
        return book;
    }

    public void setBook(BookDTO book) {
        this.book = book;
    }
}
