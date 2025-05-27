import React, {useRef, useEffect, useState} from 'react';
import {FaSearch, FaTimes} from "react-icons/fa";
// Eliminăm useNavigate și useGlobalContext
// import { useNavigate } from 'react-router-dom';
// import { useGlobalContext } from '../../context.jsx';
import "./SearchForm.css";

// Componenta primește onSearch, placeholder și initialValue ca props
const SearchForm = ({ onSearch, placeholder = 'Caută după titlu, autor sau ISBN...', initialValue = '' }) => {
  // Eliminăm useGlobalContext
  // const {setSearchTerm, setResultTitle} = useGlobalContext();
  const searchText = useRef('');
  // Eliminăm useNavigate
  // const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    searchText.current.focus();
    if (initialValue) {
      searchText.current.value = initialValue;
      setSearchValue(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempSearchTerm = searchText.current.value.trim();
    
    if (tempSearchTerm.length === 0) {
      // Dacă căutarea este goală, apelăm onSearch cu string gol pentru a afișa toate cărțile
      onSearch('');
      setSearchValue('');
      return;
    }

    setIsSearching(true);
    try {
      // Apelăm funcția onSearch primită ca prop
      await onSearch(tempSearchTerm);
      setSearchValue(tempSearchTerm);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    searchText.current.value = '';
    setSearchValue('');
    onSearch(''); // Afișează toate cărțile
    searchText.current.focus();
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className='search-form'>
      <div className='container'>
        <div className='search-form-content'>
          <form className='search-form' onSubmit={handleSubmit}>
            <div className='search-form-elem flex flex-sb bg-white'>
              <label htmlFor="search-input" className="visually-hidden">Caută carte</label>
              <div className="search-input-container">
                <input 
                  id="search-input" 
                  type="text" 
                  className='form-control' 
                  placeholder={placeholder} 
                  ref={searchText}
                  value={searchValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  disabled={isSearching}
                />
                {searchValue && (
                  <button 
                    type="button" 
                    className="clear-btn"
                    onClick={handleClear}
                    title="Șterge căutarea"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <button 
                type="submit" 
                className='search-btn flex flex-c' 
                onClick={handleSubmit} 
                title="Caută"
                disabled={isSearching}
              >
                <FaSearch className={`search-icon ${isSearching ? 'searching' : ''}`} size={20} />
                {isSearching && <span className="search-text">Caută...</span>}
                {!isSearching && <span className="search-text">Caută</span>}
              </button>
            </div>
          </form>
          
          {/* Search Tips */}
          <div className="search-tips">
            <p>💡 <strong>Sfaturi pentru căutare:</strong> Poți căuta după titlu, autor sau ISBN. Folosește cuvinte cheie pentru rezultate mai bune.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchForm