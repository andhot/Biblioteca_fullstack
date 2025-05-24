import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// const URL = "http://openlibrary.org/search.json?title="; // This URL is for Open Library search, not needed for backend communication
const AppContext = createContext();

const AppProvider = ({ children }) => {
  // Carti (fetching logic for initial search might still use backend /books or /books/search)
  // Keeping the state for books, loading, etc. for now, but the fetching logic might need review later
  const [searchTerm, setSearchTerm] = useState(""); // Initial search term can be empty
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultTitle, setResultTitle] = useState("");

  // Favorite - Now managed via backend
  const [favorites, setFavorites] = useState([]);

  // Login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // user object should contain id, email, etc.

  // Base URL for backend API
  const API_BASE_URL = 'http://localhost:8081/api';

  // Fetch books from backend (Updated logic)
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      // Use backend endpoint for fetching books
      // Assuming the default endpoint is http://localhost:8081/api/books for all books
      // or http://localhost:8081/api/books/search for search terms.
      // We'll use the search endpoint if searchTerm is present, otherwise fetch all.
      let url = `${API_BASE_URL}/books`;
      if (searchTerm) {
         // Assuming search endpoint is /api/books/search and takes bookAuthor and bookTitle params
         url = `${API_BASE_URL}/books/search?bookAuthor=${encodeURIComponent(searchTerm)}&bookTitle=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Nu s-au putut prelua cărțile');
      }
      const data = await response.json();

      // Backend might return a Page object for search, or a List for findAll
      // Adjust the following line based on your backend's actual response structure for /books and /books/search
      const booksData = data && (searchTerm ? data.content : data); // Assuming search returns { content: [...], ... }, and findAll returns [...] 

      if (booksData) {
         // Adapt the mapping based on BookDTO structure from backend
        const newBooks = booksData.map((bookDto) => ({
            id: bookDto.id,
            author: bookDto.author,
            cover_img: bookDto.coverImageUrl, // Use coverImageUrl from backend
            title: bookDto.title,
            publishYear: bookDto.appearanceDate ? (new Date(bookDto.appearanceDate)).getFullYear() : 'An necunoscut',
            isbn: bookDto.isbn,
            language: bookDto.language,
            category: bookDto.category,
            nrOfPages: bookDto.nrOfPages,
            // Include other fields from BookDTO as needed
        }));
        setBooks(newBooks);
        setResultTitle(newBooks.length > 0 ? (searchTerm ? `Rezultate pentru: "${searchTerm}"` : "Cărți disponibile") : (searchTerm ? `Niciun rezultat pentru: "${searchTerm}"` : "Nu sunt cărți disponibile"));
      } else {
        setBooks([]);
        setResultTitle(searchTerm ? `Niciun rezultat pentru: "${searchTerm}"` : "Nu sunt cărți disponibile");
      }
      setLoading(false);
    } catch (error) {
      console.error('Eroare la preluarea cărților:', error);
      setBooks([]); // Clear books on error
      setLoading(false);
      setResultTitle("Eroare la preluarea cărților");
    }
  }, [searchTerm]); // Dependency on searchTerm

   // New useEffect to fetch books when component mounts or searchTerm changes
   useEffect(() => {
       fetchBooks();
   }, [fetchBooks]); // Dependency on fetchBooks memoized by useCallback


  // Remove localStorage logic for favorites
  // useEffect(() => {
  //   const storedFavorites = localStorage.getItem('favorites');
  //   if (storedFavorites) {
  //     setFavorites(JSON.parse(storedFavorites));
  //   }
  // }, []);
  // useEffect(() => {
  //   localStorage.setItem('favorites', JSON.stringify(favorites));
  // }, [favorites]);

  // Sincronizez login-ul cu localStorage la inițializare - Keep this for now
  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    if (storedLogin === 'true') {
      setIsLoggedIn(true);
      // When user logs in, we should fetch their favorites from backend
      const storedUserEmail = localStorage.getItem('userEmail'); // Assuming email is stored
      const storedUserId = localStorage.getItem('userId');
      const storedUserRole = localStorage.getItem('userRole');
      if (storedUserEmail && storedUserId && storedUserRole) {
          // Need to fetch user details including ID from backend based on email
          // For now, just set user with email, but fetching ID is needed for favorites
          setUser({ email: storedUserEmail, id: storedUserId, role: storedUserRole });
          // TODO: Fetch user details from backend here if needed (e.g., for full profile info)
      } else {
           // If essential info is missing, clear storage and set logged out
           localStorage.removeItem('isLoggedIn');
           localStorage.removeItem('userEmail');
           localStorage.removeItem('userId');
           localStorage.removeItem('userRole');
           setIsLoggedIn(false);
           setUser(null);
      }
    }
  }, []);

    // TODO: Implement fetch user favorites from backend
    const fetchUserFavorites = useCallback(async (userId) => {
        try {
            // Assuming a GET endpoint like /api/users/{userId}/favorites exists
            const response = await fetch(`${API_BASE_URL}/books/favorites/user/${userId}`);
            if (!response.ok) {
                throw new Error('Nu s-au putut prelua favoritele utilizatorului');
            }
            const favoriteBooks = await response.json();
            setFavorites(favoriteBooks.map(bookDto => ({ // Map BookDTOs to frontend book structure
                id: bookDto.id,
                author: bookDto.author,
                cover_img: bookDto.coverImageUrl,
                title: bookDto.title,
                publishYear: bookDto.appearanceDate ? (new Date(bookDto.appearanceDate)).getFullYear() : 'An necunoscut',
                isbn: bookDto.isbn,
                language: bookDto.language,
                category: bookDto.category,
                nrOfPages: bookDto.nrOfPages,
            })));
        } catch (error) {
            console.error('Eroare la preluarea favoritelor:', error);
            setFavorites([]);
        }
    }, []);

    // Call fetchUserFavorites when user object with ID is available and user is logged in
    useEffect(() => {
        if (isLoggedIn && user && user.id && user.role === 'user') { // Only fetch favorites for logged-in users
            fetchUserFavorites(user.id);
        } else {
            setFavorites([]); // Clear favorites if user is not logged in or is a librarian
        }
    }, [isLoggedIn, user, fetchUserFavorites]);


  const addToFavorites = async (book) => {
      if (!isLoggedIn || !user || !user.id || user.role !== 'user') {
          alert("Trebuie să fii autentificat ca utilizator pentru a adăuga la favorite.");
          return;
      }
      try {
          // Assuming a POST endpoint like /api/books/addtofav/{userid}/{bookid}
          const response = await fetch(`${API_BASE_URL}/books/addtofav/${user.id}/${book.id}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  // Add authorization header if needed
              },
              // body: JSON.stringify({}) // POST might require a body, even if empty
          });

          if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Adăugare la favorite eșuată: ${response.status} ${response.statusText} - ${errorText}`);
          }

          // Assuming backend returns the updated list of favorites or a success indicator
          // For simplicity, we'll refetch the favorites list after adding
          fetchUserFavorites(user.id);
          alert("Carte adăugată la favorite!");

      } catch (error) {
          console.error('Eroare la adăugarea la favorite:', error);
          alert(`A apărut o eroare la adăugarea la favorite: ${error.message}`);
      }
  };

  const removeFromFavorites = async (bookId) => {
      if (!isLoggedIn || !user || !user.id || user.role !== 'user') {
          alert("Trebuie să fii autentificat ca utilizator pentru a elimina din favorite.");
          return;
      }
      try {
          // Assuming a DELETE endpoint like /api/books/deletefromfav/{userId}/{bookId}
          const response = await fetch(`${API_BASE_URL}/books/deletefromfav/${user.id}/${bookId}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
                  // Add authorization header if needed
              },
          });

          if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Eliminare din favorite eșuată: ${response.status} ${response.statusText} - ${errorText}`);
          }

          // Refetch the favorites list after removing
           fetchUserFavorites(user.id);
           alert("Carte eliminată din favorite!");

      } catch (error) {
          console.error('Eroare la eliminarea din favorite:', error);
          alert(`A apărut o eroare la eliminarea din favorite: ${error.message}`);
      }
  };

  // isFavorite checks against the local favorites state, which is now synced with backend
  const isFavorite = (bookId) => {
    return favorites.some((book) => book.id === bookId);
  };

  return (
    <AppContext.Provider
      value={{
        books,
        loading,
        setLoading,
        resultTitle,
        setResultTitle,
        searchTerm,
        setSearchTerm,
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        fetchUserFavorites, // Export fetchUserFavorites if needed elsewhere, e.g., after login
        API_BASE_URL // <--- Add API_BASE_URL here
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider }; 