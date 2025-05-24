package com.modul2AndreiBookstore.demo.service;


import com.modul2AndreiBookstore.demo.entities.Book;
import com.modul2AndreiBookstore.demo.entities.Review;
import com.modul2AndreiBookstore.demo.entities.User;
import com.modul2AndreiBookstore.demo.repository.BookRepository;
import com.modul2AndreiBookstore.demo.repository.ReviewRepository;
import com.modul2AndreiBookstore.demo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ReviewService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ReviewRepository reviewRepository;


    //    Ne dorim ca un book sa poata sa primeasca review-uri de la utilizatori.
//    Astfel, functional, o carte va putea primi review-uri de la useri, iar un review poate fi si
//    modificat sau sters. Un review va fi reprezentat printr-o nota (intre 1 si 5), respectiv o descriere.
//    De asemenea, paginat, pot fi incarcate review-urile utilizatorilor (pot fi si sortate dupa data in
//    care un review a fost scris).
//    Important! De fiecare data cand un review este adaugat/modificat/sters, se doreste
//    calcularea mediei notelor review-urilor, medie ce va fi stocata la nivel de book.

    @Transactional
    public Review addReviewToBook(Review review, Long bookId, Long userId) {


        if (review.getId() != null) {
            throw new RuntimeException("You cannot provide an ID to a new review that you want to create");
        }

        Book existentbook = bookRepository.findById(bookId).orElseThrow(() -> new EntityNotFoundException(
                "Book with id " + bookId + " not found"));

        User existentuser = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException(
                "User with id " + userId + " not found"
        ));
        // sa fac metoda in entitatea user sa adaug preview

        review.setDateOfCreation(LocalDate.now());
        existentbook.addReview(review);
        bookRepository.save(existentbook);
        review.setBook(existentbook);
        existentuser.addReview(review);
        userRepository.save(existentuser);
        return reviewRepository.save(review);

    }

    public void RemoveReviewFromBook(Long reviewId, Long bookId) {


        Book existentbook = bookRepository.findById(bookId).orElseThrow(() -> new EntityNotFoundException(
                "Book with id " + bookId + " not found"
        ));


        Review existentreview = reviewRepository.findById(reviewId).orElseThrow(() -> new EntityNotFoundException(
                "Review with id " + reviewId + " not found"
        ));


        existentbook.getReviews().remove(existentreview);
        existentreview.setBook(null);
        bookRepository.save(existentbook);
        //reviewRepository.delete(existentreview);
        reviewRepository.save(existentreview);

    }

    public Review updateReview(Review review, Long reviewId) {

        return reviewRepository.findById(reviewId).map(existentReview -> {
            existentReview.setStars(review.getStars());
            existentReview.setMessage(review.getMessage());
            return reviewRepository.save(existentReview);
        }).orElseThrow(() -> new EntityNotFoundException("Review with id " + reviewId + " not found"));


    }


    public Page<Review> getReviewsForBook(Long bookId, Integer page, Integer size) {
        bookRepository.findById(bookId).orElseThrow(() -> new EntityNotFoundException("Book not found"));

        Pageable pageable = (page != null && size != null)
                ? PageRequest.of(page, size)
                : Pageable.unpaged();

        return reviewRepository.findReviewsForBookASC(bookId, pageable);
    }

    public double calculateAverageStarsForBook(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book with id " + bookId + " not found"));

        return book.getReviews().stream()
                .mapToInt(Review::getStars)
                .average()
                .orElse(0.0);
    }

}
