import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from "../Loader/Loader";
import coverImg from "../../images/cover_not_found.jpg";
import "./BookDetails.css";
import { FaArrowLeft, FaHeart, FaRegHeart } from "react-icons/fa";
import ReservationModal from '../BookList/ReservationModal';
import BookReviewsSection from '../Rating/BookReviewsSection';
import StarRating from '../Rating/StarRating';
import { useGlobalContext } from '../../context';

// const URL = "https://openlibrary.org/works/"; // Remove or comment out this line

const BookDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [availableExemplaries, setAvailableExemplaries] = useState(0);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();
  const [showReservation, setShowReservation] = useState(false);
  const { API_BASE_URL, addToFavorites, removeFromFavorites, isFavorite } = useGlobalContext();

  // Check if book is favorite using global context
  const isBookFavorite = isFavorite(parseInt(id));

  const getBookDetails = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch book details from backend
      const response = await fetch(`${API_BASE_URL}/books/${id}`);
      if (!response.ok) {
        throw new Error('Nu s-au putut prelua detaliile cărții');
      }
      const data = await response.json();

      if (data) {
        // Map data from BookDTO to the book state structure
        const newBook = {
          id: data.id,
          title: data.title || 'Titlu indisponibil',
          author: data.author || 'Autor necunoscut',
          cover_img: data.coverImageUrl && data.coverImageUrl.trim() !== '' ? data.coverImageUrl : coverImg,
          publishYear: data.appearanceDate
            ? (new Date(data.appearanceDate)).getFullYear()
            : 'An necunoscut',
          isbn: data.isbn || 'ISBN indisponibil',
          language: data.language || 'Limba necunoscută',
          category: data.category || 'Categorie necunoscută',
          nrOfPages: data.nrOfPages || 'N/A',
          description: data.description || 'Descriere indisponibilă',
          exemplaries: data.exemplaries || []
        };
        setBook(newBook);
        
        // Calculate available exemplaries
        const available = data.exemplaries ? data.exemplaries.length : 0;
        setAvailableExemplaries(available);
      } else {
        setBook(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Eroare la preluarea detaliilor cărții:', error);
      setBook(null);
      setLoading(false);
    }
  }, [id, API_BASE_URL]);

  const fetchAverageRating = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/average/${id}`);
      if (response.ok) {
        const rating = await response.json();
        setAverageRating(rating || 0);
      }
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  }, [id, API_BASE_URL]);

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!book) return;
    
    const favCover = book.cover_img && !book.cover_img.includes('undefined') && !book.cover_img.includes('null') 
      ? book.cover_img 
      : coverImg;
    
    if (isBookFavorite) {
      removeFromFavorites(book.id);
    } else {
      addToFavorites({ 
        id: book.id, 
        cover_img: favCover, 
        title: book.title, 
        author: book.author, 
        publishYear: book.publishYear 
      });
      setAnimate(true);
      setTimeout(() => setAnimate(false), 600);
    }
  };

  useEffect(() => {
    getBookDetails();
    fetchAverageRating();
  }, [getBookDetails, fetchAverageRating]);

  if (loading) return <Loading />;
  if (!book) return <div className="book-details"><div className="container">Cartea nu a fost găsită.</div></div>;

  return (
    <section className='book-details'>
      <div className='container'>
        <button type='button' className='back-btn' onClick={() => navigate(-1)}>
          <FaArrowLeft size={22} />
          <span>Înapoi</span>
        </button>

        <div className='book-details-header'>
          <div className='book-details-cover'>
            <div className='book-cover-container'>
              <img src={book.cover_img} alt="cover img" />
              <button 
                className={`favorite-btn-overlay ${isBookFavorite ? 'active' : ''}`}
                onClick={handleFavoriteToggle}
                title={isBookFavorite ? 'Elimină din favorite' : 'Adaugă la favorite'}
              >
                <span className={`heart-anim ${animate ? 'animate' : ''}`}>
                  {isBookFavorite ? <FaHeart /> : <FaRegHeart />}
                </span>
              </button>
            </div>
          </div>
          <div className='book-details-main'>
            <h2 className='book-title'>{book.title}</h2>
            <div className='book-author-rating'>
              <span className='book-author'>{book.author}</span>
              <div className='book-rating'>
                <StarRating 
                  rating={averageRating} 
                  size="medium" 
                  showValue={true}
                />
              </div>
            </div>
            <div className='book-meta'>
              <div><b>ISBN:</b> {book.isbn}</div>
              <div><b>An publicare:</b> {book.publishYear}</div>
              <div><b>Pagini:</b> {book.nrOfPages}</div>
              <div><b>Limba:</b> {book.language}</div>
              <div><b>Categorie:</b> {book.category}</div>
              {/* Add other details from backend if available */}
            </div>
            <div className='book-action'>
              <div className='action-buttons'>
                <button className='reserve-btn' onClick={() => setShowReservation(true)}>
                  Rezervă cartea
                </button>
                <button 
                  className={`favorite-btn-details ${isBookFavorite ? 'active' : ''}`}
                  onClick={handleFavoriteToggle}
                  title={isBookFavorite ? 'Elimină din favorite' : 'Adaugă la favorite'}
                >
                  <>
                    {isBookFavorite ? <FaHeart /> : <FaRegHeart />}
                    <span>{isBookFavorite ? 'Elimină din favorite' : 'Adaugă la favorite'}</span>
                  </>
                </button>
              </div>
              <div className='book-availability'>
                <span className={`book-exemplaries ${availableExemplaries > 0 ? "available" : "unavailable"}`}>
                  Exemplare disponibile: {availableExemplaries}
                  {availableExemplaries === 0 && <span className="unavailable-text"> (Indisponibil)</span>}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='book-details-description'>
          <h3>Descriere</h3>
          <p>{book.description}</p> {/* Display description from backend */}
        </div>

        {/* Reviews Section */}
        <BookReviewsSection bookId={id} />

        {/* Recommendations section (optional, depends on backend implementation) */}
        {/* <div className='book-details-recommendations'>
          <h3>S-ar putea să-ți placă și:</h3>
          <div className='recommendations-list'>
             Add components or cards for recommendations 
            <div className='recommendation-card placeholder'>Carte recomandată 1</div>
            <div className='recommendation-card placeholder'>Carte recomandată 2</div>
            <div className='recommendation-card placeholder'>Carte recomandată 3</div>
          </div>
        </div> */}
      </div>
      {showReservation && (
        <ReservationModal
          book={book}
          isOpen={showReservation}
          onRequestClose={() => setShowReservation(false)}
        />
      )}
    </section>
  );
};

export default BookDetails;