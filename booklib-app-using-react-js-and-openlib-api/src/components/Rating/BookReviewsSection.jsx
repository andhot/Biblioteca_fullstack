import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { AppContext } from '../../context';
import StarRating from './StarRating';
import useSubmitOnce from '../../hooks/useSubmitOnce';
import './BookReviews.css';

const BookReviewsSection = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({ stars: 0, message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const { API_BASE_URL, user } = useContext(AppContext);
  const { submitOnce, isSubmitting } = useSubmitOnce();
  const [userHasReview, setUserHasReview] = useState(false);
  const submitButtonRef = useRef(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/reviews/findreviewDESC/${bookId}?page=${currentPage}&size=5`
      );
      
      if (response.ok) {
        const data = await response.json();
        setReviews(data.content || []);
        setTotalPages(data.totalPages || 0);
        
        // Check if current user has already reviewed this book
        if (user && data.content) {
          const hasUserReview = data.content.some(review => 
            review.user && review.user.id === user.id
          );
          setUserHasReview(hasUserReview);
        }
      } else {
        setError('Eroare la încărcarea review-urilor');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Eroare la încărcarea review-urilor');
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, bookId, currentPage, user]);

  const fetchAverageRating = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/average/${bookId}`);
      if (response.ok) {
        const rating = await response.json();
        setAverageRating(rating || 0);
      }
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  }, [API_BASE_URL, bookId]);

  useEffect(() => {
    if (bookId) {
      fetchReviews();
      fetchAverageRating();
    }
  }, [bookId, fetchReviews, fetchAverageRating]);

  const handleSubmitReview = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Disable the submit button immediately
    if (submitButtonRef.current) {
      submitButtonRef.current.disabled = true;
    }
    
    if (!user) {
      setError('Trebuie să fii autentificat pentru a lăsa un review');
      if (submitButtonRef.current) {
        submitButtonRef.current.disabled = false;
      }
      return;
    }

    if (newReview.stars === 0) {
      setError('Te rog să selectezi un rating');
      if (submitButtonRef.current) {
        submitButtonRef.current.disabled = false;
      }
      return;
    }

    if (newReview.message.trim().length < 10) {
      setError('Review-ul trebuie să aibă cel puțin 10 caractere');
      if (submitButtonRef.current) {
        submitButtonRef.current.disabled = false;
      }
      return;
    }

    const submitData = {
      bookId,
      userId: user.id,
      stars: newReview.stars,
      message: newReview.message,
      timestamp: Date.now() // Add timestamp to make each submission unique
    };

    await submitOnce(async () => {
      try {
        setSubmitting(true);
        setError('');
        
        console.log('Submitting review for book:', bookId, 'user:', user.id);

        const response = await fetch(
          `${API_BASE_URL}/reviews/addreview/${bookId}/${user.id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              stars: newReview.stars,
              message: newReview.message
            })
          }
        );

        if (response.ok) {
          setNewReview({ stars: 0, message: '' });
          setShowAddReview(false);
          setCurrentPage(0); // Reset to first page to see new review
          // Refresh data after successful submission
          setTimeout(async () => {
            await fetchReviews();
            await fetchAverageRating();
          }, 100);
        } else {
          const errorData = await response.text();
          if (errorData.includes('already submitted a review')) {
            setError('Ai lăsat deja un review pentru această carte. Poți avea doar un review per carte.');
          } else {
            setError(errorData || 'Eroare la adăugarea review-ului');
          }
        }
      } catch (error) {
        console.error('Error submitting review:', error);
        setError('Eroare la adăugarea review-ului');
      } finally {
        setSubmitting(false);
        // Re-enable the submit button after a delay
        setTimeout(() => {
          if (submitButtonRef.current) {
            submitButtonRef.current.disabled = false;
          }
        }, 2000);
      }
    }, submitData);
  }, [API_BASE_URL, bookId, user, newReview, fetchReviews, fetchAverageRating, submitOnce]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="book-reviews-section">
      <div className="reviews-header-section">
        <h3>Review-uri și Rating</h3>
      </div>

      {/* Average Rating Section */}
      <div className="average-rating-section">
        <div className="average-rating">
          <StarRating 
            rating={averageRating} 
            size="large" 
            showValue={true}
          />
          <span className="reviews-count">
            ({reviews.length} review{reviews.length !== 1 ? '-uri' : ''})
          </span>
        </div>
      </div>

      {/* Add Review Section */}
      {user && !userHasReview && (
        <div className="add-review-section">
          {!showAddReview ? (
            <button 
              className="add-review-btn"
              onClick={() => setShowAddReview(true)}
            >
              Adaugă un review
            </button>
          ) : (
            <form onSubmit={handleSubmitReview} className="review-form">
              <h4>Adaugă review-ul tău</h4>
              
              <div className="rating-input">
                <label>Rating:</label>
                <StarRating
                  rating={newReview.stars}
                  interactive={true}
                  size="large"
                  onRatingChange={(rating) => setNewReview(prev => ({ ...prev, stars: rating }))}
                />
              </div>

              <div className="message-input">
                <label htmlFor="review-message">Mesajul tău:</label>
                <textarea
                  id="review-message"
                  value={newReview.message}
                  onChange={(e) => setNewReview(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Scrie părerea ta despre această carte..."
                  rows={4}
                  maxLength={500}
                />
                <span className="char-count">
                  {newReview.message.length}/500 caractere
                </span>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddReview(false);
                    setNewReview({ stars: 0, message: '' });
                    setError('');
                  }}
                  disabled={submitting}
                >
                  Anulează
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={submitting || isSubmitting()}
                  ref={submitButtonRef}
                >
                  {submitting ? 'Se trimite...' : 'Trimite review-ul'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {!user && (
        <div className="login-prompt">
          <p>Trebuie să fii autentificat pentru a lăsa un review.</p>
        </div>
      )}

      {user && userHasReview && (
        <div className="login-prompt">
          <p>Ai lăsat deja un review pentru această carte.</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list-section">
        {loading ? (
          <div className="loading">Se încarcă review-urile...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="no-reviews">
            <p>Nu există încă review-uri pentru această carte.</p>
            {user && <p>Fii primul care lasă un review!</p>}
          </div>
        ) : (
          <>
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <span className="reviewer-name">
                        {review.user?.firstName} {review.user?.lastName}
                      </span>
                      <span className="review-date">
                        {formatDate(review.dateOfCreation)}
                      </span>
                    </div>
                    <StarRating 
                      rating={review.stars} 
                      size="small" 
                      showValue={false}
                    />
                  </div>
                  <div className="review-message">
                    {review.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="page-btn"
                >
                  ← Anterior
                </button>
                
                <span className="page-info">
                  Pagina {currentPage + 1} din {totalPages}
                </span>
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="page-btn"
                >
                  Următor →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookReviewsSection; 