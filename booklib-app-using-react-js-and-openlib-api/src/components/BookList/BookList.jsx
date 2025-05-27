import React, { useState, useEffect } from "react";
import Book from "../BookList/Book";
import Loading from "../Loader/Loader";
import coverImg from "../../images/cover_not_found.jpg";
import "./BookList.css";
import ReservationModal from "./ReservationModal";

//https://covers.openlibrary.org/b/id/240727-S.jpg

// Componenta primeste searchTerm ca prop
const BookList = ({ searchTerm }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  // Modificăm titlul rezultatului pentru a reflecta căutarea sau lista completă
  const [resultTitle, setResultTitle] = useState("Cărți din bibliotecă");
  const [showReservation, setShowReservation] = useState(false);
  const [selectedBookForReservation, setSelectedBookForReservation] = useState(null);
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:8081/api/books';
        
        // Dacă există un termen de căutare, folosim endpoint-ul de search-by-term
        if (searchTerm && searchTerm.trim() !== '') {
          url = `http://localhost:8081/api/books/search-by-term?term=${encodeURIComponent(searchTerm.trim())}`;
          setResultTitle(`Rezultatele căutării pentru: "${searchTerm}"`);
        } else {
          // Dacă nu există termen de căutare, preluăm toate cărțile
          setResultTitle("Toate cărțile din bibliotecă");
        }

        console.log('Fetching books from:', url);
        const response = await fetch(url);
        
        if (!response.ok) {
          if (response.status === 404) {
            // Dacă nu găsește rezultate, setăm o listă goală
            setBooks([]);
            setResultTitle(searchTerm ? `Niciun rezultat pentru: "${searchTerm}"` : "Nu sunt cărți disponibile");
            setLoading(false);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        // Pentru search-by-term, backend-ul returnează direct o listă
        // Pentru endpoint-ul normal, returnează o listă
        const booksData = Array.isArray(data) ? data : (data.content || []);

        if (booksData && booksData.length > 0) {
          setBooks(booksData);
          if (searchTerm) {
            setResultTitle(`Găsite ${booksData.length} rezultate pentru: "${searchTerm}"`);
          } else {
            setResultTitle(`Toate cărțile din bibliotecă (${booksData.length} cărți)`);
          }
        } else {
          setBooks([]);
          setResultTitle(searchTerm ? `Niciun rezultat pentru: "${searchTerm}"` : "Nu sunt cărți disponibile");
        }
        
      } catch (error) {
        console.error('Eroare la preluarea cărților:', error);
        setBooks([]);
        setResultTitle(searchTerm ? `Eroare la căutare pentru: "${searchTerm}"` : "Eroare la preluarea cărților");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchTerm]); // Dependența de searchTerm face ca useEffect să ruleze la fiecare schimbare

  const booksWithCovers = books.map((singleBook) => {
    return {
      ...singleBook,
      id: singleBook.id,
      cover_img: singleBook.coverImageUrl && singleBook.coverImageUrl.trim() !== '' ? singleBook.coverImageUrl : coverImg,
      title: singleBook.title || 'Titlu indisponibil',
      author: singleBook.author || 'Autor necunoscut',
      publishYear: singleBook.appearanceDate 
        ? (new Date(singleBook.appearanceDate)).getFullYear() 
        : 'An necunoscut',
      edition_count: singleBook.nrOfPages || 1,
      isbn: singleBook.isbn || 'ISBN indisponibil',
      language: singleBook.language || 'Limba necunoscută',
      category: singleBook.category || 'Categorie necunoscută'
    }
  });

  // Păstrăm filtrarea pe roluri, aplicată pe rezultatele de la backend
  const filteredBooks = booksWithCovers.filter(book => {
    if (selectedRole === 'all') return true;
    if (selectedRole === 'student' && book.edition_count > 5) return true; // Folosim nrOfPages pentru edition_count
    if (selectedRole === 'professor' && book.edition_count <= 5) return true; // Folosim nrOfPages pentru edition_count
    return false;
  });

  // Modificăm mesajul de loading/eroare pentru a fi mai informativ
  if(loading) return <Loading />;

  // Afișăm un mesaj dacă nu sunt cărți de afișat (nici la încărcare, nici la căutare)
  if (!loading && filteredBooks.length === 0) {
    return (
      <section className='booklist'>
        <div className='container'>
          <div className='section-title'>
            <h2>{resultTitle}</h2>
             <div className="role-filter">
              <select 
                value={selectedRole} 
                onChange={(e) => setSelectedRole(e.target.value)}
                className="role-select"
              >
                <option value="all">Toate cărțile</option>
                <option value="student">Cărți pentru studenți</option>
                <option value="professor">Cărți pentru profesori</option>
              </select>
            </div>
          </div>
          <div className="no-results">
            <div className="no-results-icon">📚</div>
            <p>Nu există cărți de afișat.</p>
            {searchTerm && (
              <div className="search-suggestions">
                <p>Sugestii pentru căutare:</p>
                <ul>
                  <li>Verifică ortografia cuvintelor</li>
                  <li>Încearcă termeni mai generali</li>
                  <li>Caută după autor sau titlu</li>
                  <li>Încearcă să cauți după ISBN</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div>
      <section className='booklist'>
        <div className='container'>
          <div className='section-title'>
            <h2>{resultTitle}</h2>
            <div className="role-filter">
              <select 
                value={selectedRole} 
                onChange={(e) => setSelectedRole(e.target.value)}
                className="role-select"
              >
                <option value="all">Toate cărțile</option>
                <option value="student">Cărți pentru studenți</option>
                <option value="professor">Cărți pentru profesori</option>
              </select>
            </div>
          </div>
          <div className='booklist-content grid'>
            {/* Afișăm toate cărțile filtrate */}
            {filteredBooks.map((item) => {
              return (
                <div key={item.id} className="book-card">
                  <Book {...item} />
                  <button
                    className="reserve-btn"
                    onClick={e => { 
                      e.stopPropagation(); 
                      setSelectedBookForReservation(item); 
                      setShowReservation(true); 
                    }}
                  >Rezervă cartea</button>
                </div>
              )
            })}
          </div>
        </div>
      </section>
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
  )
}

export default BookList