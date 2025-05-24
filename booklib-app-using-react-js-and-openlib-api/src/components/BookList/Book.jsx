import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../../context.jsx';
import "./BookList.css";

const Book = ({ id, cover_img, title, author, publishYear, isbn, language, category }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useGlobalContext();
  const isFav = isFavorite(id);
  const [animate, setAnimate] = useState(false);
  const [imgSrc, setImgSrc] = useState(cover_img);

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
      </div>
    </div>
  );
};

export default Book;