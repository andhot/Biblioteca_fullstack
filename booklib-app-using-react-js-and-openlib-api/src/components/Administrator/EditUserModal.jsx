import React, { useState, useEffect } from 'react';
import './EditUserModal.css';

const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    yearOfBirth: '',
    country: '',
    gender: 'MALE',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Populate form when user data is available
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        yearOfBirth: user.yearOfBirth || '',
        country: user.country || '',
        gender: user.gender || 'MALE',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Construct the payload, ensuring yearOfBirth is a number
    const payload = {
      ...formData,
      yearOfBirth: Number(formData.yearOfBirth) || null,
    };
    await onSave(user.id, payload);
    setLoading(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editează Utilizator</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Prenume</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Nume</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Număr de telefon</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="yearOfBirth">An naștere</label>
              <input
                type="number"
                id="yearOfBirth"
                name="yearOfBirth"
                value={formData.yearOfBirth}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="country">Țară</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="gender">Gen</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="MALE">Masculin</option>
              <option value="FEMALE">Feminin</option>
              <option value="OTHER">Altul</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Anulează
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Se salvează...' : 'Salvează Modificările'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal; 