import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from "../Loader/Loader";
import coverImg from "../../images/cover_not_found.jpg";
import "./BookDetails.css";
import { FaArrowLeft } from "react-icons/fa";
import ReservationModal from '../BookList/ReservationModal';
import { useGlobalContext } from '../../context'; // Import useGlobalContext

// const URL = "https://openlibrary.org/works/"; // Remove or comment out this line

const BookDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState(null);
  const navigate = useNavigate();
  const [showReservation, setShowReservation] = useState(false);
  const { API_BASE_URL } = useGlobalContext(); // Use API_BASE_URL from context

  const getBookDetails = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch book details from backend
      const response = await fetch(`${API_BASE_URL}/books/${id}`); // Updated URL
      if (!response.ok) {
        throw new Error('Nu s-au putut prelua detaliile cărții');
      }
      const data = await response.json(); // Backend returns BookDTO

      if (data) {
        // Map data from BookDTO to the book state structure
        const newBook = {
          id: data.id,
          title: data.title || 'Titlu indisponibil',
          author: data.author || 'Autor necunoscut',
          cover_img: data.coverImageUrl && data.coverImageUrl.trim() !== '' ? data.coverImageUrl : coverImg, // Use backend coverImageUrl
          publishYear: data.appearanceDate
            ? (new Date(data.appearanceDate)).getFullYear()
            : 'An necunoscut',
          isbn: data.isbn || 'ISBN indisponibil',
          language: data.language || 'Limba necunoscută',
          category: data.category || 'Categorie necunoscută',
          nrOfPages: data.nrOfPages || 'N/A',
          description: data.description || 'Descriere indisponibilă', // Use description from backend
          // Include other fields from BookDTO as needed
        };
        setBook(newBook);
      } else {
        setBook(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Eroare la preluarea detaliilor cărții:', error);
      setBook(null);
      setLoading(false);
    }
  }, [id, API_BASE_URL]); // Dependency on id and API_BASE_URL

  useEffect(() => {
    getBookDetails();
  }, [getBookDetails]);

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
            <img src={book.cover_img} alt="cover img" />
          </div>
          <div className='book-details-main'>
            <h2 className='book-title'>{book.title}</h2>
            <div className='book-author-rating'>
              <span className='book-author'>{book.author}</span>
              {/* You might want to fetch rating from backend if available */}
              <span className='book-rating'>Rating: N/A</span> 
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
              <button className='reserve-btn' onClick={() => setShowReservation(true)}>Rezervă cartea</button>
              {/* Price and stock info should come from backend/exemplary */}
               {/* Since there is no price, we can remove this or display something else */}
               {/* <span className='book-price'>Preț: N/A</span> */}
               <span className={`book-stock ${true ? "in-stock" : "out-stock"}`}>În stoc: N/A</span> 
            </div>
          </div>
        </div>

        <div className='book-details-description'>
          <h3>Descriere</h3>
          <p>{book.description}</p> {/* Display description from backend */}
        </div>

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