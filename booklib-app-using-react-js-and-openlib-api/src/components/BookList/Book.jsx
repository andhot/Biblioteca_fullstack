import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../../context.jsx';
import { AppContext } from '../../context.jsx';
import StarRating from '../Rating/StarRating';
import "./BookList.css";

const Book = ({ id, cover_img, title, author, publishYear, isbn, language, category }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useGlobalContext();
  const { API_BASE_URL } = useContext(AppContext);
  const isFav = isFavorite(id);
  const [animate, setAnimate] = useState(false);
  const [imgSrc, setImgSrc] = useState(cover_img);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchAverageRating();
  }, [id, API_BASE_URL]);

  const fetchAverageRating = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/average/${id}`);
      if (response.ok) {
        const rating = await response.json();
        setAverageRating(rating || 0);
      }
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const favCover = imgSrc && !imgSrc.includes('undefined') && !imgSrc.includes('null') ? imgSrc : require('../../images/cover_not_found.jpg');
    if (isFav) {
      removeFromFavorites(id);
    } else {
      addToFavorites({ id, cover_img: favCover, title, author, publishYear });
      setAnimate(true);
      setTimeout(() => setAnimate(false), 600);
    }
  };



  return (
    <div className='book-item flex flex-column flex-sb'>
      <div className='book-item-img'>
        <img 
          src={imgSrc} 
          alt={title} 
          onError={e => { e.target.onerror = null; setImgSrc(require('../../images/cover_not_found.jpg')); }}
        />
        <button 
          className={`favorite-btn ${isFav ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          title={isFav ? 'Elimină din favorite' : 'Adaugă la favorite'}
        >
          <span className={`heart-anim ${animate ? 'animate' : ''}`}>
            <i className={`fa${isFav ? 's' : 'r'} fa-heart`}></i>
          </span>
        </button>
      </div>
      <div className='book-item-info text-center'>
        <Link to={`/book/${id}`}>
          <div className='book-item-info-item title fw-7 fs-18'>
            <span>{title}</span>
          </div>
        </Link>

        <div className='book-item-info-item author fs-15'>
          <span className='text-capitalize fw-7'>Autor: </span>
          <span>{author}</span>
        </div>

        <div className='book-item-info-item edition-count fs-15'>
          <span className='text-capitalize fw-7'>Anul publicării: </span>
          <span>{publishYear}</span>
        </div>

        <div className='book-item-info-item isbn fs-15'>
          <span className='text-capitalize fw-7'>ISBN: </span>
          <span>{isbn}</span>
        </div>

        <div className='book-item-info-item language fs-15'>
          <span className='text-capitalize fw-7'>Limba: </span>
          <span>{language}</span>
        </div>

        <div className='book-item-info-item category fs-15'>
          <span className='text-capitalize fw-7'>Categorie: </span>
          <span>{category}</span>
        </div>

        <div className='book-item-info-item rating fs-15'>
          <span className='text-capitalize fw-7'>Rating: </span>
          <div className='rating-container'>
            <StarRating 
              rating={averageRating} 
              size="small" 
              showValue={true}
            />
          </div>
        </div>
      </div>


    </div>
  );
};

export default Book;