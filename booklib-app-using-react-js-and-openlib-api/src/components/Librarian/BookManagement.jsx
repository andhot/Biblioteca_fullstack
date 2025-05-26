import React, { useState, useContext, useEffect } from 'react';
import './BookManagement.css';
import { AppContext } from '../../context';

const BookManagement = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // State pentru adăugarea cărții
  const [addForm, setAddForm] = useState({
    isbn: '',
    title: '',
    author: '',
    appearanceDate: '',
    nrOfPages: '',
    category: '',
    language: '',
    coverImageUrl: '',
    description: '',
    libraryId: ''
  });

  // State pentru ștergerea cărții
  const [deleteForm, setDeleteForm] = useState({
    searchTerm: '',
    selectedBook: null
  });
  const [searchResults, setSearchResults] = useState([]);

  const { API_BASE_URL } = useContext(AppContext);

  // Categoriile disponibile
  const categories = [
    'LITERATURE', 'SCIENCE', 'HISTORY', 'FANTASY', 'SF', 
    'MYSTERY', 'THRILLER', 'ROMANCE', 'MYSERY'
  ];

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

  // Fetch libraries la încărcarea componentei
  useEffect(() => {
    fetchLibraries();
  }, [API_BASE_URL]);

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
      showMessage('A apărut o eroare la preluarea bibliotecilor.', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  // Handler pentru schimbarea valorilor în formularul de adăugare
  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: value }));
  };

  // Handler pentru adăugarea unei cărți
  const handleAddBook = async (e) => {
    e.preventDefault();
    
    if (!addForm.title.trim() || !addForm.author.trim() || !addForm.libraryId) {
      showMessage('Titlul, autorul și biblioteca sunt obligatorii!', 'error');
      return;
    }

    setLoading(true);
    try {
      const bookData = {
        isbn: addForm.isbn || null,
        title: addForm.title,
        author: addForm.author,
        appearanceDate: addForm.appearanceDate || null,
        nrOfPages: addForm.nrOfPages ? parseInt(addForm.nrOfPages) : null,
        category: addForm.category || null,
        language: addForm.language || null,
        coverImageUrl: addForm.coverImageUrl || null,
        description: addForm.description || null
      };

      const response = await fetch(`${API_BASE_URL}/books/add/${addForm.libraryId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'A apărut o eroare la adăugarea cărții.');
      }

      const createdBook = await response.json();
      showMessage(`Cartea "${createdBook.title}" a fost adăugată cu succes!`, 'success');
      
      // Reset form
      setAddForm({
        isbn: '',
        title: '',
        author: '',
        appearanceDate: '',
        nrOfPages: '',
        category: '',
        language: '',
        coverImageUrl: '',
        description: '',
        libraryId: ''
      });

    } catch (err) {
      console.error('Error adding book:', err);
      showMessage(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handler pentru căutarea cărților pentru ștergere
  const handleSearchBooks = async () => {
    if (!deleteForm.searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      // Căutăm mai întâi după titlu, apoi după autor dacă nu găsim nimic
      let response;
      let data;
      let books = [];

      // Încercăm mai întâi căutarea după titlu
      response = await fetch(`${API_BASE_URL}/books/search?title=${encodeURIComponent(deleteForm.searchTerm)}&author=`);
      if (response.ok) {
        data = await response.json();
        books = data.content || [];
      }

      // Dacă nu găsim nimic după titlu, încercăm după autor
      if (books.length === 0) {
        response = await fetch(`${API_BASE_URL}/books/search?title=&author=${encodeURIComponent(deleteForm.searchTerm)}`);
        if (response.ok) {
          data = await response.json();
          books = data.content || [];
        }
      }

      if (!response.ok) {
        throw new Error('A apărut o eroare la căutarea cărților.');
      }

      setSearchResults(books);
      
      if (books.length === 0) {
        showMessage('Nu au fost găsite cărți cu acest criteriu.', 'error');
      }

    } catch (err) {
      console.error('Error searching books:', err);
      showMessage('A apărut o eroare la căutarea cărților.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handler pentru ștergerea unei cărți
  const handleDeleteBook = async (bookId, bookTitle) => {
    if (!window.confirm(`Sunteți sigur că doriți să ștergeți cartea "${bookTitle}"? Această acțiune nu poate fi anulată.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Cartea nu a fost găsită.');
        }
        throw new Error('A apărut o eroare la ștergerea cărții.');
      }

      showMessage(`Cartea "${bookTitle}" a fost ștearsă cu succes!`, 'success');
      
      // Actualizăm lista de rezultate
      setSearchResults(prev => prev.filter(book => book.id !== bookId));
      
    } catch (err) {
      console.error('Error deleting book:', err);
      showMessage(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-management-container">
      <h2>Gestionare Cărți</h2>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Adaugă Carte
        </button>
        <button 
          className={`tab-btn ${activeTab === 'delete' ? 'active' : ''}`}
          onClick={() => setActiveTab('delete')}
        >
          Șterge Carte
        </button>
      </div>

      {/* Add Book Tab */}
      {activeTab === 'add' && (
        <div className="tab-content">
          <form onSubmit={handleAddBook} className="add-book-form">
            <div className="form-row">
              <div className="form-group">
                <label>Titlu *</label>
                <input
                  type="text"
                  name="title"
                  value={addForm.title}
                  onChange={handleAddFormChange}
                  required
                  placeholder="Introduceți titlul cărții"
                />
              </div>
              <div className="form-group">
                <label>Autor *</label>
                <input
                  type="text"
                  name="author"
                  value={addForm.author}
                  onChange={handleAddFormChange}
                  required
                  placeholder="Introduceți autorul"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  value={addForm.isbn}
                  onChange={handleAddFormChange}
                  placeholder="Introduceți ISBN-ul"
                />
              </div>
              <div className="form-group">
                <label>Limba</label>
                <input
                  type="text"
                  name="language"
                  value={addForm.language}
                  onChange={handleAddFormChange}
                  placeholder="ex: Română, Engleză"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Data Apariției</label>
                <input
                  type="date"
                  name="appearanceDate"
                  value={addForm.appearanceDate}
                  onChange={handleAddFormChange}
                />
              </div>
              <div className="form-group">
                <label>Număr Pagini</label>
                <input
                  type="number"
                  name="nrOfPages"
                  value={addForm.nrOfPages}
                  onChange={handleAddFormChange}
                  min="1"
                  placeholder="ex: 300"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Categorie</label>
                <select
                  name="category"
                  value={addForm.category}
                  onChange={handleAddFormChange}
                >
                  <option value="">Selectați o categorie</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {categoryDisplayNames[category] || category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Bibliotecă *</label>
                <select
                  name="libraryId"
                  value={addForm.libraryId}
                  onChange={handleAddFormChange}
                  required
                >
                  <option value="">Selectați o bibliotecă</option>
                  {libraries.map(library => (
                    <option key={library.id} value={library.id}>
                      {library.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>URL Copertă</label>
              <input
                type="url"
                name="coverImageUrl"
                value={addForm.coverImageUrl}
                onChange={handleAddFormChange}
                placeholder="https://example.com/cover.jpg"
              />
            </div>

            <div className="form-group">
              <label>Descriere</label>
              <textarea
                name="description"
                value={addForm.description}
                onChange={handleAddFormChange}
                rows="4"
                placeholder="Introduceți o descriere a cărții..."
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Se adaugă...' : 'Adaugă Cartea'}
            </button>
          </form>
        </div>
      )}

      {/* Delete Book Tab */}
      {activeTab === 'delete' && (
        <div className="tab-content">
          <div className="search-section">
            <div className="search-form">
              <input
                type="text"
                placeholder="Căutați după titlu sau autor..."
                value={deleteForm.searchTerm}
                onChange={(e) => setDeleteForm(prev => ({ ...prev, searchTerm: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchBooks()}
              />
              <button onClick={handleSearchBooks} disabled={loading}>
                {loading ? 'Caută...' : 'Caută'}
              </button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="search-results">
              <h3>Rezultate căutare ({searchResults.length} cărți găsite)</h3>
              <div className="books-grid">
                {searchResults.map((book) => (
                  <div key={book.id} className="book-card">
                    <div className="book-info">
                      <h4>{book.title}</h4>
                      <p><strong>Autor:</strong> {book.author}</p>
                      <p><strong>ISBN:</strong> {book.isbn || 'N/A'}</p>
                      <p><strong>Categorie:</strong> {categoryDisplayNames[book.category] || book.category || 'N/A'}</p>
                      <p><strong>Bibliotecă:</strong> {book.library?.name || 'N/A'}</p>
                      {book.appearanceDate && (
                        <p><strong>Data apariției:</strong> {new Date(book.appearanceDate).toLocaleDateString('ro-RO')}</p>
                      )}
                    </div>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteBook(book.id, book.title)}
                      disabled={loading}
                    >
                      Șterge Cartea
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookManagement; 