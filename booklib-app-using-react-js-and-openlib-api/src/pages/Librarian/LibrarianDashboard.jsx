import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../context';
import BookModification from '../../components/Librarian/BookModification';
import './LibrarianDashboard.css';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box } from '@mui/material';

const SHORTCUTS = [
  {
    label: 'Azi',
    getValue: () => [dayjs(), dayjs()],
  },
  {
    label: 'Ultima săptămână',
    getValue: () => [dayjs().subtract(6, 'day'), dayjs()],
  },
  {
    label: 'Această lună',
    getValue: () => [dayjs().startOf('month'), dayjs().endOf('month')],
  },
];

const LibrarianDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [dateRange, setDateRange] = useState([null, null]);
  const navigate = useNavigate();
  const { user } = useGlobalContext();

  // Simulăm datele (când legi de backend, înlocuiești cu fetch)
  useEffect(() => {
    const mockReservations = [
      { id: 1, user: 'user1@email.com', book: 'The Lost World', status: 'waiting', date: '2023-10-01' },
      { id: 2, user: 'user2@email.com', book: 'Harry Potter', status: 'in_progress', date: '2023-10-02' },
      { id: 3, user: 'user3@email.com', book: 'Lord of the Rings', status: 'completed', date: '2023-10-03' },
    ];
    setReservations(mockReservations);
    setFilteredReservations(mockReservations);
  }, []);

  // Filtrare rezervări
  useEffect(() => {
    let filtered = reservations;
    if (searchTerm) {
      filtered = filtered.filter(res => 
        res.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.book.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(res => res.status === statusFilter);
    }
    // Filtrare după dată
    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(res => {
        const d = dayjs(res.date);
        return d.isSameOrAfter(dateRange[0], 'day') && d.isSameOrBefore(dateRange[1], 'day');
      });
    } else if (dateRange[0]) {
      filtered = filtered.filter(res => dayjs(res.date).isSame(dateRange[0], 'day'));
    }
    setFilteredReservations(filtered);
  }, [searchTerm, statusFilter, reservations, dateRange]);

  // Update status
  const updateStatus = (id, newStatus) => {
    setReservations(reservations.map(res => 
      res.id === id ? { ...res, status: newStatus } : res
    ));
    setIsModalOpen(false);
  };

  return (
    <div className="librarian-dashboard">
      <h1>Panou Control Bibliotecar</h1>
      {activeSection === 'dashboard' && (
        <div className="dashboard-grid">
          <div className="dashboard-card" onClick={() => navigate('/librarian/orders')}>
            <h3>Comenzi Editură</h3>
            <p>Gestionează comenzile de cărți către edituri</p>
            <button className="dashboard-btn">Accesează</button>
          </div>

          <div className="dashboard-card" onClick={() => setActiveSection('reservations')}>
            <h3>Rezervări</h3>
            <p>Vezi și gestionează rezervările cărților</p>
            <button className="dashboard-btn">Accesează</button>
          </div>

          <div className="dashboard-card">
            <h3>Cărți Disponibile</h3>
            <p>Vezi stocul de cărți disponibile</p>
            <button className="dashboard-btn">Accesează</button>
          </div>

          <div className="dashboard-card">
            <h3>Statistici</h3>
            <p>Vezi statistici despre împrumuturi și rezervări</p>
            <button className="dashboard-btn">Accesează</button>
          </div>

          <div className="dashboard-card" onClick={() => setActiveSection('bookmodification')}>
            <h3>Modificare cărți</h3>
            <p>Caută și editează detaliile unei cărți din bibliotecă</p>
            <button className="dashboard-btn">Accesează</button>
          </div>
        </div>
      )}

      {activeSection === 'reservations' && (
        <div>
          <button className="dashboard-btn" style={{marginBottom: '1rem'}} onClick={() => setActiveSection('dashboard')}>
            Înapoi la dashboard
          </button>
          <div className="filters">
            <input
              type="text"
              placeholder="Caută după user sau carte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Toate statusurile</option>
              <option value="waiting">În așteptare</option>
              <option value="in_progress">În curs</option>
              <option value="completed">Finalizate</option>
            </select>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <DatePicker
                  label="De la"
                  value={dateRange[0]}
                  onChange={newValue => setDateRange([newValue, dateRange[1]])}
                  maxDate={dateRange[1] || dayjs('2025-12-31')}
                  slotProps={{ textField: { size: 'small' } }}
                />
                <DatePicker
                  label="Până la"
                  value={dateRange[1]}
                  onChange={newValue => setDateRange([dateRange[0], newValue])}
                  minDate={dateRange[0] || dayjs('2000-01-01')}
                  maxDate={dayjs('2025-12-31')}
                  slotProps={{ textField: { size: 'small' } }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {SHORTCUTS.map(sc => (
                    <button
                      key={sc.label}
                      style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}
                      onClick={() => setDateRange(sc.getValue())}
                    >
                      {sc.label}
                    </button>
                  ))}
                  {(dateRange[0] || dateRange[1]) && (
                    <button
                      style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}
                      onClick={() => setDateRange([null, null])}
                    >
                      Elimină
                    </button>
                  )}
                </Box>
              </Box>
            </LocalizationProvider>
          </div>
          <table className="reservations-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Carte</th>
                <th>Status</th>
                <th>Data</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map(res => (
                <tr key={res.id}>
                  <td>{res.id}</td>
                  <td>{res.user}</td>
                  <td>{res.book}</td>
                  <td>{res.status}</td>
                  <td>{res.date}</td>
                  <td>
                    <button onClick={() => { setSelectedReservation(res); setIsModalOpen(true); }}>
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isModalOpen && selectedReservation && (
            <div className="modal">
              <div className="modal-content">
                <h3>Update Status pentru {selectedReservation.book}</h3>
                <select
                  value={selectedReservation.status}
                  onChange={(e) => updateStatus(selectedReservation.id, e.target.value)}
                >
                  <option value="waiting">În așteptare</option>
                  <option value="in_progress">În curs</option>
                  <option value="completed">Finalizate</option>
                </select>
                <button onClick={() => setIsModalOpen(false)}>Close</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSection === 'bookmodification' && (
        <div>
          <button className="dashboard-btn" style={{marginBottom: '1rem'}} onClick={() => setActiveSection('dashboard')}>
            Înapoi la dashboard
          </button>
          <BookModification />
        </div>
      )}
    </div>
  );
};

export default LibrarianDashboard; 