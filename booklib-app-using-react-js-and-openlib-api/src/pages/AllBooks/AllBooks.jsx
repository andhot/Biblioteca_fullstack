import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../../context';
import { useGlobalContext } from '../../context';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import StarRating from '../../components/Rating/StarRating';
import ReservationModal from '../../components/BookList/ReservationModal';
import SearchForm from '../../components/SearchForm/SearchForm';
import './AllBooks.css';

const AllBooks = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedPublisher, setSelectedPublisher] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [showMyBooks, setShowMyBooks] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [animatingBooks, setAnimatingBooks] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const [showReservation, setShowReservation] = useState(false);
  const [selectedBookForReservation, setSelectedBookForReservation] = useState(null);
  const [bookRatings, setBookRatings] = useState({});
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const { API_BASE_URL } = useContext(AppContext);
  const { addToFavorites, removeFromFavorites, isFavorite } = useGlobalContext();

  const sortOptions = [
    { label: 'Recomandate', value: 'recommended' },
    { label: 'Alfabetic A-Z', value: 'title-asc' },
    { label: 'Alfabetic Z-A', value: 'title-desc' },
    { label: 'Cele mai noi', value: 'newest' },
    { label: 'Cele mai bine cotate', value: 'rating' },
    { label: 'Autor A-Z', value: 'author-asc' },
    { label: 'Autor Z-A', value: 'author-desc' }
  ];

  // Handle URL parameters on component mount
  useEffect(() => {
    // Preia parametrul 'search' din URL și setează searchTerm
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl !== null && searchFromUrl !== searchTerm) {
      setSearchTerm(searchFromUrl);
    }
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (showMyBooks) {
      fetchMyBooks();
    } else {
      fetchAllBooks();
    }
    fetchFilterData();
  }, [API_BASE_URL, showMyBooks]);

  useEffect(() => {
    if (books.length > 0) {
      fetchBookRatings(books);
    }
  }, [books]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [books, selectedCategory, selectedAuthor, selectedPublisher, availabilityFilter, sortBy, bookRatings, searchTerm]);

  const fetchAllBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/books/pagination?page=0&size=50`);
      
      if (response.ok) {
        const data = await response.json();
        setBooks(data.content || []);
      } else {
        // Try alternative endpoint
        const altResponse = await fetch(`${API_BASE_URL}/books`);
        if (altResponse.ok) {
          const altData = await altResponse.json();
          setBooks(Array.isArray(altData) ? altData : []);
        }
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      // Get current user ID from localStorage or context
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      if (!currentUser.id) {
        console.error('No user logged in');
        setBooks([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/books/favorites/user/${currentUser.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setBooks(data || []);
      } else {
        console.error('Error fetching user books:', response.status, response.statusText);
        setBooks([]);
      }
    } catch (error) {
      console.error('Error fetching user books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterData = async () => {
    try {
      // Fetch all books to extract unique values for filters
      const response = await fetch(`${API_BASE_URL}/books`);
      if (response.ok) {
        const allBooks = await response.json();
        
        // Extract unique categories
        const uniqueCategories = [...new Set(allBooks.map(book => book.category).filter(Boolean))];
        setCategories(uniqueCategories);
        
        // Extract unique authors
        const uniqueAuthors = [...new Set(allBooks.map(book => book.author).filter(Boolean))];
        setAuthors(uniqueAuthors);
        
        // Extract unique publishers (if available in BookDTO)
        const uniquePublishers = [...new Set(allBooks.map(book => book.publisher).filter(Boolean))];
        setPublishers(uniquePublishers);
        

      }
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  };

  const fetchBookRatings = async (bookList) => {
    const ratings = {};
    
    for (const book of bookList) {
      try {
        // Fetch average rating
        const ratingResponse = await fetch(`${API_BASE_URL}/reviews/average/${book.id}`);
        if (ratingResponse.ok) {
          const rating = await ratingResponse.json();
          ratings[book.id] = rating || 0;
        }

        // Fetch review count
        const reviewsResponse = await fetch(`${API_BASE_URL}/reviews/book/${book.id}`);
        if (reviewsResponse.ok) {
          const reviews = await reviewsResponse.json();
          book.reviewCount = Array.isArray(reviews) ? reviews.length : 0;
        }
      } catch (error) {
        console.error(`Error fetching rating for book ${book.id}:`, error);
        ratings[book.id] = 0;
        book.reviewCount = 0;
      }
    }
    
    setBookRatings(ratings);
  };

  const applyFiltersAndSort = () => {
    let filtered = [...books];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(book => 
        (book.title && book.title.toLowerCase().includes(searchLower)) ||
        (book.author && book.author.toLowerCase().includes(searchLower)) ||
        (book.isbn && book.isbn.toLowerCase().includes(searchLower)) ||
        (book.category && book.category.toLowerCase().includes(searchLower))
      );
    }

    // Apply filters
    if (selectedCategory) {
      filtered = filtered.filter(book => 
        book.category && book.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedAuthor) {
      filtered = filtered.filter(book => 
        book.author && book.author.toLowerCase() === selectedAuthor.toLowerCase()
      );
    }

    if (selectedPublisher) {
      filtered = filtered.filter(book => 
        book.publisher && book.publisher.toLowerCase() === selectedPublisher.toLowerCase()
      );
    }

    // Apply availability filter
    if (availabilityFilter === 'available') {
      // For now, we'll assume all books are available
      // In a real scenario, you'd check book.exemplaries or a status field
      filtered = filtered.filter(book => true); // All books are considered available
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'author-asc':
          return (a.author || '').localeCompare(b.author || '');
        case 'author-desc':
          return (b.author || '').localeCompare(a.author || '');
        case 'rating':
          return (bookRatings[b.id] || 0) - (bookRatings[a.id] || 0);
        case 'newest':
          return new Date(b.appearanceDate || 0) - new Date(a.appearanceDate || 0);
        default:
          return 0;
      }
    });

    setFilteredBooks(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedAuthor('');
    setSelectedPublisher('');
    setAvailabilityFilter('all');
    setShowMyBooks(false);
    setSortBy('recommended');
    setSearchTerm('');
    // Clear URL parameters
    setSearchParams({});
  };

  const handleBookClick = (book) => {
    // Navigate to book details page instead of opening reviews modal
    navigate(`/book/${book.id}`);
  };

  const handleReservation = (book) => {
    setSelectedBookForReservation(book);
    setShowReservation(true);
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



  if (loading) {
    return (
      <div className="all-books-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Se încarcă cărțile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="all-books-container">
      <div className="all-books-header">
        <div className="header-content">
          <div className="header-text">
            <h1>{showMyBooks ? 'Cărțile mele favorite' : 'Cărți'}</h1>
            <p className="books-count">
              {filteredBooks.length} {showMyBooks ? 'cărți favorite' : 'produse'}
            </p>
          </div>
          <div className="header-search">
            <SearchForm 
              onSearch={handleSearch} 
              initialValue={searchTerm}
              placeholder="Caută după titlu, autor, ISBN sau categorie..."
            />
          </div>
        </div>
      </div>

      <div className="all-books-content">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>Filtrează</h3>
            <button className="clear-filters-btn" onClick={clearFilters}>
              Șterge filtrele
              {(selectedCategory || selectedAuthor || selectedPublisher || availabilityFilter !== 'all' || showMyBooks || searchTerm) && (
                <span style={{ marginLeft: '0.5rem', background: '#dc2626', color: 'white', borderRadius: '50%', padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>
                  {[selectedCategory, selectedAuthor, selectedPublisher, availabilityFilter !== 'all', showMyBooks, searchTerm].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* My Books Filter */}
          <div className="filter-section">
            <h4>Cărțile mele</h4>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={showMyBooks}
                  onChange={(e) => setShowMyBooks(e.target.checked)}
                />
                <span className="checkmark-checkbox"></span>
                Afișează doar cărțile mele favorite
              </label>
            </div>
          </div>

          {/* Categories Filter */}
          {categories.length > 0 && (
            <div className="filter-section">
              <h4>Categorii ({categories.length})</h4>
              <div className="filter-options">
                {categories.map((category) => (
                  <label key={category} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <span className="checkmark"></span>
                    {category}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Authors Filter */}
          {authors.length > 0 && (
            <div className="filter-section">
              <h4>Autor ({authors.length})</h4>
              <div className="filter-options">
                {authors.map((author) => (
                  <label key={author} className="filter-option">
                    <input
                      type="radio"
                      name="author"
                      value={author}
                      checked={selectedAuthor === author}
                      onChange={(e) => setSelectedAuthor(e.target.value)}
                    />
                    <span className="checkmark"></span>
                    {author}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Publishers Filter */}
          {publishers.length > 0 && (
            <div className="filter-section">
              <h4>Editura ({publishers.length})</h4>
              <div className="filter-options">
                {publishers.map((publisher) => (
                  <label key={publisher} className="filter-option">
                    <input
                      type="radio"
                      name="publisher"
                      value={publisher}
                      checked={selectedPublisher === publisher}
                      onChange={(e) => setSelectedPublisher(e.target.value)}
                    />
                    <span className="checkmark"></span>
                    {publisher}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Availability Filter */}
          <div className="filter-section">
            <h4>Disponibilitate</h4>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="availability"
                  value="available"
                  checked={availabilityFilter === 'available'}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                />
                <span className="checkmark"></span>
                Disponibile pentru rezervare
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="availability"
                  value="all"
                  checked={availabilityFilter === 'all'}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                />
                <span className="checkmark"></span>
                Toate cărțile
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="books-main-content">
          {/* Sort Controls */}
          <div className="sort-controls">
            <label htmlFor="sort-select">Ordonează după:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-dropdown"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Books Grid */}
          <div className="books-grid-container">
            {filteredBooks.length === 0 ? (
              <div className="no-books-message">
                {showMyBooks ? (
                  <>
                    <p>📚 Nu ai încă cărți favorite!</p>
                    <p>Explorează biblioteca și adaugă cărți la favorite pentru a le vedea aici.</p>
                    <button onClick={() => setShowMyBooks(false)} className="clear-filters-btn">
                      Explorează toate cărțile
                    </button>
                  </>
                ) : (
                  <>
                    <p>Nu au fost găsite cărți cu filtrele selectate.</p>
                    <button onClick={clearFilters} className="clear-filters-btn">
                      Șterge toate filtrele
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="books-grid">
                {filteredBooks.map((book) => {
                  const rating = bookRatings[book.id] || 0;
                  const reviewCount = book.reviewCount || 0;
                  const isNewBook = book.appearanceDate && 
                    new Date(book.appearanceDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
                  const isPopular = rating >= 4.0 && reviewCount >= 5;

                  return (
                    <div 
                      key={book.id} 
                      className="book-card-modern"
                      onClick={() => handleBookClick(book)}
                    >
                      <div className={`book-availability-badge ${!book.exemplaries || book.exemplaries.length === 0 ? 'unavailable' : ''}`}>
                        {book.exemplaries && book.exemplaries.length > 0 ? 'Disponibilă' : 'Indisponibilă'}
                      </div>
                      
                      {showMyBooks && (
                        <div className="book-favorite-badge">
                          ❤️ Favorită
                        </div>
                      )}
                      
                      <div className="book-image-container">
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
                        
                        <div className="book-status-badges">
                          {isNewBook && (
                            <span className="status-badge nou">NOU</span>
                          )}
                          {isPopular && (
                            <span className="status-badge popular">POPULARĂ</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="book-info-container">
                        <h3 className="book-title">{book.title}</h3>
                        <p className="book-author">de {book.author}</p>
                        
                        <div className="book-rating-container">
                          <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span 
                                key={star} 
                                className={`star ${star <= Math.round(rating) ? 'filled' : 'empty'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="rating-count">
                            ({rating > 0 ? `${rating.toFixed(1)} - ${reviewCount} recenzii` : 'Fără recenzii'})
                          </span>
                        </div>
                        
                        <div className="book-library-info">
                          <span className="library-name">
                            📍 {book.library?.name || 'Biblioteca Centrală'}
                          </span>
                          <span className="book-category">{book.category}</span>
                        </div>
                        
                        <div className="book-details-info">
                          <span className="book-pages">📄 {book.nrOfPages} pagini</span>
                          <span className="book-year">📅 {book.appearanceDate ? new Date(book.appearanceDate).getFullYear() : 'N/A'}</span>
                        </div>
                        
                        <button 
                          className="reserve-btn"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleReservation(book); 
                          }}
                          disabled={!book.exemplaries || book.exemplaries.length === 0}
                        >
                          📚 {book.exemplaries && book.exemplaries.length > 0 ? 'Rezervă' : 'Indisponibilă'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>



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

export default AllBooks; 