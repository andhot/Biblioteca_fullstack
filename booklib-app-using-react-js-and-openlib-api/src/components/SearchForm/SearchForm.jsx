import React, {useRef, useEffect} from 'react';
import {FaSearch} from "react-icons/fa";
// Eliminăm useNavigate și useGlobalContext
// import { useNavigate } from 'react-router-dom';
// import { useGlobalContext } from '../../context.jsx';
import "./SearchForm.css";

// Componenta primește onSearch ca prop
const SearchForm = ({ onSearch }) => {
  // Eliminăm useGlobalContext
  // const {setSearchTerm, setResultTitle} = useGlobalContext();
  const searchText = useRef('');
  // Eliminăm useNavigate
  // const navigate = useNavigate();

  useEffect(() => searchText.current.focus(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    let tempSearchTerm = searchText.current.value.trim();
    // Apelăm funcția onSearch primită ca prop
    onSearch(tempSearchTerm);
    
    // Eliminăm logica veche de setare a termenului de căutare și navigare
    // if((tempSearchTerm.replace(/[^\w\s]/gi,"")).length === 0){
    //   setSearchTerm("the lost world");
    //   setResultTitle("Please Enter Something ...");
    // } else {
    //   setSearchTerm(searchText.current.value);
    // }
    // navigate("/book");
  };

  return (
    <div className='search-form'>
      <div className='container'>
        <div className='search-form-content'>
          <form className='search-form' onSubmit={handleSubmit}>
            <div className='search-form-elem flex flex-sb bg-white'>
              <label htmlFor="search-input" className="visually-hidden">Caută carte</label>
              <input id="search-input" type = "text" className='form-control' placeholder='The Lost World ...' ref = {searchText} />
              <button type = "submit" className='flex flex-c' onClick={handleSubmit} title="Caută">
                <FaSearch className='text-purple' size = {32} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SearchForm