import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context';
import UserManagement from './UserManagement';
import BookManagement from './BookManagement';
import Statistics from './Statistics';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, API_BASE_URL } = useContext(AppContext);

  useEffect(() => {
    if (!user || user.role !== 'administrator') {
      navigate('/login');
      return;
    }
    fetchTotalUsers();
  }, [user, navigate, API_BASE_URL]);

  const fetchTotalUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/administrators/users`);
      if (response.ok) {
        const users = await response.json();
        setStatistics({ totalUsers: users.length });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="admin-dashboard-main">
      <h1>Dashboard Administrator</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Utilizatori Totali</h3>
          <p className="stat-number">{statistics.totalUsers || 0}</p>
        </div>
        {/*
        <div className="stat-card">
          <h3>Utilizatori Activi</h3>
          <p className="stat-number active">{statistics.activeUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Utilizatori Blocați</h3>
          <p className="stat-number blocked">{statistics.blockedUsers || 0}</p>
        </div>
        */}
      </div>

      <div className="quick-actions">
        <h3>Acțiuni Rapide</h3>
        <div className="action-buttons">
          <button 
            className="action-btn"
            onClick={() => setActiveSection('users')}
          >
            Gestionare Utilizatori
          </button>
          <button 
            className="action-btn"
            onClick={() => setActiveSection('books')}
          >
            Gestionare Cărți
          </button>
          {/*
          <button 
            className="action-btn"
            onClick={() => setActiveSection('statistics')}
          >
            Statistici Detaliate
          </button>
          */}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return <UserManagement />;
      case 'books':
        return <BookManagement />;
      case 'statistics':
        return <Statistics />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-header">
          <h2>Administrator</h2>
          <p>Bun venit, {user?.firstName} {user?.lastName}</p>
        </div>
        
        <nav className="admin-nav">
          <button 
            className={`nav-btn ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-btn ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            Gestionare Utilizatori
          </button>
          <button 
            className={`nav-btn ${activeSection === 'books' ? 'active' : ''}`}
            onClick={() => setActiveSection('books')}
          >
            Gestionare Cărți
          </button>
          {user && user.role === 'administrator' && (
            <button 
              className="nav-btn"
              onClick={() => navigate('/librarian')}
            >
              Dashboard Bibliotecar
            </button>
          )}
          {/*
          <button 
            className={`nav-btn ${activeSection === 'statistics' ? 'active' : ''}`}
            onClick={() => setActiveSection('statistics')}
          >
            Statistici
          </button>
          */}
        </nav>

        <div className="admin-logout">
          <button 
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem('user');
              navigate('/login');
            }}
          >
            Deconectare
          </button>
        </div>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="loading">Se încarcă...</div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 