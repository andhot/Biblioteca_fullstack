import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context';
import './UserManagement.css';
import EditUserModal from './EditUserModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { API_BASE_URL } = useContext(AppContext);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [API_BASE_URL]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/administrators/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        throw new Error('Eroare la încărcarea utilizatorilor');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showMessage('Eroare la încărcarea utilizatorilor', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedUser(null);
    setIsEditModalOpen(false);
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/administrators/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        showMessage('Utilizator actualizat cu succes!', 'success');
        handleCloseEditModal();
        fetchUsers();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Eroare la actualizarea utilizatorului');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      showMessage(error.message, 'error');
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/administrators/users/${userId}/block`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        showMessage('Utilizator blocat cu succes!', 'success');
        fetchUsers();
      } else {
        throw new Error('Eroare la blocarea utilizatorului');
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      showMessage('Eroare la blocarea utilizatorului', 'error');
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/administrators/users/${userId}/unblock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        showMessage('Utilizator deblocat cu succes!', 'success');
        fetchUsers();
      } else {
        throw new Error('Eroare la deblocarea utilizatorului');
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      showMessage('Eroare la deblocarea utilizatorului', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Sigur doriți să ștergeți acest utilizator? Această acțiune nu poate fi anulată.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/administrators/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showMessage('Utilizator șters cu succes!', 'success');
        fetchUsers();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Eroare la ștergerea utilizatorului');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showMessage(error.message, 'error');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && user.isVerified) ||
      (filterStatus === 'blocked' && !user.isVerified);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h1>Gestionare Utilizatori</h1>
        <p>Gestionați utilizatorii sistemului</p>
      </div>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Căutați după nume sau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="status-filter">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toți utilizatorii</option>
            <option value="active">Utilizatori activi</option>
            <option value="blocked">Utilizatori blocați</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Se încarcă utilizatorii...</div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Nume</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Țară</th>
                <th>Status</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-name">
                      <strong>{user.firstName} {user.lastName}</strong>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber || '-'}</td>
                  <td>{user.country || '-'}</td>
                  <td>
                    {/* <span className={`status-badge ${user.isVerified ? 'active' : 'blocked'}`}>
                      {user.isVerified ? 'Activ' : 'Blocat'}
                    </span> */}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {/* {user.isVerified ? (
                        <button
                          className="btn btn-warning"
                          onClick={() => handleBlockUser(user.id)}
                          title="Blochează utilizatorul"
                        >
                          Blochează
                        </button>
                      ) : (
                        <button
                          className="btn btn-success"
                          onClick={() => handleUnblockUser(user.id)}
                          title="Deblochează utilizatorul"
                        >
                          Deblochează
                        </button>
                      )} */}
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleOpenEditModal(user)}
                        title="Editează utilizatorul"
                      >
                        Editează
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Șterge utilizatorul"
                      >
                        Șterge
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="no-users">
              <p>Nu s-au găsit utilizatori care să corespundă criteriilor.</p>
            </div>
          )}
        </div>
      )}

      {isEditModalOpen && (
        <EditUserModal
          user={selectedUser}
          onClose={handleCloseEditModal}
          onSave={handleUpdateUser}
        />
      )}

      <div className="users-summary">
        <p>Total utilizatori: <strong>{users.length}</strong></p>
        <p>Utilizatori activi: <strong>{users.filter(u => u.isVerified).length}</strong></p>
        <p>Utilizatori blocați: <strong>{users.filter(u => !u.isVerified).length}</strong></p>
      </div>
    </div>
  );
};

export default UserManagement; 