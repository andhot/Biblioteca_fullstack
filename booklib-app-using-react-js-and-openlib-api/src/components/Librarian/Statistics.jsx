import React, { useState, useContext, useEffect } from 'react';
import './Statistics.css';
import { AppContext } from '../../context';

const Statistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewType, setViewType] = useState('global'); // 'global' or 'library'
  const [selectedLibraryId, setSelectedLibraryId] = useState('');
  const [libraries, setLibraries] = useState([]);

  const { API_BASE_URL, user } = useContext(AppContext);

  useEffect(() => {
    fetchLibraries();
    fetchStatistics();
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchStatistics();
  }, [viewType, selectedLibraryId]);

  const fetchLibraries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/libraries`);
      if (!response.ok) {
        throw new Error('Nu s-au putut prelua bibliotecile');
      }
      const data = await response.json();
      setLibraries(data);
    } catch (err) {
      console.error('Error fetching libraries:', err);
    }
  };

  const fetchStatistics = async () => {
    setLoading(true);
    setError('');
    try {
      let url = `${API_BASE_URL}/statistics/global`;
      
      if (viewType === 'library') {
        if (user && user.library && user.library.id) {
          // Dacă utilizatorul este librarian, folosește biblioteca sa
          url = `${API_BASE_URL}/statistics/library/${user.library.id}`;
        } else if (selectedLibraryId) {
          // Altfel, folosește biblioteca selectată
          url = `${API_BASE_URL}/statistics/library/${selectedLibraryId}`;
        } else {
          setError('Selectați o bibliotecă pentru a vedea statisticile specifice.');
          setLoading(false);
          return;
        }
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Nu s-au putut prelua statisticile');
      }
      const data = await response.json();
      setStatistics(data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('A apărut o eroare la preluarea statisticilor.');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString('ro-RO');
  };

  const getStatusDisplayName = (status) => {
    const statusNames = {
      'PENDING': 'În așteptare',
      'IN_PROGRESS': 'În progres',
      'FINISHED': 'Finalizate',
      'CANCELED': 'Anulate',
      'DELAYED': 'Întârziate'
    };
    return statusNames[status] || status;
  };

  const getCategoryDisplayName = (category) => {
    const categoryNames = {
      'LITERATURE': 'Literatură',
      'SCIENCE': 'Știință',
      'HISTORY': 'Istorie',
      'FANTASY': 'Fantasy',
      'SF': 'Science Fiction',
      'MYSTERY': 'Mister',
      'THRILLER': 'Thriller',
      'ROMANCE': 'Romantic',
      'MYSERY': 'Mysery'
    };
    return categoryNames[category] || category;
  };

  if (loading) {
    return (
      <div className="statistics-container">
        <div className="loading">Se încarcă statisticile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="statistics-container">
      <h2>Statistici Bibliotecă</h2>

      {/* View Type Selector */}
      <div className="view-selector">
        <button 
          className={`view-btn ${viewType === 'global' ? 'active' : ''}`}
          onClick={() => setViewType('global')}
        >
          Statistici Globale
        </button>
        <button 
          className={`view-btn ${viewType === 'library' ? 'active' : ''}`}
          onClick={() => setViewType('library')}
        >
          {user && user.library ? `Biblioteca ${user.library.name}` : 'Statistici pe Bibliotecă'}
        </button>
      </div>

      {/* Library Selector (only for global users) */}
      {viewType === 'library' && (!user || !user.library) && (
        <div className="library-selector">
          <select
            value={selectedLibraryId}
            onChange={(e) => setSelectedLibraryId(e.target.value)}
          >
            <option value="">Selectați o bibliotecă</option>
            {libraries.map(library => (
              <option key={library.id} value={library.id}>
                {library.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {statistics && (
        <>
          {/* Overview Cards */}
          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <h3>{formatNumber(statistics.totalBooks)}</h3>
                <p>Total Cărți</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <h3>{formatNumber(statistics.totalReservations)}</h3>
                <p>Total Rezervări</p>
              </div>
            </div>

            {viewType === 'global' && (
              <>
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <h3>{formatNumber(statistics.totalUsers)}</h3>
                    <p>Total Utilizatori</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🏛️</div>
                  <div className="stat-content">
                    <h3>{formatNumber(statistics.totalLibraries)}</h3>
                    <p>Total Biblioteci</p>
                  </div>
                </div>
              </>
            )}

            <div className="stat-card">
              <div className="stat-icon">📖</div>
              <div className="stat-content">
                <h3>{formatNumber(statistics.totalExemplaries)}</h3>
                <p>Total Exemplare</p>
              </div>
            </div>
          </div>

          {/* Reservation Status Cards */}
          <div className="reservation-stats">
            <h3>Statistici Rezervări</h3>
            <div className="reservation-cards">
              <div className="reservation-card pending">
                <h4>{formatNumber(statistics.pendingReservations)}</h4>
                <p>În așteptare</p>
              </div>
              <div className="reservation-card active">
                <h4>{formatNumber(statistics.activeReservations)}</h4>
                <p>Active</p>
              </div>
              <div className="reservation-card completed">
                <h4>{formatNumber(statistics.completedReservations)}</h4>
                <p>Finalizate</p>
              </div>
              <div className="reservation-card canceled">
                <h4>{formatNumber(statistics.canceledReservations)}</h4>
                <p>Anulate</p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            {/* Books by Category */}
            {statistics.booksByCategory && Object.keys(statistics.booksByCategory).length > 0 && (
              <div className="chart-container">
                <h3>Cărți pe Categorii</h3>
                <div className="category-chart">
                  {Object.entries(statistics.booksByCategory).map(([category, count]) => (
                    <div key={category} className="category-item">
                      <div className="category-bar">
                        <div 
                          className="category-fill"
                          style={{
                            width: `${(count / Math.max(...Object.values(statistics.booksByCategory))) * 100}%`
                          }}
                        ></div>
                      </div>
                      <div className="category-info">
                        <span className="category-name">{getCategoryDisplayName(category)}</span>
                        <span className="category-count">{formatNumber(count)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reservations by Month */}
            {statistics.reservationsByMonth && Object.keys(statistics.reservationsByMonth).length > 0 && (
              <div className="chart-container">
                <h3>Rezervări pe Luni (Ultimele 6 luni)</h3>
                <div className="month-chart">
                  {Object.entries(statistics.reservationsByMonth).map(([month, count]) => (
                    <div key={month} className="month-item">
                      <div className="month-bar">
                        <div 
                          className="month-fill"
                          style={{
                            height: `${(count / Math.max(...Object.values(statistics.reservationsByMonth))) * 100}%`
                          }}
                        ></div>
                      </div>
                      <div className="month-info">
                        <span className="month-name">{month}</span>
                        <span className="month-count">{formatNumber(count)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Libraries (only for global view) */}
            {viewType === 'global' && statistics.topLibrariesByBooks && Object.keys(statistics.topLibrariesByBooks).length > 0 && (
              <div className="chart-container">
                <h3>Top Biblioteci (după numărul de cărți)</h3>
                <div className="library-chart">
                  {Object.entries(statistics.topLibrariesByBooks).slice(0, 5).map(([library, count]) => (
                    <div key={library} className="library-item">
                      <div className="library-bar">
                        <div 
                          className="library-fill"
                          style={{
                            width: `${(count / Math.max(...Object.values(statistics.topLibrariesByBooks))) * 100}%`
                          }}
                        ></div>
                      </div>
                      <div className="library-info">
                        <span className="library-name">{library}</span>
                        <span className="library-count">{formatNumber(count)} cărți</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Stats */}
          <div className="additional-stats">
            <div className="stat-item">
              <h4>Durata Medie Rezervare</h4>
              <p>{statistics.averageReservationDuration ? `${statistics.averageReservationDuration.toFixed(1)} zile` : 'N/A'}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics; 