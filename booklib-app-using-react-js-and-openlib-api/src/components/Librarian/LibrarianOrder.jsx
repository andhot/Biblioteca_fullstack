import React, { useState } from 'react';
import LibrarianReturn from './LibrarianReturn';
import './LibrarianOrder.css';
import { useGlobalContext } from '../../context';

const LibrarianOrder = () => {
  const [activeTab, setActiveTab] = useState('orders');
  // State pentru căutare și rezultate
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // State pentru lista de comandă (will be for adding exemplaries)
  const [exemplaryAddList, setExemplaryAddList] = useState([]);
  // State pentru mesaje și feedback
  const [message, setMessage] = useState('');
  // State pentru filtre
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { API_BASE_URL } = useGlobalContext();

  // Opțiuni pentru filtrul de categorie (din backend)
  const categoryOptions = [
    { value: 'LITERATURE', label: 'Literatură' },
    { value: 'SCIENCE', label: 'Știință' },
    { value: 'HISTORY', label: 'Istorie' },
    { value: 'FANTASY', label: 'Fantasy' },
    { value: 'SF', label: 'Science Fiction' },
    { value: 'MYSTERY', label: 'Mister' },
    { value: 'THRILLER', label: 'Thriller' },
    { value: 'ROMANCE', label: 'Romantic' },
    { value: 'MYSERY', label: 'Mysery' },
  ];

  // Handle book search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // Căutăm mai întâi după titlu, apoi după autor dacă nu găsim nimic
      let response;
      let data;
      let results = [];

      // Încercăm mai întâi căutarea după titlu
      response = await fetch(`${API_BASE_URL}/books/search?title=${encodeURIComponent(searchTerm)}&author=`);
      if (response.ok) {
        data = await response.json();
        results = data.content || [];
      }

      // Dacă nu găsim nimic după titlu, încercăm după autor
      if (results.length === 0) {
        response = await fetch(`${API_BASE_URL}/books/search?title=&author=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
          data = await response.json();
          results = data.content || [];
        }
      }

      if (!response.ok) {
        throw new Error(`Error searching books: ${response.statusText}`);
      }
      
      // Aplicăm filtrul de categorie
      let filteredResults = results;
      
      // Filtru categorie
      if (categoryFilter !== 'all') {
        filteredResults = filteredResults.filter(book => 
          book.category === categoryFilter
        );
      }
      
      setSearchResults(filteredResults); 
      setMessage(filteredResults.length === 0 ? 'Nu au fost găsite cărți cu criteriile specificate.' : '');
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
      setMessage('Eroare la căutarea cărților.');
    }
  };

  // Add book to the list for adding exemplaries
  const addToExemplaryAddList = (book) => {
    if (!exemplaryAddList.some(item => item.id === book.id)) {
      // Add maxBorrowDays and publisher with default values
      setExemplaryAddList([...exemplaryAddList, { ...book, quantity: 1, maxBorrowDays: 14, publisher: 'Editura Necunoscută' }]);
      setMessage('Carte adăugată în lista pentru exemplare');
    } else {
      setMessage('Cartea există deja în lista pentru exemplare');
    }
  };

  // Update quantity for adding exemplaries
  const updateAddQuantity = (id, quantity) => {
    setExemplaryAddList(exemplaryAddList.map(item => 
      item.id === id ? { ...item, quantity: parseInt(quantity) || 1 } : item
    ));
  };

  // Update maxBorrowDays for adding exemplaries
  const updateMaxBorrowDays = (id, maxBorrowDays) => {
    setExemplaryAddList(exemplaryAddList.map(item => 
      item.id === id ? { ...item, maxBorrowDays: parseInt(maxBorrowDays) || 14 } : item
    ));
  };

  // Update publisher for adding exemplaries
  const updatePublisher = (id, publisher) => {
    setExemplaryAddList(exemplaryAddList.map(item => 
      item.id === id ? { ...item, publisher: publisher || 'Editura Necunoscută' } : item
    ));
  };

  // Remove book from the list for adding exemplaries
  const removeFromExemplaryAddList = (id) => {
    setExemplaryAddList(exemplaryAddList.filter(item => item.id !== id));
    setMessage('Carte eliminată din lista pentru exemplare');
  };

  // Handle adding exemplaries
  const handleAddExemplaries = async () => {
    if (exemplaryAddList.length === 0) {
      setMessage('Adăugați cel puțin o carte pentru a adăuga exemplare');
      return;
    }

    try {
      for (const book of exemplaryAddList) {
        // Prepare the request body with publisher and maxBorrowDays
        const exemplaryDTO = {
          publisher: book.publisher, // Assuming publisher is available from search results
          maxBorrowDays: book.maxBorrowDays, // Use the value from state
        };

        const response = await fetch(`${API_BASE_URL}/exemplaries/${book.id}/${book.quantity}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // If your backend requires credentials, include them here
          // credentials: 'include',
          body: JSON.stringify(exemplaryDTO), 
        });

        if (!response.ok) {
          // Attempt to read the error response body for more details
          const errorText = await response.text();
          let errorMessage = `Error adding exemplaries for ${book.title}: ${response.statusText}`;
          try {
            const errorJson = JSON.parse(errorText);
             if (errorJson && errorJson.message) {
                 errorMessage = `Error adding exemplaries for ${book.title}: ${errorJson.message}`;
            } else {
                errorMessage = `Error adding exemplaries for ${book.title}: ${errorText}`;
            }
          } catch (parseError) {
              errorMessage = `Error adding exemplaries for ${book.title}: ${errorText}`;
          }
          
          throw new Error(errorMessage);
        }
        // Optionally handle successful response for each book
        console.log(`Exemplaries added for ${book.title}`);
      }

      alert('Exemplare adăugate cu succes!');
      setExemplaryAddList([]); // Clear the list after successful addition
      setMessage('Exemplare adăugate cu succes');
    } catch (error) {
      console.error('Error adding exemplaries:', error);
      setMessage(`Eroare la adăugarea exemplarelor: ${error.message}`);
    }
  };

  return (
    <div className="librarian-order">
      <div className="order-header">
        <h2>Gestionare Exemplare Cărți</h2>
        <div className="tabs">
          <button 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            Comenzi editură
          </button>
          <button 
            className={activeTab === 'return' ? 'active' : ''}
            onClick={() => setActiveTab('return')}
          >
            Returnare cărți la editură
          </button>
        </div>
      </div>

      <div className="order-content">
        {activeTab === 'orders' && (
          <>
            {/* Secțiunea de căutare */}
            <div className="search-section">
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                <div className="search-input-container">
                  <input
                    type="text"
                    placeholder="Caută după titlu sau autor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select 
                    value={categoryFilter} 
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="category-filter"
                  >
                    <option value="all">Toate categoriile</option>
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button type="submit">Caută</button>
                </div>
              </form>
            </div>

            {/* Rezultatele căutării */}
            <div className="search-results">
              {searchResults.map(book => (
                <div key={book.id} className="book-card">
                  <h3>{book.title}</h3>
                  <p>Autor: {book.author}</p>
                  <p>ISBN: {book.isbn}</p>
                  <button onClick={() => addToExemplaryAddList(book)}>Adaugă pentru exemplare</button>
                </div>
              ))}
            </div>

            {/* Lista pentru adăugarea exemplarelor */}
            <div className="order-list">
              <h3>Cărți pentru adăugare exemplare</h3>
              {message && <p className="message">{message}</p>}
              <table>
                <thead>
                  <tr>
                    <th>Titlu</th>
                    <th>Autor</th>
                    <th>Editura Exemplar</th>
                    <th>Număr exemplare de adăugat</th>
                    <th>Maxim zile împrumut</th>
                    <th>Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {exemplaryAddList.map(item => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>{item.author}</td>
                      <td>
                        <input
                          type="text"
                          value={item.publisher}
                          onChange={(e) => updatePublisher(item.id, e.target.value)}
                          placeholder="Editura exemplar"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateAddQuantity(item.id, e.target.value)}
                        />
                      </td>
                       <td>
                        <input
                          type="number"
                          min="1"
                          value={item.maxBorrowDays}
                          onChange={(e) => updateMaxBorrowDays(item.id, e.target.value)}
                        />
                      </td>
                      <td>
                        <button 
                          className="remove-btn"
                          onClick={() => removeFromExemplaryAddList(item.id)}
                        >
                          Șterge
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {exemplaryAddList.length > 0 && (
                <button className="place-order-btn" onClick={handleAddExemplaries}>
                  Adaugă Exemplare
                </button>
              )}
            </div>
          </>
        )}
        {activeTab === 'return' && <LibrarianReturn />}
      </div>

      <footer className="order-footer">
        <p>© 2024 Biblioteca Digitală. Toate drepturile rezervate.</p>
        <p>Contact: biblioteca@example.com | Tel: 021-123-4567</p>
      </footer>
    </div>
  );
};

export default LibrarianOrder; 