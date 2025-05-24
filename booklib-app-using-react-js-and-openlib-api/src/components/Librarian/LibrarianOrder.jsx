import React, { useState } from 'react';
import LibrarianReturn from './LibrarianReturn';
import './LibrarianOrder.css';

const LibrarianOrder = () => {
  const [activeTab, setActiveTab] = useState('orders');
  // State pentru căutare și rezultate
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // State pentru lista de comandă
  const [orderList, setOrderList] = useState([]);
  // State pentru mesaje și feedback
  const [message, setMessage] = useState('');

  // Simulăm căutarea cărților
  const handleSearch = (e) => {
    e.preventDefault();
    const mockResults = [
      {
        id: 1,
        title: 'Crima și pedeapsa',
        author: 'F.M. Dostoievski',
        publisher: 'Humanitas',
        isbn: '978-973-50-1234-5'
      },
      {
        id: 2,
        title: '1984',
        author: 'George Orwell',
        publisher: 'Polirom',
        isbn: '978-973-46-7890-1'
      },
      {
        id: 3,
        title: 'Ferma animalelor',
        author: 'George Orwell',
        publisher: 'Polirom',
        isbn: '978-973-46-7891-8'
      }
    ];
    setSearchResults(mockResults);
  };

  // Adăugare carte în lista de comandă
  const addToOrder = (book) => {
    if (!orderList.some(item => item.id === book.id)) {
      setOrderList([...orderList, { ...book, quantity: 1 }]);
      setMessage('Carte adăugată în comandă');
    } else {
      setMessage('Cartea există deja în comandă');
    }
  };

  // Actualizare cantitate
  const updateQuantity = (id, quantity) => {
    setOrderList(orderList.map(item => 
      item.id === id ? { ...item, quantity: parseInt(quantity) || 1 } : item
    ));
  };

  // Ștergere carte din comandă
  const removeFromOrder = (id) => {
    setOrderList(orderList.filter(item => item.id !== id));
    setMessage('Carte eliminată din comandă');
  };

  // Plasare comandă
  const placeOrder = () => {
    if (orderList.length === 0) {
      setMessage('Adăugați cel puțin o carte în comandă');
      return;
    }
    alert('Comanda a fost trimisă cu succes!');
    setOrderList([]);
    setMessage('Comanda a fost plasată cu succes');
  };

  return (
    <div className="librarian-order">
      <div className="order-header">
        <h2>Gestionare Comenzi Editură</h2>
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
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Caută după titlu sau autor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">Caută</button>
              </form>
            </div>

            {/* Rezultatele căutării */}
            <div className="search-results">
              {searchResults.map(book => (
                <div key={book.id} className="book-card">
                  <h3>{book.title}</h3>
                  <p>Autor: {book.author}</p>
                  <p>Editura: {book.publisher}</p>
                  <p>ISBN: {book.isbn}</p>
                  <button onClick={() => addToOrder(book)}>Adaugă la comandă</button>
                </div>
              ))}
            </div>

            {/* Lista de comandă */}
            <div className="order-list">
              <h3>Lista de comandă</h3>
              {message && <p className="message">{message}</p>}
              <table>
                <thead>
                  <tr>
                    <th>Titlu</th>
                    <th>Autor</th>
                    <th>Editura</th>
                    <th>Cantitate</th>
                    <th>Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {orderList.map(item => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>{item.author}</td>
                      <td>{item.publisher}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, e.target.value)}
                        />
                      </td>
                      <td>
                        <button 
                          className="remove-btn"
                          onClick={() => removeFromOrder(item.id)}
                        >
                          Șterge
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {orderList.length > 0 && (
                <button className="place-order-btn" onClick={placeOrder}>
                  Pune comanda
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