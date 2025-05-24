import React from 'react';
import { useGlobalContext } from '../../context.jsx';
import Book from '../BookList/Book';
import './Favorites.css';

const Favorites = () => {
  const { favorites } = useGlobalContext();

  return (
    <section className='favorites'>
      <div className='container'>
        <div className='section-title'>
          <h2>Favoritele mele</h2>
        </div>
        <div className='favorites-content grid'>
          {favorites.length === 0 ? (
            <div className='no-favorites'>
              <p>Nu ai adăugat nicio carte la favorite încă.</p>
            </div>
          ) : (
            favorites.map((book) => (
              <Book key={book.id} {...book} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Favorites; 