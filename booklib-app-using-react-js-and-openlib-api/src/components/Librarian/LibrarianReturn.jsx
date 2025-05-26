import React, { useState } from 'react';
import './LibrarianReturn.css';
import { useGlobalContext } from '../../context';

const LibrarianReturn = () => {
  // State pentru căutare și rezultate
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // State pentru lista de returnare
  const [returnList, setReturnList] = useState([]);
  // State pentru mesaje și feedback
  const [message, setMessage] = useState('');
  // State pentru filtru stoc
  const [stockFilter, setStockFilter] = useState('all');
  const { API_BASE_URL } = useGlobalContext();

  // Opțiuni pentru filtrul de stoc
  const stockOptions = [
    { value: 'low', label: 'Stoc mic (1-5)' },
    { value: 'medium', label: 'Stoc mediu (6-20)' },
    { value: 'high', label: 'Stoc mare (20+)' },
  ];

  // Căutare cărți cu exemplare din stoc
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // Căutăm mai întâi după titlu, apoi după autor dacă nu găsim nimic
      let booksResponse;
      let booksData;
      let books = [];

      // Încercăm mai întâi căutarea după titlu
      booksResponse = await fetch(`${API_BASE_URL}/books/search?title=${encodeURIComponent(searchTerm)}&author=`);
      if (booksResponse.ok) {
        booksData = await booksResponse.json();
        books = booksData.content || [];
      }

      // Dacă nu găsim nimic după titlu, încercăm după autor
      if (books.length === 0) {
        booksResponse = await fetch(`${API_BASE_URL}/books/search?title=&author=${encodeURIComponent(searchTerm)}`);
        if (booksResponse.ok) {
          booksData = await booksResponse.json();
          books = booksData.content || [];
        }
      }

      if (!booksResponse.ok) {
        throw new Error(`Error searching books: ${booksResponse.statusText}`);
      }

      // Pentru fiecare carte, obținem exemplarele
      const booksWithExemplaries = await Promise.all(
        books.map(async (book) => {
          try {
            const exemplariesResponse = await fetch(`${API_BASE_URL}/exemplaries/${book.id}`);
            if (exemplariesResponse.ok) {
              const exemplaries = await exemplariesResponse.json();
              return {
                ...book,
                exemplaries: exemplaries || [],
                stock: exemplaries.length || 0
              };
            }
            return { ...book, exemplaries: [], stock: 0 };
          } catch (error) {
            console.error(`Error fetching exemplaries for book ${book.id}:`, error);
            return { ...book, exemplaries: [], stock: 0 };
          }
        })
      );

      // Filtrăm doar cărțile care au exemplare
      let booksWithStock = booksWithExemplaries.filter(book => book.stock > 0);
      
      // Aplicăm filtrul de stoc
      if (stockFilter !== 'all') {
        booksWithStock = booksWithStock.filter(book => {
          switch (stockFilter) {
            case 'low': return book.stock >= 1 && book.stock <= 5;
            case 'medium': return book.stock >= 6 && book.stock <= 20;
            case 'high': return book.stock > 20;
            default: return true;
          }
        });
      }
      
      setSearchResults(booksWithStock);
      
      if (booksWithStock.length === 0) {
        setMessage('Nu au fost găsite cărți cu exemplare în stoc pentru criteriile specificate.');
      } else {
        setMessage('');
      }
    } catch (error) {
      console.error('Error searching books:', error);
      setSearchResults([]);
      setMessage('Eroare la căutarea cărților.');
    }
  };

  // Adăugare carte în lista de returnare
  const addToReturn = (book) => {
    if (!returnList.some(item => item.id === book.id)) {
      setReturnList([...returnList, { ...book, quantity: 1 }]);
      setMessage('Carte adăugată la returnare');
    } else {
      setMessage('Cartea există deja în lista de returnare');
    }
  };

  // Actualizare cantitate
  const updateQuantity = (id, quantity, max) => {
    let val = parseInt(quantity) || 1;
    if (val > max) val = max;
    if (val < 1) val = 1;
    setReturnList(returnList.map(item => 
      item.id === id ? { ...item, quantity: val } : item
    ));
  };

  // Ștergere carte din returnare
  const removeFromReturn = (id) => {
    setReturnList(returnList.filter(item => item.id !== id));
    setMessage('Carte eliminată din lista de returnare');
  };

  // Trimitere returnare (ștergere exemplare)
  const sendReturn = async () => {
    if (returnList.length === 0) {
      setMessage('Adăugați cel puțin o carte pentru returnare');
      return;
    }

    try {
      for (const book of returnList) {
        // Pentru fiecare carte, ștergem numărul specificat de exemplare
        const exemplariesToDelete = book.exemplaries.slice(0, book.quantity);
        
        for (const exemplary of exemplariesToDelete) {
          const response = await fetch(`${API_BASE_URL}/exemplaries/${exemplary.id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error(`Error deleting exemplary ${exemplary.id}: ${response.statusText}`);
          }
        }
      }

      alert('Exemplarele au fost returnate cu succes!');
      setReturnList([]);
      setSearchResults([]); // Resetăm și rezultatele căutării
      setMessage('Returnarea a fost procesată cu succes');
    } catch (error) {
      console.error('Error processing return:', error);
      setMessage(`Eroare la procesarea returnării: ${error.message}`);
    }
  };

  return (
    <div className="librarian-return">
      <h2>Returnare cărți la editură</h2>
      <div className="return-search-section">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Caută cărți cu exemplare în stoc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              value={stockFilter} 
              onChange={(e) => setStockFilter(e.target.value)}
              className="stock-filter"
            >
              <option value="all">Toate nivelurile de stoc</option>
              {stockOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button type="submit">Caută</button>
          </div>
        </form>
      </div>
      <div className="return-search-results">
        {searchResults.map(book => (
          <div key={book.id} className="return-book-card">
            <h3>{book.title}</h3>
            <p>Autor: {book.author}</p>
            <p>ISBN: {book.isbn}</p>
            <p>Exemplare în stoc: {book.stock}</p>
            <button onClick={() => addToReturn(book)}>Adaugă la returnare</button>
          </div>
        ))}
      </div>
      <div className="return-list">
        <h3>Lista de returnare</h3>
        {message && <p className="return-message">{message}</p>}
        <table>
          <thead>
            <tr>
              <th>Titlu</th>
              <th>Autor</th>
              <th>Exemplare de returnat</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {returnList.map(item => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.author}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, e.target.value, item.stock)}
                  />
                  <span style={{marginLeft: '8px', color: '#666'}}>/ {item.stock}</span>
                </td>
                <td>
                  <button className="remove-btn" onClick={() => removeFromReturn(item.id)}>
                    Șterge
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {returnList.length > 0 && (
          <button className="send-return-btn" onClick={sendReturn}>
            Trimite spre returnare
          </button>
        )}
      </div>
    </div>
  );
};

export default LibrarianReturn; 