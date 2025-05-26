import React, { useState, useEffect, useRef } from 'react';
import './BookList.css';
import { useGlobalContext } from '../../context.jsx';

const LIBRARIES = [
  'Biblioteca Centrală',
  'Biblioteca Universitară',
  'Biblioteca Municipală'
];

const ReservationModal = ({ book, isOpen, onRequestClose }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [library, setLibrary] = useState(LIBRARIES[0]);
  const modalRef = useRef(null);
  const { user } = useGlobalContext();

  useEffect(() => {
    if (isOpen) {
      setStartDate('');
      setEndDate('');
      setLibrary(LIBRARIES[0]);
    }
  }, [isOpen, book]);

  // Închide la click în afara modalului
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onRequestClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onRequestClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert("Trebuie să fii autentificat pentru a face o rezervare.");
      return;
    }

    const userId = user.id;
    const bookId = book.id;

    const reservationData = {
      startDate: startDate,
      endDate: endDate,
    };

    try {
      const response = await fetch(`/api/reservations/${userId}/${bookId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Rezervare eșuată: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      alert(`Rezervare creată cu succes! ID rezervare: ${result.id}`);
      onRequestClose();
    } catch (error) {
      console.error('Eroare la crearea rezervării:', error);
      alert(`A apărut o eroare la crearea rezervării: ${error.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="reservation-modal-overlay">
      <div className="reservation-modal" ref={modalRef}>
        <h2>Rezervă cartea: {book?.title}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="start-date">Data de început</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
          />
          <label htmlFor="end-date">Data de sfârșit</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            required
            min={startDate}
          />
          <div className="modal-actions">
            <button type="button" className="close-btn" onClick={onRequestClose}>Închide</button>
            <button type="submit" className="confirm-btn">Confirmă rezervarea</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal; 