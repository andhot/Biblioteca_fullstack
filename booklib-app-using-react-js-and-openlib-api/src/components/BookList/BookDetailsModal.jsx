import React from "react";
import "./BookDetailsModal.css";
// Dacă vrei recomandări, decomentează linia de mai jos și creează RecommendationList.jsx
// import RecommendationList from "./RecommendationList";

const BookDetailsModal = ({ book, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="modal-header">
          <div className="modal-cover-section">
            <img src={book.cover_img} alt={book.title} className="modal-cover" />
          </div>
          <div className="modal-info-section">
            <h2 className="modal-title">{book.title}</h2>
            <h4 className="modal-author">{book.author_name?.join(", ")}</h4>
            <div className="modal-meta">
              <div><b>Editura:</b> {book.publisher?.[0] || "N/A"}</div>
              <div><b>An:</b> {book.first_publish_year || "N/A"}</div>
              <div><b>Pagini:</b> {book.number_of_pages_median || "N/A"}</div>
              <div><b>ISBN:</b> {book.isbn?.[0] || "N/A"}</div>
              {/* Adaugă alte detalii dacă vrei */}
            </div>
            <button className="reserve-btn">Rezervă cartea</button>
            <div className="modal-stock in-stock">În stoc</div>
          </div>
        </div>
        <div className="modal-description-section">
          <h3>Descriere</h3>
          <p>
            {book.description || "Nu există o descriere disponibilă pentru această carte."}
          </p>
        </div>
        {/* Recomandări (opțional) */}
        {/* <RecommendationList recommendations={book.recommendations || []} /> */}
      </div>
    </div>
  );
};

export default BookDetailsModal;