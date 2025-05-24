package com.modul2AndreiBookstore.demo.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "exemplary")
@Table(name = "exemplary", schema = "public")
public class Exemplary {
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "PUBLISHER")
    private String publisher;

    @Column(name = "MAX_BORROW_DAYS")
    private Integer maxBorrowDays;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE},
            fetch = FetchType.LAZY,
            orphanRemoval = true,
            mappedBy = "exemplary")
    private List<Reservation> reservations = new ArrayList<>();

    @Version
    @Column(name = "version")
    private Integer version;

    @Column(name = "update_time")
    private LocalDateTime localDateTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getLocalDateTime() {
        return localDateTime;
    }

    public void setLocalDateTime(LocalDateTime localDateTime) {
        this.localDateTime = localDateTime;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(List<Reservation> reservations) {
        this.reservations = reservations;
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

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public void addReservation(Reservation reservation) {
        reservations.add(reservation);
    }
}
