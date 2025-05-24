package com.modul2AndreiBookstore.demo.entities;


//    Ne dorim ca un book sa poata sa primeasca review-uri de la utilizatori.
//    Astfel, functional, o carte va putea primi review-uri de la useri, iar un review poate fi si
//    modificat sau sters. Un review va fi reprezentat printr-o nota (intre 1 si 5), respectiv o descriere.
//    De asemenea, paginat, pot fi incarcate review-urile utilizatorilor (pot fi si sortate dupa data in
//    care un review a fost scris).
//    Important! De fiecare data cand un review este adaugat/modificat/sters, se doreste
//    calcularea mediei notelor review-urilor, medie ce va fi stocata la nivel de book.


import jakarta.persistence.*;

import java.time.LocalDate;

//TODO adauga relationarea de un user are mai multe review in entitatea review
//TODO adauga user ul in service controler  dto mapper
@Entity(name = "review")
@Table(name = "review", schema = "public")
public class Review {

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "STARS")
    private Integer stars;

    @Column(name = "MESSAGE")
    private String message;

    @Column(name = "DATEOFCREATION")
    private LocalDate dateOfCreation;

    @Column(name = "AVERAGE")
    private Integer AVERAGE;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


    public void setStars(Integer stars) {
        this.stars = stars;
    }

    public Integer getAVERAGE() {
        return AVERAGE;
    }

    public void setAVERAGE(Integer AVERAGE) {
        this.AVERAGE = AVERAGE;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDate getDateOfCreation() {
        return dateOfCreation;
    }

    public void setDateOfCreation(LocalDate dateOfCreation) {
        this.dateOfCreation = dateOfCreation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getStars() {
        return stars;
    }

    public void setStars(int stars) {
        this.stars = stars;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }
}
