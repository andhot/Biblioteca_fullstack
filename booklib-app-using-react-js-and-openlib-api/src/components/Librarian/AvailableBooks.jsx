import React, { useState, useContext, useEffect } from 'react';
import './AvailableBooks.css';
import { AppContext } from '../../context';

const AvailableBooks = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLibrary, setSelectedLibrary] = useState('');
  const [libraries, setLibraries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);

  const { API_BASE_URL } = useContext(AppContext);

  // Categoriile disponibile
  const categories = [
    'LITERATURE', 'SCIENCE', 'HISTORY', 'FANTASY', 'SF', 
    'MYSTERY', 'THRILLER', 'ROMANCE', 'MYSERY'
  ];

  // Maparea categoriilor pentru afișare
  const categoryDisplayNames = {
    'LITERATURE': 'Literatură',
    'SCIENCE': 'Știință',
    'HISTORY': 'Istorie',
    'FANTASY': 'Fantasy',
    'SF': 'Science Fiction',
    'MYSTERY': 'Mister',
    'THRILLER': 'Thriller',
    'ROMANCE': 'Romantic',
    'MYSERY': 'Mysery'
  };

  // Fetch toate cărțile la încărcarea componentei
  useEffect(() => {
    fetchAllBooks();
    fetchLibraries();
  }, [API_BASE_URL]);

  // Filtrare cărți când se schimbă criteriile de căutare
  useEffect(() => {
    filterBooks();
  }, [books, searchTerm, selectedCategory, selectedLibrary]);

  const fetchAllBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/books`);
      if (!response.ok) {
        throw new Error('Nu s-au putut prelua cărțile');
      }
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('A apărut o eroare la preluarea cărților.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLibraries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/libraries`);
      if (!response.ok) {
        throw new Error('Nu s-au putut prelua bibliotecile');
      }
      const data = await response.json();
      setLibraries(data);
    } catch (err) {
      console.error('Error fetching libraries:', err);
    }
  };

  const filterBooks = () => {
    let filtered = books;

    // Filtrare după termenul de căutare (titlu sau autor)
    if (searchTerm.trim()) {
      filtered = filtered.filter(book =>
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrare după categorie
    if (selectedCategory) {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    // Filtrare după bibliotecă
    if (selectedLibrary) {
      filtered = filtered.filter(book => book.library?.id === parseInt(selectedLibrary));
    }

    setFilteredBooks(filtered);
    setCurrentPage(1); // Reset la prima pagină când se filtrează
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLibrary('');
  };

  // Paginare
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('ro-RO');
  };

  if (loading) {
    return (
      <div className="available-books-container">
        <div className="loading">Se încarcă cărțile...</div>
      </div>
    );
  }

  return (
    <div className="available-books-container">
      <h2>Cărți Disponibile</h2>
      
      {error && <div className="error-message">{error}</div>}

      {/* Filtre și căutare */}
      <div className="filters-section">
        <div className="search-filters">
          <div className="filter-group">
            <label>Căutare (Titlu, Autor, ISBN):</label>
            <input
              type="text"
              placeholder="Introduceți termenul de căutare..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label>Categorie:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">Toate categoriile</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {categoryDisplayNames[category] || category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Bibliotecă:</label>
            <select
              value={selectedLibrary}
              onChange={(e) => setSelectedLibrary(e.target.value)}
              className="filter-select"
            >
              <option value="">Toate bibliotecile</option>
              {libraries.map(library => (
                <option key={library.id} value={library.id}>
                  {library.name}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleClearFilters} className="clear-filters-btn">
            Șterge filtrele
          </button>
        </div>

        <div className="results-info">
          <span>
            Afișate {currentBooks.length} din {filteredBooks.length} cărți
            {filteredBooks.length !== books.length && ` (filtrate din ${books.length} total)`}
          </span>
        </div>
      </div>

      {/* Tabelul cu cărți */}
      <div className="books-table-container">
        <table className="books-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Titlu</th>
              <th>Autor</th>
              <th>ISBN</th>
              <th>Categorie</th>
              <th>Limba</th>
              <th>Nr. Pagini</th>
              <th>Data Apariției</th>
              <th>Bibliotecă</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.length > 0 ? (
              currentBooks.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td className="book-title">{book.title || 'N/A'}</td>
                  <td>{book.author || 'N/A'}</td>
                  <td className="book-isbn">{book.isbn || 'N/A'}</td>
                  <td>
                    <span className={`category-badge category-${book.category?.toLowerCase()}`}>
                      {categoryDisplayNames[book.category] || book.category || 'N/A'}
                    </span>
                  </td>
                  <td>{book.language || 'N/A'}</td>
                  <td>{book.nrOfPages || 'N/A'}</td>
                  <td>{formatDate(book.appearanceDate)}</td>
                  <td className="library-name">
                    {book.library?.name || 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-results">
                  Nu au fost găsite cărți cu criteriile selectate.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginare */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Anterior
          </button>

          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`pagination-number ${currentPage === number ? 'active' : ''}`}
              >
                {number}
              </button>
            ))}
          </div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Următor
          </button>
        </div>
      )}
    </div>
  );
};

export default AvailableBooks; 