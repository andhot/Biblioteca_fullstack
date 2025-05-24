import React, { useState, useEffect } from "react";
import Book from "../BookList/Book";
import Loading from "../Loader/Loader";
import coverImg from "../../images/cover_not_found.jpg";
import "./BookList.css";
import BookDetailsModal from "./BookDetailsModal";
import ReservationModal from "./ReservationModal";

//https://covers.openlibrary.org/b/id/240727-S.jpg

// Componenta primeste searchTerm ca prop
const BookList = ({ searchTerm }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  // Modificăm titlul rezultatului pentru a reflecta căutarea sau lista completă
  const [resultTitle, setResultTitle] = useState("Cărți din bibliotecă");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showReservation, setShowReservation] = useState(false);
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true); // Setăm loading la true la fiecare căutare/preluare inițială
      try {
        let url = 'http://localhost:8081/api/books';
        // Dacă există un termen de căutare, construim URL-ul pentru search
        if (searchTerm) {
          // Notă: Endpoint-ul de search din backend pare să caute după bookAuthor SAU bookTitle.
          // Aici vom trimite termenul de căutare atât pentru autor, cât și pentru titlu.
          // Dacă vrei o căutare mai specifică (doar după autor sau doar după titlu), trebuie adaptat.
          url = `http://localhost:8081/api/books/search?bookAuthor=${encodeURIComponent(searchTerm)}&bookTitle=${encodeURIComponent(searchTerm)}`;
          setResultTitle(`Rezultatele căutării pentru: "${searchTerm}"`);
        } else {
          // Dacă nu există termen de căutare, preluăm toate cărțile
          setResultTitle("Cărți din bibliotecă");
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Nu s-au putut prelua cărțile');
        }
        const data = await response.json();
        // Backend-ul returnează Page<BookDTO> pentru /search, deci trebuie să accesăm content-ul
        const booksData = searchTerm ? data.content : data; // Adaptăm pentru a lua lista de cărți

        if (booksData && booksData.length > 0) {
          setBooks(booksData);
          if (!searchTerm) setResultTitle("Cărți din bibliotecă"); // Resetăm titlul dacă nu e căutare
        } else {
          setBooks([]);
          setResultTitle(searchTerm ? `Niciun rezultat pentru: "${searchTerm}"` : "Nu sunt cărți disponibile");
        }
        setLoading(false);
      } catch (error) {
        console.error('Eroare la preluarea cărților:', error);
        setBooks([]); // Golește lista la eroare
        setLoading(false);
        setResultTitle(searchTerm ? `Eroare la căutare pentru: "${searchTerm}"` : "Eroare la preluarea cărților");
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
          <p>Nu există cărți de afișat.</p>
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
            {/* Afișăm toate cărțile filtrate, nu doar primele 30 */}
            {filteredBooks.map((item) => {
              return (
                <div
                  key={item.id}
                  className="book-card"
                  onClick={e => {
                    if (
                      e.target.closest('.favorite-btn') ||
                      e.target.classList.contains('favorite-btn') ||
                      e.target.classList.contains('fa-heart')
                    ) return;
                    setSelectedBook(item);
                  }}
                >
                  <Book {...item} />
                  <button
                    className="reserve-btn"
                    onClick={e => { e.stopPropagation(); setSelectedBook(item); setShowReservation(true); }}
                  >Rezervă cartea</button>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      {selectedBook && (
        <BookDetailsModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
      {showReservation && selectedBook && (
        <ReservationModal
          book={selectedBook}
          isOpen={showReservation}
          onRequestClose={() => setShowReservation(false)}
        />
      )}
    </div>
  )
}

export default BookList