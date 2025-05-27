import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import './UserProfile.css';
import ReservationsList from '../BookList/ReservationsList';
import { AppContext } from '../../context';

const UserProfile = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const userId = localStorage.getItem('userId');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reservationHistory, setReservationHistory] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [userStats, setUserStats] = useState({
    totalReservations: 0,
    activeReservations: 0,
    favoriteBooks: 0,
    completedReservations: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    favoriteGenre: '',
    readingGoal: 12,
    avatar: null
  });
  
  const { API_BASE_URL } = useContext(AppContext);

  // Fetch user statistics for dashboard
  useEffect(() => {
    if (activeTab === 'dashboard' && userId) {
      fetchUserStatistics();
    }
  }, [activeTab, userId, API_BASE_URL]);

  // Fetch reservation history
  useEffect(() => {
    if (activeTab === 'history' && userId) {
      fetchReservationHistory();
    }
  }, [activeTab, userId, API_BASE_URL]);

  // Fetch favorite books
  useEffect(() => {
    if (activeTab === 'favorites' && userId) {
      fetchFavoriteBooks();
    }
  }, [activeTab, userId, API_BASE_URL]);

  const fetchUserStatistics = async () => {
    setLoading(true);
    try {
      // Fetch various statistics
      const [reservationsRes, favoritesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/reservations/user/${userId}/history`),
        fetch(`${API_BASE_URL}/books/favorites/user/${userId}`)
      ]);

      if (reservationsRes.ok && favoritesRes.ok) {
        const reservations = await reservationsRes.json();
        const favorites = await favoritesRes.json();
        
        const activeReservations = reservations.filter(r => 
          r.status === 'PENDING' || r.status === 'IN_PROGRESS'
        ).length;
        
        const completedReservations = reservations.filter(r => 
          r.status === 'FINISHED'
        ).length;

        setUserStats({
          totalReservations: reservations.length,
          activeReservations,
          favoriteBooks: favorites.length,
          completedReservations
        });
      }
    } catch (err) {
      console.error('Error fetching user statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservationHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/user/${userId}/history`);
      if (!response.ok) {
        throw new Error('Nu s-au putut prelua rezervările istorice');
      }
      const data = await response.json();
      setReservationHistory(data);
    } catch (err) {
      console.error('Error fetching reservation history:', err);
      setError('A apărut o eroare la preluarea istoricului rezervărilor.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoriteBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/books/favorites/user/${userId}`);
      if (!response.ok) {
        throw new Error('Nu s-au putut prelua cărțile favorite');
      }
      const data = await response.json();
      setFavoriteBooks(data);
    } catch (err) {
      console.error('Error fetching favorite books:', err);
      setError('A apărut o eroare la preluarea cărților favorite.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userLibrary');
    navigate('/');
  };

  const getStatusDisplayName = (status) => {
    const statusNames = {
      'PENDING': 'În așteptare',
      'IN_PROGRESS': 'În progres',
      'FINISHED': 'Finalizată',
      'CANCELED': 'Anulată',
      'DELAYED': 'Întârziată'
    };
    return statusNames[status] || status;
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      'PENDING': 'status-pending',
      'IN_PROGRESS': 'status-active',
      'FINISHED': 'status-completed',
      'CANCELED': 'status-canceled',
      'DELAYED': 'status-delayed'
    };
    return statusClasses[status] || 'status-default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('ro-RO');
  };

  const removeFavorite = async (bookId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/deletefromfav/${userId}/${bookId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Nu s-a putut elimina cartea din favorite');
      }
      fetchFavoriteBooks();
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError('A apărut o eroare la eliminarea din favorite.');
    }
  };

  const updateProfile = async (updatedProfile) => {
    try {
      // Here you would typically make an API call to update the user profile
      setUserProfile(updatedProfile);
      alert('Profilul a fost actualizat cu succes!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('A apărut o eroare la actualizarea profilului.');
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">
        <i className={icon}></i>
      </div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{title}</p>
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>
    </div>
  );

  const AchievementBadge = ({ title, description, earned, icon }) => (
    <div className={`achievement-badge ${earned ? 'earned' : 'locked'}`}>
      <div className="badge-icon">
        <i className={icon}></i>
      </div>
      <div className="badge-content">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );

  return (
    <div className="profile-layout">
      {/* Sidebar Navigation */}
      <div className="profile-sidebar">
        {/* User Info Card */}
        <div className="user-info-card">
          <div className="user-avatar">
            <div className="avatar-circle">
              {userProfile.avatar ? (
                <img src={userProfile.avatar} alt="Avatar" />
              ) : (
                <i className="fas fa-user"></i>
              )}
            </div>
            <div className="avatar-status online"></div>
          </div>
          <div className="user-details">
            <h3>Bună, {userProfile.firstName || userEmail?.split('@')[0] || 'Utilizator'}!</h3>
            <p className="user-email">{userEmail}</p>
            <span className="user-status">
              <i className="fas fa-circle"></i>
              Online
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <i className="fas fa-chart-line"></i>
            <span>Dashboard</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'current' ? 'active' : ''}`}
            onClick={() => setActiveTab('current')}
          >
            <i className="fas fa-book-open"></i>
            <span>Rezervări Active</span>
            {userStats.activeReservations > 0 && (
              <span className="nav-badge">{userStats.activeReservations}</span>
            )}
          </button>
          <button 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <i className="fas fa-history"></i>
            <span>Istoric</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <i className="fas fa-heart"></i>
            <span>Favorite</span>
            {userStats.favoriteBooks > 0 && (
              <span className="nav-badge">{userStats.favoriteBooks}</span>
            )}
          </button>
          <button 
            className={`nav-item ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            <i className="fas fa-trophy"></i>
            <span>Realizări</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="fas fa-cog"></i>
            <span>Setări</span>
          </button>
        </nav>

        {/* Quick Actions */}
        <div className="sidebar-actions">
          <button className="quick-action-btn" onClick={() => navigate('/')}>
            <i className="fas fa-search"></i>
            <span>Caută Cărți</span>
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Deconectare</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="profile-main">
        {/* Header */}
        <div className="content-header">
          <div className="header-info">
            <h1>
              {activeTab === 'dashboard' && 'Dashboard Personal'}
              {activeTab === 'current' && 'Rezervări Active'}
              {activeTab === 'history' && 'Istoric Rezervări'}
              {activeTab === 'favorites' && 'Cărți Favorite'}
              {activeTab === 'achievements' && 'Realizări'}
              {activeTab === 'settings' && 'Setări Cont'}
            </h1>
            <p>
              {activeTab === 'dashboard' && 'Privire de ansamblu asupra activității tale'}
              {activeTab === 'current' && 'Cărțile pe care le ai rezervate în prezent'}
              {activeTab === 'history' && 'Toate rezervările tale anterioare'}
              {activeTab === 'favorites' && 'Colecția ta de cărți preferate'}
              {activeTab === 'achievements' && 'Progresul tău în călătoria de lectură'}
              {activeTab === 'settings' && 'Personalizează experiența ta'}
            </p>
          </div>
          <div className="header-stats">
            <div className="mini-stat">
              <span className="mini-stat-value">{userStats.totalReservations}</span>
              <span className="mini-stat-label">Total Rezervări</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-value">{userStats.completedReservations}</span>
              <span className="mini-stat-label">Cărți Citite</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="content-body">
          {error && <div className="error-message">{error}</div>}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-content">
              {/* Statistics Overview */}
              <div className="stats-overview">
                <StatCard
                  title="Total Rezervări"
                  value={userStats.totalReservations}
                  icon="fas fa-book"
                  color="blue"
                  subtitle="De la înregistrare"
                />
                <StatCard
                  title="Rezervări Active"
                  value={userStats.activeReservations}
                  icon="fas fa-clock"
                  color="orange"
                  subtitle="În curs"
                />
                <StatCard
                  title="Cărți Favorite"
                  value={userStats.favoriteBooks}
                  icon="fas fa-heart"
                  color="red"
                  subtitle="Salvate"
                />
                <StatCard
                  title="Cărți Citite"
                  value={userStats.completedReservations}
                  icon="fas fa-check-circle"
                  color="green"
                  subtitle="Finalizate"
                />
              </div>

              {/* Two Column Layout */}
              <div className="dashboard-grid">
                {/* Left Column */}
                <div className="dashboard-left">
                  {/* Reading Progress */}
                  <div className="widget reading-progress-widget">
                    <div className="widget-header">
                      <h3>
                        <i className="fas fa-target"></i>
                        Progresul de Lectură
                      </h3>
                    </div>
                    <div className="widget-content">
                      <div className="progress-summary">
                        <div className="progress-circle">
                          <svg viewBox="0 0 36 36" className="circular-chart">
                            <path className="circle-bg"
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path className="circle"
                              strokeDasharray={`${Math.min((userStats.completedReservations / userProfile.readingGoal) * 100, 100)}, 100`}
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text x="18" y="20.35" className="percentage">
                              {Math.round((userStats.completedReservations / userProfile.readingGoal) * 100)}%
                            </text>
                          </svg>
                        </div>
                        <div className="progress-info">
                          <h4>{userStats.completedReservations} / {userProfile.readingGoal}</h4>
                          <p>Cărți citite anul acesta</p>
                          <span className="progress-status">
                            {userStats.completedReservations >= userProfile.readingGoal 
                              ? '🎉 Obiectiv atins!' 
                              : `Încă ${userProfile.readingGoal - userStats.completedReservations} cărți`
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="widget recent-activity-widget">
                    <div className="widget-header">
                      <h3>
                        <i className="fas fa-clock"></i>
                        Activitate Recentă
                      </h3>
                    </div>
                    <div className="widget-content">
                      <div className="activity-list">
                        <div className="activity-item">
                          <div className="activity-icon blue">
                            <i className="fas fa-book"></i>
                          </div>
                          <div className="activity-content">
                            <p>Ai rezervat o carte nouă</p>
                            <span>Acum 2 ore</span>
                          </div>
                        </div>
                        <div className="activity-item">
                          <div className="activity-icon green">
                            <i className="fas fa-check"></i>
                          </div>
                          <div className="activity-content">
                            <p>Ai finalizat o rezervare</p>
                            <span>Ieri</span>
                          </div>
                        </div>
                        <div className="activity-item">
                          <div className="activity-icon red">
                            <i className="fas fa-heart"></i>
                          </div>
                          <div className="activity-content">
                            <p>Ai adăugat o carte la favorite</p>
                            <span>Acum 3 zile</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="dashboard-right">
                  {/* Quick Actions */}
                  <div className="widget quick-actions-widget">
                    <div className="widget-header">
                      <h3>
                        <i className="fas fa-bolt"></i>
                        Acțiuni Rapide
                      </h3>
                    </div>
                    <div className="widget-content">
                      <div className="quick-actions-grid">
                        <button className="quick-action-card" onClick={() => navigate('/')}>
                          <i className="fas fa-search"></i>
                          <span>Caută Cărți</span>
                        </button>
                        <button className="quick-action-card" onClick={() => setActiveTab('current')}>
                          <i className="fas fa-book-open"></i>
                          <span>Vezi Rezervări</span>
                        </button>
                        <button className="quick-action-card" onClick={() => setActiveTab('favorites')}>
                          <i className="fas fa-heart"></i>
                          <span>Favorite</span>
                        </button>
                        <button className="quick-action-card" onClick={() => setActiveTab('achievements')}>
                          <i className="fas fa-trophy"></i>
                          <span>Realizări</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Reading Recommendations */}
                  <div className="widget recommendations-widget">
                    <div className="widget-header">
                      <h3>
                        <i className="fas fa-lightbulb"></i>
                        Recomandări
                      </h3>
                    </div>
                    <div className="widget-content">
                      <div className="recommendation-item">
                        <div className="recommendation-icon">
                          <i className="fas fa-star"></i>
                        </div>
                        <div className="recommendation-content">
                          <h4>Explorează genuri noi</h4>
                          <p>Încearcă cărți din categoria Science Fiction</p>
                        </div>
                      </div>
                      <div className="recommendation-item">
                        <div className="recommendation-icon">
                          <i className="fas fa-users"></i>
                        </div>
                        <div className="recommendation-content">
                          <h4>Cărți populare</h4>
                          <p>Vezi ce citesc alți utilizatori</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Current Reservations Tab */}
          {activeTab === 'current' && (
            <div className="current-reservations">
              <ReservationsList />
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="achievements-content">
              <div className="achievements-grid">
                <AchievementBadge
                  title="Primul Pas"
                  description="Prima carte rezervată"
                  earned={userStats.totalReservations > 0}
                  icon="fas fa-baby"
                />
                <AchievementBadge
                  title="Cititor Avid"
                  description="10 cărți citite"
                  earned={userStats.completedReservations >= 10}
                  icon="fas fa-book-reader"
                />
                <AchievementBadge
                  title="Colecționar"
                  description="5 cărți favorite"
                  earned={userStats.favoriteBooks >= 5}
                  icon="fas fa-heart"
                />
                <AchievementBadge
                  title="Explorator"
                  description="Cărți din 3 categorii diferite"
                  earned={false}
                  icon="fas fa-compass"
                />
                <AchievementBadge
                  title="Maratonist"
                  description="Obiectiv anual atins"
                  earned={userStats.completedReservations >= userProfile.readingGoal}
                  icon="fas fa-medal"
                />
                <AchievementBadge
                  title="Critic"
                  description="5 recenzii scrise"
                  earned={false}
                  icon="fas fa-star"
                />
              </div>
            </div>
          )}

          {/* Reservation History Tab */}
          {activeTab === 'history' && (
            <div className="reservation-history">
              {loading ? (
                <div className="loading">
                  <i className="fas fa-spinner fa-spin"></i>
                  Se încarcă istoricul...
                </div>
              ) : reservationHistory.length > 0 ? (
                <div className="history-table-container">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Carte</th>
                        <th>Autor</th>
                        <th>Data început</th>
                        <th>Data sfârșit</th>
                        <th>Status</th>
                        <th>Bibliotecă</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservationHistory.map((reservation) => (
                        <tr key={reservation.id}>
                          <td className="book-title">{reservation.exemplary?.book?.title || 'N/A'}</td>
                          <td>{reservation.exemplary?.book?.author || 'N/A'}</td>
                          <td>{formatDate(reservation.startDate)}</td>
                          <td>{formatDate(reservation.endDate)}</td>
                          <td>
                            <span className={`status-badge ${getStatusClass(reservation.reservationStatus || reservation.status)}`}>
                              {getStatusDisplayName(reservation.reservationStatus || reservation.status)}
                            </span>
                          </td>
                          <td>{reservation.exemplary?.book?.library?.name || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="no-data">
                  <i className="fas fa-book-open"></i>
                  <h4>Nu ai încă rezervări în istoric</h4>
                  <p>Rezervările tale finalizate vor apărea aici</p>
                </div>
              )}
            </div>
          )}

          {/* Favorite Books Tab */}
          {activeTab === 'favorites' && (
            <div className="favorites-content">
              {loading ? (
                <div className="loading">
                  <i className="fas fa-spinner fa-spin"></i>
                  Se încarcă favoritele...
                </div>
              ) : favoriteBooks.length > 0 ? (
                <div className="favorites-grid">
                  {favoriteBooks.map((book) => (
                    <div key={book.id} className="favorite-book-card">
                      <div className="book-cover">
                        <img 
                          src={book.coverImageUrl || '/images/cover_not_found.jpg'} 
                          alt={book.title}
                          onError={(e) => { e.target.src = '/images/cover_not_found.jpg'; }}
                        />
                        <div className="book-overlay">
                          <button 
                            className="remove-favorite-btn"
                            onClick={() => removeFavorite(book.id)}
                            title="Elimină din favorite"
                          >
                            <i className="fas fa-heart-broken"></i>
                          </button>
                        </div>
                      </div>
                      <div className="book-details">
                        <h4>{book.title}</h4>
                        <p className="author">{book.author}</p>
                        <p className="category">
                          <i className="fas fa-tag"></i>
                          {book.category || 'Necategorizat'}
                        </p>
                        {book.nrOfPages && (
                          <p className="pages">
                            <i className="fas fa-file-alt"></i>
                            {book.nrOfPages} pagini
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">
                  <i className="fas fa-heart"></i>
                  <h4>Nu ai încă cărți favorite</h4>
                  <p>Adaugă cărți la favorite pentru a le vedea aici</p>
                  <button className="action-btn" onClick={() => navigate('/')}>
                    <i className="fas fa-search"></i>
                    Explorează cărți
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Account Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-content">
              <div className="settings-grid">
                <div className="settings-section">
                  <h4>
                    <i className="fas fa-target"></i>
                    Preferințe de lectură
                  </h4>
                  <div className="setting-item">
                    <label>Obiectiv anual de lectură:</label>
                    <select 
                      value={userProfile.readingGoal} 
                      onChange={(e) => setUserProfile({...userProfile, readingGoal: parseInt(e.target.value)})}
                    >
                      <option value={6}>6 cărți pe an</option>
                      <option value={12}>12 cărți pe an</option>
                      <option value={24}>24 cărți pe an</option>
                      <option value={36}>36 cărți pe an</option>
                      <option value={52}>52 cărți pe an</option>
                    </select>
                  </div>
                  
                  <div className="setting-item">
                    <label>Gen preferat:</label>
                    <select 
                      value={userProfile.favoriteGenre} 
                      onChange={(e) => setUserProfile({...userProfile, favoriteGenre: e.target.value})}
                    >
                      <option value="">Selectează genul</option>
                      <option value="fiction">Ficțiune</option>
                      <option value="non-fiction">Non-ficțiune</option>
                      <option value="mystery">Mister</option>
                      <option value="romance">Romantic</option>
                      <option value="sci-fi">Science Fiction</option>
                      <option value="fantasy">Fantasy</option>
                      <option value="biography">Biografie</option>
                      <option value="history">Istorie</option>
                    </select>
                  </div>
                </div>

                <div className="settings-section">
                  <h4>
                    <i className="fas fa-bell"></i>
                    Notificări
                  </h4>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      <span>Notificări email pentru rezervări</span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      <span>Recomandări de cărți noi</span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" />
                      <span>Newsletter săptămânal</span>
                    </label>
                  </div>
                </div>

                <div className="settings-section">
                  <h4>
                    <i className="fas fa-user-edit"></i>
                    Informații personale
                  </h4>
                  <div className="setting-item">
                    <label>Email:</label>
                    <span className="readonly-field">{userEmail}</span>
                  </div>
                  <div className="setting-item">
                    <label>Prenume:</label>
                    <input 
                      type="text" 
                      value={userProfile.firstName}
                      onChange={(e) => setUserProfile({...userProfile, firstName: e.target.value})}
                      placeholder="Introdu prenumele"
                    />
                  </div>
                  <div className="setting-item">
                    <label>Nume:</label>
                    <input 
                      type="text" 
                      value={userProfile.lastName}
                      onChange={(e) => setUserProfile({...userProfile, lastName: e.target.value})}
                      placeholder="Introdu numele"
                    />
                  </div>
                  <div className="setting-item">
                    <label>Bio:</label>
                    <textarea 
                      value={userProfile.bio}
                      onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                      placeholder="Spune-ne ceva despre tine și pasiunea ta pentru lectură..."
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              <div className="settings-actions">
                <button 
                  className="save-btn"
                  onClick={() => updateProfile(userProfile)}
                >
                  <i className="fas fa-save"></i>
                  Salvează modificările
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 