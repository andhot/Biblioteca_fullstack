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



    @PostMapping("/addreview/{bookId}/{userId}")
    public synchronized ResponseEntity<?> create(@PathVariable Long bookId,
                                    @PathVariable Long userId,
                                    @RequestBody ReviewDTO reviewDTO) {

        System.out.println("=== REVIEW SUBMISSION REQUEST ===");
        System.out.println("BookId: " + bookId + ", UserId: " + userId);
        System.out.println("Review: " + reviewDTO.getStars() + " stars, Message: " + reviewDTO.getMessage());
        System.out.println("Timestamp: " + java.time.LocalDateTime.now());
        System.out.println("Thread: " + Thread.currentThread().getName());
        
        try {
            Review reviewToCreate = ReviewMapper.reviewDTO2Review(reviewDTO);
            Review reviewCreated = reviewService.addReviewToBook(reviewToCreate, bookId, userId);
            reviewService.calculateAverageStarsForBook(bookId);
            
            System.out.println("Review created successfully with ID: " + reviewCreated.getId());
            System.out.println("=== END REVIEW SUBMISSION ===");
            
            return ResponseEntity.ok(ReviewMapper.review2ReviewDTO(reviewCreated));
        } catch (RuntimeException e) {
            System.out.println("Error creating review: " + e.getMessage());
            System.out.println("=== END REVIEW SUBMISSION (ERROR) ===");
            return ResponseEntity.badRequest().body(e.getMessage());
        }
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
        var reviewsPage = reviewService.getReviewsForBook(bookId, page, size);
        var reviewDTOs = reviewsPage.getContent().stream()
                .map(ReviewMapper::review2ReviewDTOWithUser)
                .toList();
        
        // Create a custom response with the mapped DTOs
        var response = new java.util.HashMap<String, Object>();
        response.put("content", reviewDTOs);
        response.put("totalPages", reviewsPage.getTotalPages());
        response.put("totalElements", reviewsPage.getTotalElements());
        response.put("size", reviewsPage.getSize());
        response.put("number", reviewsPage.getNumber());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/average/{bookId}")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long bookId) {
        double averageRating = reviewService.calculateAverageStarsForBook(bookId);
        return ResponseEntity.ok(averageRating);
    }


}
