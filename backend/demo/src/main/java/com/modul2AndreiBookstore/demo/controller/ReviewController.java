package com.modul2AndreiBookstore.demo.controller;


import com.modul2AndreiBookstore.demo.dto.ReviewDTO;
import com.modul2AndreiBookstore.demo.entities.Review;
import com.modul2AndreiBookstore.demo.mapper.ReviewMapper;
import com.modul2AndreiBookstore.demo.service.ReviewService;
import com.modul2AndreiBookstore.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;


    //TODO adauga utilizatorul care lasa review
    @PostMapping("/addreview/{bookId}/{userId}")
    public ResponseEntity<?> create(@PathVariable Long bookId,
                                    @PathVariable Long userId,
                                    @RequestBody ReviewDTO reviewDTO) {

        Review reviewToCreate = ReviewMapper.reviewDTO2Review(reviewDTO);
        Review reviewCreated = reviewService.addReviewToBook(reviewToCreate, bookId, userId);
        reviewService.calculateAverageStarsForBook(bookId);
        return ResponseEntity.ok(ReviewMapper.review2ReviewDTO(reviewCreated));
    }

    @PutMapping("/update/{reviewId}")
    public ResponseEntity<?> update(@PathVariable Long reviewId,
                                    @RequestBody ReviewDTO reviewDTO) {

        Review reviewToUpdate = ReviewMapper.reviewDTO2Review(reviewDTO);
        Review reviewUpdated = reviewService.updateReview(reviewToUpdate, reviewId);
        reviewService.calculateAverageStarsForBook(reviewUpdated.getBook().getId());
        return ResponseEntity.ok(ReviewMapper.review2ReviewDTO(reviewUpdated));
    }

    @DeleteMapping("/delete/{reviewId}/{bookId}")
    public ResponseEntity<?> delete(@PathVariable Long reviewId,
                                    @PathVariable Long bookId
    ) {
        reviewService.RemoveReviewFromBook(reviewId, bookId);
        reviewService.calculateAverageStarsForBook(bookId);
        return ResponseEntity.ok("Review deleted successfully");
    }

    @GetMapping("/findreviewDESC/{bookId}")
    public ResponseEntity<?> getReviewsInAscendingOrder(@PathVariable Long bookId,
                                                        @RequestParam(required = false) Integer page,
                                                        @RequestParam(required = false) Integer size) {
        return ResponseEntity.ok(reviewService.getReviewsForBook(bookId, page, size));
    }


}
