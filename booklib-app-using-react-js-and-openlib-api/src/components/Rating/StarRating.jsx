import React, { useState } from 'react';
import './StarRating.css';

const StarRating = ({ 
  rating = 0, 
  maxRating = 5, 
  size = 'medium', 
  interactive = false, 
  onRatingChange = null,
  showValue = false 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const handleStarClick = (starValue) => {
    if (!interactive) return;
    
    setCurrentRating(starValue);
    if (onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleStarHover = (starValue) => {
    if (!interactive) return;
    setHoverRating(starValue);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };

  const getStarClass = (starIndex) => {
    const displayRating = interactive ? (hoverRating || currentRating) : rating;
    const baseClass = `star ${size}`;
    
    if (starIndex <= displayRating) {
      return `${baseClass} filled`;
    } else if (starIndex - 0.5 <= displayRating) {
      return `${baseClass} half-filled`;
    } else {
      return `${baseClass} empty`;
    }
  };

  return (
    <div className={`star-rating ${interactive ? 'interactive' : 'readonly'}`}>
      <div className="stars-container" onMouseLeave={handleMouseLeave}>
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          return (
            <span
              key={starValue}
              className={getStarClass(starValue)}
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => handleStarHover(starValue)}
              title={interactive ? `Rate ${starValue} star${starValue > 1 ? 's' : ''}` : `${rating} out of ${maxRating} stars`}
            >
              ★
            </span>
          );
        })}
      </div>
      
      {showValue && (
        <span className="rating-value">
          {interactive ? (hoverRating || currentRating) : rating.toFixed(1)} / {maxRating}
        </span>
      )}
    </div>
  );
};

export default StarRating; 