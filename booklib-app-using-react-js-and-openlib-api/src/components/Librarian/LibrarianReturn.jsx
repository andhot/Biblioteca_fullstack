import React, { useState } from 'react';
import './LibrarianReturn.css';

const LibrarianReturn = () => {
  // State pentru căutare și rezultate
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // State pentru lista de returnare
  const [returnList, setReturnList] = useState([]);
  // State pentru mesaje și feedback
  const [message, setMessage] = useState('');

  // Simulăm căutarea cărților din stoc
  const handleSearch = (e) => {
    e.preventDefault();
    // Simulăm rezultate de căutare (stoc)
    const mockStock = [
      {
        id: 1,
        title: 'Crima și pedeapsa',
        author: 'F.M. Dostoievski',
        publisher: 'Humanitas',
        isbn: '978-973-50-1234-5',
        stock: 5
      },
      {
        id: 2,
        title: '1984',
        author: 'George Orwell',
        publisher: 'Polirom',
        isbn: '978-973-46-7890-1',
        stock: 3
      },
      {
        id: 3,
        title: 'Ferma animalelor',
        author: 'George Orwell',
        publisher: 'Polirom',
        isbn: '978-973-46-7891-8',
        stock: 7
      }
    ];
    setSearchResults(mockStock);
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

  // Trimitere returnare
  const sendReturn = () => {
    if (returnList.length === 0) {
      setMessage('Adăugați cel puțin o carte pentru returnare');
      return;
    }
    alert('Cărțile au fost trimise spre returnare!');
    setReturnList([]);
    setMessage('Returnarea a fost procesată cu succes');
  };

  return (
    <div className="librarian-return">
      <h2>Returnare cărți la editură</h2>
      <div className="return-search-section">
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
      <div className="return-search-results">
        {searchResults.map(book => (
          <div key={book.id} className="return-book-card">
            <h3>{book.title}</h3>
            <p>Autor: {book.author}</p>
            <p>Editura: {book.publisher}</p>
            <p>ISBN: {book.isbn}</p>
            <p>În stoc: {book.stock}</p>
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
              <th>Editura</th>
              <th>Exemplare</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {returnList.map(item => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.author}</td>
                <td>{item.publisher}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, e.target.value, item.stock)}
                  />
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