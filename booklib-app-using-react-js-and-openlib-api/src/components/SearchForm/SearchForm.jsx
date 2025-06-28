import React, { useRef, useEffect, useState } from 'react';
import { FaSearch, FaTimes } from "react-icons/fa";
import "./SearchForm.css";

const SearchForm = ({ onSearch, placeholder = 'Caută după titlu, autor sau ISBN...', initialValue = '' }) => {
  const searchText = useRef('');
  const [searchValue, setSearchValue] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (initialValue) {
      searchText.current.value = initialValue;
      setSearchValue(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempSearchTerm = searchText.current.value.trim();
    
    setIsSearching(true);
    try {
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
    onSearch('');
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
    <div className='modern-search-form'>
      <form onSubmit={handleSubmit}>
        <div className='search-input-wrapper'>
          <div className="search-icon-container">
            <FaSearch className={`search-icon ${isSearching ? 'searching' : ''}`} />
          </div>
          
          <input 
            type="text" 
            className='search-input' 
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
              className="clear-button"
              onClick={handleClear}
              title="Șterge căutarea"
            >
              <FaTimes />
            </button>
          )}
          
          <button 
            type="submit" 
            className='search-button' 
            title="Caută"
            disabled={isSearching}
          >
            {isSearching ? 'Se caută...' : 'Caută'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchForm