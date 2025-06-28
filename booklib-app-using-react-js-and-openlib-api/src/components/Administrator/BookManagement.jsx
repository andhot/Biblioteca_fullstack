import React from 'react';
import BookManagement from '../Librarian/BookManagement';

const AdminBookManagement = () => {
  return (
    <div className="admin-book-management">
      <div className="admin-book-header">
        <h1>Gestionare Cărți</h1>
        <p>Gestionați cărțile din toate bibliotecile</p>
      </div>
      
      <BookManagement />
    </div>
  );
};

export default AdminBookManagement; 