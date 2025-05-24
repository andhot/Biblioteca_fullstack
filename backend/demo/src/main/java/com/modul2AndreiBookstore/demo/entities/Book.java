package com.modul2AndreiBookstore.demo.entities;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "book")
@Table(name = "book", schema = "public")
public class Book {
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ISBN")
    private String isbn;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "AUTHOR")
    private String author;

    @Column(name = "APPEARANCE_DATE")
    private LocalDate appearanceDate;

    @Column(name = "NR_OF_PAGES")
    private Integer nrOfPages;

    @Enumerated(EnumType.STRING)
    @Column(name = "CATEGORY")
    private Category category;

    @Column(name = "LANGUAGE")
    private String language;

    @Column(name = "COVER_IMAGE_URL")
    private String coverImageUrl;

    @Column(name = "DESCRIPTION", columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "library_id")
    private Library library;

    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE},
            fetch = FetchType.LAZY,
            orphanRemoval = true,
            mappedBy = "book")
    private List<Exemplary> exemplaries = new ArrayList<>();




    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE},
            fetch = FetchType.LAZY,
            orphanRemoval = true,
            mappedBy = "book")
    private List<Review> reviews = new ArrayList<>();


    @ManyToMany(mappedBy = "books", fetch = FetchType.LAZY)
    private List<User> user;


    public List<User> getUser() {
        return user;
    }

    public void setUser(List<User> user) {
        this.user = user;
    }

    public void addUser(User user) {
        this.user.add(user);
    }

    public void removeUser(User user) {

        this.user.remove(user);

    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public void addReview(Review review) {
        this.reviews.add(review);
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public List<Exemplary> getExemplaries() {
        return exemplaries;
    }

    public void setExemplaries(List<Exemplary> exemplaries) {
        this.exemplaries = exemplaries;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public LocalDate getAppearanceDate() {
        return appearanceDate;
    }

    public void setAppearanceDate(LocalDate appearanceDate) {
        this.appearanceDate = appearanceDate;
    }

    public Integer getNrOfPages() {
        return nrOfPages;
    }

    public void setNrOfPages(Integer nrOfPages) {
        this.nrOfPages = nrOfPages;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Library getLibrary() {
        return library;
    }

    public void setLibrary(Library library) {
        this.library = library;
    }

    public void addExemplary(Exemplary exemplary) {
        exemplaries.add(exemplary);
    }

    public void removeExemplary(Exemplary exemplary) {
        exemplaries.remove(exemplary);
    }
}