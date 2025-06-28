import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context';
import './Statistics.css';

const Statistics = () => {
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(false);
  const { API_BASE_URL } = useContext(AppContext);

  useEffect(() => {
    fetchStatistics();
  }, [API_BASE_URL]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/administrators/statistics`);
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-statistics">
      <div className="statistics-header">
        <h1>Statistici Detaliate</h1>
        <p>Vizualizați statisticile complete ale sistemului</p>
      </div>

      {loading ? (
        <div className="loading">Se încarcă statisticile...</div>
      ) : (
        <div className="statistics-grid">
          <div className="stat-card">
            <div className="stat-icon users-icon">👥</div>
            <div className="stat-content">
              <h3>Utilizatori Totali</h3>
              <p className="stat-number">{statistics.totalUsers || 0}</p>
              <p className="stat-description">Numărul total de utilizatori înregistrați</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon active-icon">✅</div>
            <div className="stat-content">
              <h3>Utilizatori Activi</h3>
              <p className="stat-number">{statistics.activeUsers || 0}</p>
              <p className="stat-description">Utilizatori cu conturi active</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blocked-icon">🚫</div>
            <div className="stat-content">
              <h3>Utilizatori Blocați</h3>
              <p className="stat-number">{statistics.blockedUsers || 0}</p>
              <p className="stat-description">Utilizatori cu conturi blocate</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon percentage-icon">📊</div>
            <div className="stat-content">
              <h3>Rata de Activitate</h3>
              <p className="stat-number">
                {statistics.totalUsers > 0 
                  ? Math.round((statistics.activeUsers / statistics.totalUsers) * 100) 
                  : 0}%
              </p>
              <p className="stat-description">Procentul utilizatorilor activi</p>
            </div>
          </div>
        </div>
      )}

      <div className="statistics-summary">
        <h2>Rezumat</h2>
        <div className="summary-content">
          <p>
            <strong>Total utilizatori:</strong> {statistics.totalUsers || 0}
          </p>
          <p>
            <strong>Utilizatori activi:</strong> {statistics.activeUsers || 0} 
            ({statistics.totalUsers > 0 
              ? Math.round((statistics.activeUsers / statistics.totalUsers) * 100) 
              : 0}%)
          </p>
          <p>
            <strong>Utilizatori blocați:</strong> {statistics.blockedUsers || 0}
            ({statistics.totalUsers > 0 
              ? Math.round((statistics.blockedUsers / statistics.totalUsers) * 100) 
              : 0}%)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 