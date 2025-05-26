import React, { useState, useContext, useEffect } from 'react';
import './BookModification.css';
import { AppContext } from '../../context'; // Import AppContext

// Remove mockBooks and hardcoded categories/libraries as we will fetch them
// const mockBooks = [...];
// const categories = [...];
// const libraries = [...];

const BookModification = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [foundBook, setFoundBook] = useState(null);
  const [form, setForm] = useState({
    id: '',
    isbn: '',
    title: '',
    author: '',
    appearanceDate: '',
    nrOfPages: '',
    category: '', // Will store backend enum string
    language: '',
    library: { id: '', name: '' } // Will store library object with id and name
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [libraries, setLibraries] = useState([]); // New state for libraries
  const { API_BASE_URL } = useContext(AppContext); // Use API_BASE_URL from context

  // Fetch libraries when component mounts
  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/libraries`); // Assuming this endpoint exists
        if (!response.ok) {
          throw new Error('Nu s-au putut prelua bibliotecile.');
        }
        const data = await response.json();
        setLibraries(data); // Assuming backend returns an array of library objects { id, name, ... }
      } catch (err) {
        console.error('Error fetching libraries:', err);
        setError('A apărut o eroare la preluarea bibliotecilor.');
      }
    };

    fetchLibraries();
  }, [API_BASE_URL]); // Fetch libraries only once on mount

  // Căutare carte după ISBN sau titlu
  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFoundBook(null);
    setForm({
      id: '',
      isbn: '',
      title: '',
      author: '',
      appearanceDate: '',
      nrOfPages: '',
      category: '',
      language: '',
      library: { id: '', name: '' }
    });

    if (!searchTerm.trim()) {
        setError('Introduceți un termen de căutare.');
        return;
    }

    try {
        // Căutăm mai întâi după titlu, apoi după autor dacă nu găsim nimic
        let response;
        let data;
        let books = [];

        // Încercăm mai întâi căutarea după titlu
        response = await fetch(`${API_BASE_URL}/books/search?title=${encodeURIComponent(searchTerm.trim())}&author=`);
        if (response.ok) {
          data = await response.json();
          books = data.content || [];
        }

        // Dacă nu găsim nimic după titlu, încercăm după autor
        if (books.length === 0) {
          response = await fetch(`${API_BASE_URL}/books/search?title=&author=${encodeURIComponent(searchTerm.trim())}`);
          if (response.ok) {
            data = await response.json();
            books = data.content || [];
          }
        }

        if (!response.ok) {
            // Assuming non-OK response means no book found or an error
             if (response.status === 404) {
                setError('Nu a fost găsită nicio carte cu acest criteriu.');
             } else {
                 const errorData = await response.json();
                 setError(errorData.message || 'A apărut o eroare la căutare.');
                 console.error('Search error:', errorData);
             }
             return;
        }

        console.log('Backend search response data:', data); // Log the received data

        // Check if we found any books
        if (!books || books.length === 0) {
             setError('Nu a fost găsită nicio carte cu acest criteriu.');
             setFoundBook(null);
             setForm({
                id: '', isbn: '', title: '', author: '', appearanceDate: '', nrOfPages: '', category: '', language: '', library: { id: '', name: '' }
             });
        } else if (books.length >= 1) { // Process the first book found (or only book)
            const bookData = books[0]; // Access the first book from the results
            console.log('Book data extracted from content:', bookData); // Log extracted bookData
            setFoundBook(bookData);
            setForm({
                id: bookData.id == null ? '' : String(bookData.id),
                isbn: bookData.isbn == null ? '' : bookData.isbn,
                title: bookData.title == null ? '' : bookData.title,
                author: bookData.author == null ? '' : bookData.author,
                appearanceDate: bookData.appearanceDate == null ? '' : bookData.appearanceDate,
                nrOfPages: bookData.nrOfPages == null ? '' : String(bookData.nrOfPages),
                category: bookData.category == null ? '' : bookData.category,
                language: bookData.language == null ? '' : bookData.language,
                library: bookData.library == null ? { id: '', name: '' } : { id: bookData.library.id, name: bookData.library.name },
            });
            console.log('Form state after setting:', form); // Log form state

            if (books.length > 1) {
                 setError(`Au fost găsite ${books.length} cărți. Se afișează prima carte.`);
        } else {
                 setError(''); // Clear any previous error if exactly one book is found
            }
        }

    } catch (err) {
        console.error('Fetch error:', err);
        setError('A apărut o eroare la comunicarea cu serverul.');
    }
  };

  // Handler pentru inputuri
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'library') {
        // Find the selected library object from the fetched libraries list
        const selectedLibrary = libraries.find(lib => String(lib.id) === value); // Compare ID as strings
        setForm(prev => ({ ...prev, library: selectedLibrary || { id: '', name: '' } }));
    } else {
    setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Salvare modificări
  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim() || !form.author.trim()) {
      setError('Titlul și autorul sunt obligatorii!');
      return;
    }

    if (!form.id) {
        setError('Nu s-a putut identifica cartea pentru modificare.');
        return;
    }
    
    if (!form.library || !form.library.id) {
        setError('Selectați o bibliotecă validă.');
        return;
    }

    try {
        // Map frontend category string to backend enum value
        // We might need a more robust mapping if frontend strings don't match backend enum names exactly
        const backendCategory = form.category.toUpperCase(); 

        // Prepare the data for the backend
        const updatedBookDTO = {
            id: form.id, 
            isbn: form.isbn,
            title: form.title,
            author: form.author,
            appearanceDate: form.appearanceDate, 
            nrOfPages: parseInt(form.nrOfPages, 10), 
            category: backendCategory, 
            language: form.language,
            coverImageUrl: form.coverImageUrl || null, 
            description: form.description || null, 
            library: form.library, // Send the full library object (with id and name)
        };

        const response = await fetch(`${API_BASE_URL}/books/${form.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBookDTO), 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'A apărut o eroare la salvarea modificărilor.');
        }

        const updatedBookData = await response.json();
        setFoundBook(updatedBookData); 
        // Update form state with the saved data, ensuring library is set as object
        setForm({
            id: updatedBookData.id == null ? '' : String(updatedBookData.id),
            isbn: updatedBookData.isbn == null ? '' : updatedBookData.isbn,
            title: updatedBookData.title == null ? '' : updatedBookData.title,
            author: updatedBookData.author == null ? '' : updatedBookData.author,
            appearanceDate: updatedBookData.appearanceDate == null ? '' : updatedBookData.appearanceDate,
            nrOfPages: updatedBookData.nrOfPages == null ? '' : String(updatedBookData.nrOfPages),
            category: updatedBookData.category == null ? '' : updatedBookData.category,
            language: updatedBookData.language == null ? '' : updatedBookData.language,
            library: updatedBookData.library || { id: '', name: '' }, // Ensure library is an object
        });
        setSuccess('Modificările au fost salvate cu succes!');

    } catch (err) {
        console.error('Save error:', err);
        setError(`A apărut o eroare la salvarea modificărilor: ${err.message}`);
    }
  };

  // Anulare modificări
  const handleCancel = () => {
    setForm({ ...foundBook });
    setError('');
    setSuccess('');
  };

  return (
    <div className="book-modification-container">
      <h2>Modificare cărți</h2>
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Caută după ISBN sau titlu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Caută</button>
      </form>
      {error && <div className="bm-error">{error}</div>}
      {success && <div className="bm-success">{success}</div>}
      {form && (
        <form className="edit-form" onSubmit={handleSave}>
          <div className="bm-row">
            <div className="bm-field">
              <label>ISBN</label>
              <input type="text" name="isbn" value={form.isbn} onChange={handleChange} />
            </div>
            <div className="bm-field">
              <label>Titlu *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required />
            </div>
          </div>
          <div className="bm-row">
            <div className="bm-field">
              <label>Autor *</label>
              <input type="text" name="author" value={form.author} onChange={handleChange} required />
            </div>
            <div className="bm-field">
              <label>Limba</label>
              <input type="text" name="language" value={form.language} onChange={handleChange} />
            </div>
          </div>
          <div className="bm-row">
            <div className="bm-field">
              <label>Data apariției</label>
              <input type="date" name="appearanceDate" value={form.appearanceDate} onChange={handleChange} />
            </div>
            <div className="bm-field">
              <label>Număr pagini</label>
              <input type="number" name="nrOfPages" min="1" value={form.nrOfPages} onChange={handleChange} />
            </div>
          </div>
          <div className="bm-row">
            <div className="bm-field">
              <label>Categorie</label>
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="">Selectați o categorie</option>
                {['LITERATURE', 'SCIENCE', 'HISTORY', 'FANTASY', 'SF', 'MYSTERY', 'THRILLER', 'ROMANCE', 'MYSERY'].map(cat => 
                  <option key={cat} value={cat}>{cat}</option>
                )}
              </select>
            </div>
            <div className="bm-field">
              <label>Bibliotecă</label>
              <select name="library" value={form.library.id} onChange={handleChange}>
                <option value="">Selectați o bibliotecă</option>
                {libraries.map(lib => <option key={lib.id} value={lib.id}>{lib.name}</option>)}
              </select>
            </div>
          </div>
          <div className="bm-actions">
            <button type="submit" className="bm-save">Salvează modificările</button>
            <button type="button" className="bm-cancel" onClick={handleCancel}>Anulează</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookModification; 