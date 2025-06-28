package com.modul2AndreiBookstore.demo.mapper;

import com.modul2AndreiBookstore.demo.dto.ReviewDTO;
import com.modul2AndreiBookstore.demo.entities.Review;

public class ReviewMapper {


    public static Review reviewDTO2Review(ReviewDTO reviewDTO) {

        Review review = new Review();
        review.setId(reviewDTO.getId());
        review.setStars(reviewDTO.getStars());
        review.setMessage(reviewDTO.getMessage());
        review.setDateOfCreation(reviewDTO.getDateOfCreation());
        if (reviewDTO.getBook() != null) {
            review.setBook(BookMapper.bookDTO2Book(reviewDTO.getBook()));
        }
        return review;
    }
    public static ReviewDTO review2ReviewDTO(Review review) {
        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setId(review.getId());
        reviewDTO.setStars(review.getStars());
        reviewDTO.setMessage(review.getMessage());
        reviewDTO.setDateOfCreation(review.getDateOfCreation());
        if (review.getBook() != null) {
            reviewDTO.setBook(BookMapper.book2BookDTO(review.getBook()));
        }
        return reviewDTO;
    }

    public static ReviewDTO review2ReviewDTOWithUser(Review review) {
        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setId(review.getId());
        reviewDTO.setStars(review.getStars());
        reviewDTO.setMessage(review.getMessage());
        reviewDTO.setDateOfCreation(review.getDateOfCreation());
        if (review.getBook() != null) {
            reviewDTO.setBook(BookMapper.book2BookDTO(review.getBook()));
        }
        if (review.getUser() != null) {
            reviewDTO.setUser(UserMapper.user2UserDTO(review.getUser()));
        }
        return reviewDTO;
    }

}
