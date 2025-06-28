import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context';
import { useGlobalContext } from '../../context';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import SearchForm from '../../components/SearchForm/SearchForm';
import BookList from '../../components/BookList/BookList';
import StarRating from '../../components/Rating/StarRating';
import ReservationModal from '../../components/BookList/ReservationModal';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [popularBooks, setPopularBooks] = useState([]);
  const [topRatedBooks, setTopRatedBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [bookRatings, setBookRatings] = useState({});
  const [showReservation, setShowReservation] = useState(false);
  const [selectedBookForReservation, setSelectedBookForReservation] = useState(null);
  const [animatingBooks, setAnimatingBooks] = useState(new Set());
  const [currentTopRatedPage, setCurrentTopRatedPage] = useState(0);
  const [totalBooksCount, setTotalBooksCount] = useState(0);
  const [booksByCategory, setBooksByCategory] = useState({});
  const [totalUsers, setTotalUsers] = useState(0);
  const booksPerPage = 4; // Afișăm 4 cărți per pagină pentru un design mai curat
  const { API_BASE_URL } = useContext(AppContext);
  const { addToFavorites, removeFromFavorites, isFavorite } = useGlobalContext();

  useEffect(() => {
    fetchPopularBooks();
    fetchTopRatedBooks();
    fetchCategories();
    fetchLibraries();
    fetchTotalBooksCount();
    // Fetch statistici globale (inclusiv utilizatori)
    fetch('http://localhost:8081/api/statistics/global')
      .then(res => res.json())
      .then(data => {
        setBooksByCategory(data.booksByCategory || {});
        setTotalUsers(data.totalUsers || 0);
      })
      .catch(() => {
        setBooksByCategory({});
        setTotalUsers(0);
      });
  }, [API_BASE_URL]);

  useEffect(() => {
    // Fetch ratings for popular books
    if (popularBooks.length > 0) {
      fetchBookRatings(popularBooks);
    }
  }, [popularBooks]);

  useEffect(() => {
    // Fetch ratings for top-rated books
    if (topRatedBooks.length > 0) {
      fetchBookRatings(topRatedBooks);
    }
  }, [topRatedBooks]);

  const fetchPopularBooks = async () => {
    try {
      // Pentru moment folosim endpoint-ul existent, mai târziu vom crea unul pentru cărți populare
      const response = await fetch(`${API_BASE_URL}/books?page=0&size=6`);
      if (response.ok) {
        const data = await response.json();
        setPopularBooks(data.content || []);
      }
    } catch (error) {
      console.error('Error fetching popular books:', error);
    }
  };

  const fetchTopRatedBooks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/top-rated?limit=20`); // Aducem mai multe cărți pentru paginare
      if (response.ok) {
        const data = await response.json();
        setTopRatedBooks(data || []);
      }
    } catch (error) {
      console.error('Error fetching top-rated books:', error);
    }
  };

  const fetchCategories = async () => {
    // Categorii statice pentru moment, mai târziu vom crea endpoint pentru statistici
    const staticCategories = [
      { name: 'LITERATURE', displayName: 'Literatură', icon: '📚', count: 0 },
      { name: 'SCIENCE', displayName: 'Știință', icon: '🔬', count: 0 },
      { name: 'HISTORY', displayName: 'Istorie', icon: '🏛️', count: 0 },
      { name: 'FANTASY', displayName: 'Fantasy', icon: '🐉', count: 0 },
      { name: 'SF', displayName: 'Science Fiction', icon: '🚀', count: 0 },
      { name: 'ROMANCE', displayName: 'Romantic', icon: '💕', count: 0 },
      { name: 'THRILLER', displayName: 'Thriller', icon: '🔍', count: 0 },
      { name: 'MYSTERY', displayName: 'Mister', icon: '🕵️', count: 0 }
    ];
    setCategories(staticCategories);
  };

  const fetchLibraries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/libraries/details`);
      if (response.ok) {
        const data = await response.json();
        setLibraries(data || []);
      }
    } catch (error) {
      console.error('Error fetching libraries:', error);
    }
  };

  const fetchTotalBooksCount = async () => {
    try {
      // Use the pagination endpoint to get total count
      const response = await fetch(`${API_BASE_URL}/books/pagination?page=0&size=1`);
      if (response.ok) {
        const data = await response.json();
        setTotalBooksCount(data.totalElements || 0);
      } else {
        console.error('Error fetching books count:', response.status);
        setTotalBooksCount(0);
      }
    } catch (error) {
      console.error('Error fetching total books count:', error);
      setTotalBooksCount(0);
    }
  };

  const fetchBookRatings = async (books) => {
    const ratings = {};
    
    for (const book of books) {
      try {
        const response = await fetch(`${API_BASE_URL}/reviews/average/${book.id}`);
        if (response.ok) {
          const rating = await response.json();
          ratings[book.id] = rating || 0;
        }
      } catch (error) {
        console.error(`Error fetching rating for book ${book.id}:`, error);
        ratings[book.id] = 0;
      }
    }
    
    setBookRatings(ratings);
  };

  const handleSearch = (term) => {
    if (term && term.trim() !== '') {
      navigate(`/all-books?search=${encodeURIComponent(term.trim())}`);
    } else {
      navigate('/all-books');
    }
  };

  const handleCategoryClick = (categoryName) => {
    // Redirectionează către AllBooks cu filtrul de categorie aplicat
    navigate(`/all-books?category=${encodeURIComponent(categoryName)}`);
  };

  const handleBookClick = (book) => {
    // Navigate to book details page instead of opening reviews modal
    navigate(`/book/${book.id}`);
  };

  const handleFavoriteToggle = (e, book) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favCover = book.coverImageUrl && !book.coverImageUrl.includes('undefined') && !book.coverImageUrl.includes('null') 
      ? book.coverImageUrl 
      : require('../../images/cover_not_found.jpg');
    
    if (isFavorite(book.id)) {
      removeFromFavorites(book.id);
    } else {
      addToFavorites({ 
        id: book.id, 
        cover_img: favCover, 
        title: book.title, 
        author: book.author, 
        publishYear: book.appearanceDate ? new Date(book.appearanceDate).getFullYear() : 'N/A'
      });
      
      // Add animation
      setAnimatingBooks(prev => new Set([...prev, book.id]));
      setTimeout(() => {
        setAnimatingBooks(prev => {
          const newSet = new Set(prev);
          newSet.delete(book.id);
          return newSet;
        });
      }, 600);
    }
  };



  // Funcții pentru navigarea prin cărțile top-rated
  const getTotalTopRatedPages = () => {
    return Math.ceil(topRatedBooks.length / booksPerPage);
  };

  const getCurrentTopRatedBooks = () => {
    const startIndex = currentTopRatedPage * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    return topRatedBooks.slice(startIndex, endIndex);
  };

  const handlePrevTopRated = () => {
    setCurrentTopRatedPage(prev => prev > 0 ? prev - 1 : getTotalTopRatedPages() - 1);
  };

  const handleNextTopRated = () => {
    setCurrentTopRatedPage(prev => prev < getTotalTopRatedPages() - 1 ? prev + 1 : 0);
  };

  if (showSearch) {
    return (
      <div className="home-container">
        <div className="search-results-header">
          <button 
            className="back-to-home-btn"
            onClick={() => setShowSearch(false)}
          >
            ← Înapoi la pagina principală
          </button>
          <h2>Rezultate căutare: "{searchTerm}"</h2>
        </div>
        <SearchForm onSearch={handleSearch} initialValue={searchTerm} />
        <BookList searchTerm={searchTerm} />
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-icon">📚</span>
            Biblioteca Digitală
          </h1>
          <p className="hero-subtitle">
            Descoperă, Rezervă, Citește - Accesul tău la mii de cărți din bibliotecile partenere
          </p>
          
          <div className="hero-search">
            <SearchForm onSearch={handleSearch} placeholder="Caută după titlu, autor sau ISBN..." />
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{totalBooksCount}</span>
              <span className="stat-label">Cărți disponibile</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{libraries.length}</span>
              <span className="stat-label">Biblioteci partenere</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{totalUsers}</span>
              <span className="stat-label">TOTAL UTILIZATORI</span>
            </div>
          </div>


        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Explorează pe Categorii</h2>
          <p>Găsește cărțile perfecte pentru tine</p>
        </div>
        
        <div className="categories-grid">
          {categories.map((category) => (
            <div 
              key={category.name}
              className="category-card"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="category-icon">{category.icon}</div>
              <h3 className="category-name">{category.displayName}</h3>
              <p className="category-count">{booksByCategory[category.name] || 0} cărți</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Books Section */}
      <section className="popular-books-section">
        <div className="section-header">
          <h2>Cărți Populare</h2>
          <p>Cele mai rezervate cărți din bibliotecile noastre</p>
        </div>
        
        <div className="books-grid">
          {popularBooks.slice(0, 6).map((book) => (
            <div 
              key={book.id} 
              className="book-card"
              onClick={() => handleBookClick(book)}
            >
              <div className="book-image">
                {book.coverImageUrl ? (
                  <img src={book.coverImageUrl} alt={book.title} />
                ) : (
                  <div className="book-placeholder">📖</div>
                )}
                
                <button 
                  className={`favorite-btn-overlay ${isFavorite(book.id) ? 'active' : ''}`}
                  onClick={(e) => handleFavoriteToggle(e, book)}
                  title={isFavorite(book.id) ? 'Elimină din favorite' : 'Adaugă la favorite'}
                >
                  <span className={`heart-anim ${animatingBooks.has(book.id) ? 'animate' : ''}`}>
                    {isFavorite(book.id) ? <FaHeart /> : <FaRegHeart />}
                  </span>
                </button>
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <div className="book-rating">
                  <StarRating 
                    rating={bookRatings[book.id] || 0} 
                    size="small" 
                    showValue={true}
                  />
                </div>
                <p className="book-category">{book.category}</p>
                <div className="book-library">
                  <span className="library-icon">🏛️</span>
                  {book.library?.name || 'Biblioteca'}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="section-footer">
          <button 
            className="view-all-btn"
            onClick={() => window.location.href = '/all-books'}
          >
            Vezi toate cărțile →
          </button>
        </div>
      </section>

      {/* Top Rated Books Section */}
      <section className="top-rated-books-section">
        <div className="section-header">
          <h2>Top cărți</h2>
          <select className="period-selector">
            <option value="30">Ultimele 30 de zile</option>
            <option value="7">Ultimele 7 zile</option>
            <option value="90">Ultimele 90 de zile</option>
          </select>
        </div>
        
        <div className="books-carousel-container">
          <div className="books-grid">
          {getCurrentTopRatedBooks().map((book) => {
            const rating = bookRatings[book.id] || 0;
            const reviewCount = book.reviewCount || 0;
            const isNewBook = book.appearanceDate && 
              new Date(book.appearanceDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
            const isTopRated = rating >= 4.5;

            return (
              <div 
                key={book.id} 
                className="modern-book-card"
                onClick={() => handleBookClick(book)}
              >
                                 <div className={`book-availability-badge ${!book.exemplaries || book.exemplaries.length === 0 ? 'unavailable' : ''}`}>
                   {book.exemplaries && book.exemplaries.length > 0 ? 'Disponibilă' : 'Indisponibilă'}
                 </div>
                
                <div className="modern-book-image">
                  {book.coverImageUrl ? (
                    <img src={book.coverImageUrl} alt={book.title} />
                  ) : (
                    <div className="book-placeholder-modern">📖</div>
                  )}
                  
                  <button 
                    className={`favorite-btn-overlay ${isFavorite(book.id) ? 'active' : ''}`}
                    onClick={(e) => handleFavoriteToggle(e, book)}
                    title={isFavorite(book.id) ? 'Elimină din favorite' : 'Adaugă la favorite'}
                  >
                    <span className={`heart-anim ${animatingBooks.has(book.id) ? 'animate' : ''}`}>
                      {isFavorite(book.id) ? <FaHeart /> : <FaRegHeart />}
                    </span>
                  </button>
                  
                  <div className="book-status-badges">
                    {isNewBook && (
                      <span className="status-badge nou">NOU</span>
                    )}
                    {isTopRated && (
                      <span className="status-badge bestseller">TOP RATED</span>
                    )}
                  </div>
                </div>
                
                <div className="modern-book-info">
                  <div>
                    <h3 className="modern-book-title">{book.title}</h3>
                    <p className="modern-book-author">{book.author}</p>
                    
                    <div className="modern-book-rating">
                      <div className="star-rating-modern">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star} 
                            className={`star-modern ${star <= Math.round(rating) ? '' : 'empty'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="rating-count">
                        ({rating > 0 ? `${rating.toFixed(1)} - ${reviewCount} recenzii` : 'Fără recenzii'})
                      </span>
                    </div>
                  </div>
                  
                  <div className="modern-book-library-info">
                    <div className="library-info">
                      <span className="library-name">📍 {book.library?.name || 'Biblioteca Centrală'}</span>
                      <span className="book-category">{book.category}</span>
                    </div>
                    
                    <button 
                      className="reserve-btn-modern"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setSelectedBookForReservation(book); 
                        setShowReservation(true); 
                      }}
                      disabled={!book.exemplaries || book.exemplaries.length === 0}
                      title="Rezervă cartea"
                    >
                      📚
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
        
        <div className="books-navigation">
          <button 
            className="nav-arrow" 
            onClick={handlePrevTopRated}
            disabled={topRatedBooks.length <= booksPerPage}
            title="Cărțile anterioare"
          >
            ‹
          </button>
          <div className="navigation-dots">
            {Array.from({ length: getTotalTopRatedPages() }, (_, index) => (
              <button
                key={index}
                className={`nav-dot ${index === currentTopRatedPage ? 'active' : ''}`}
                onClick={() => setCurrentTopRatedPage(index)}
                title={`Pagina ${index + 1}`}
              />
            ))}
          </div>
          <button 
            className="nav-arrow" 
            onClick={handleNextTopRated}
            disabled={topRatedBooks.length <= booksPerPage}
            title="Cărțile următoare"
          >
            ›
          </button>
        </div>
      </section>

      {/* Libraries Section */}
      <section className="libraries-section">
        <div className="section-header">
          <h2>Bibliotecile Noastre Partenere</h2>
          <p>Găsește biblioteca cea mai apropiată de tine</p>
        </div>
        
        <div className="libraries-grid">
          {libraries.map((library) => (
            <div key={library.id} className="library-card">
              <div className="library-icon">🏛️</div>
              <h3 className="library-name">{library.name}</h3>
              <p className="library-address">{library.adress}</p>
              <p className="library-phone">{library.phoneNumber}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Începe să citești astăzi!</h2>
          <p>Alătură-te comunității noastre de cititori și descoperă lumea cărților</p>
          <button 
            className="cta-button"
            onClick={() => window.location.href = '/all-books'}
          >
            Explorează Biblioteca
          </button>
        </div>
              </section>



        {/* Reservation Modal */}
        {showReservation && selectedBookForReservation && (
          <ReservationModal
            book={selectedBookForReservation}
            isOpen={showReservation}
            onRequestClose={() => {
              setShowReservation(false);
              setSelectedBookForReservation(null);
            }}
          />
        )}
      </div>
    );
  };

export default Home;
