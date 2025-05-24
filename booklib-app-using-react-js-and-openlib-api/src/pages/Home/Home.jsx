import React, { useState } from 'react';
import SearchForm from '../../components/SearchForm/SearchForm';
import BookList from '../../components/BookList/BookList';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <SearchForm onSearch={setSearchTerm} />
      <BookList searchTerm={searchTerm} />
    </>
  );
};

export default Home;
