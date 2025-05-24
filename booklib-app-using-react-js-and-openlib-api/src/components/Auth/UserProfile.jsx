import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import ReservationsList from '../BookList/ReservationsList';

const UserProfile = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>Contul meu</h2>
        <div className="profile-info">
          <p><strong>Email:</strong> {userEmail}</p>
          <p><strong>Statut:</strong> Utilizator</p>
        </div>
        <div className="profile-actions">
          <button onClick={handleLogout} className="logout-btn">Deconectare</button>
        </div>
      </div>
      <ReservationsList />
    </div>
  );
};

export default UserProfile; 