import React, { useState, useRef, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './ReservationsList.css';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Toate statusurile' },
  { value: 'waiting', label: 'În așteptare' },
  { value: 'in_progress', label: 'În curs' },
  { value: 'completed', label: 'Finalizată' },
  { value: 'canceled', label: 'Anulată' },
];

const MOCK_RESERVATIONS = [
  { id: 1, user: 'user1@email.com', title: 'The Lost World', status: 'waiting', date: '2023-10-01' },
  { id: 2, user: 'user2@email.com', title: 'Harry Potter', status: 'in_progress', date: '2023-10-02' },
  { id: 3, user: 'user3@email.com', title: 'Lord of the Rings', status: 'completed', date: '2023-10-03' },
  { id: 4, user: 'user4@email.com', title: 'Dune', status: 'canceled', date: '2023-10-04' },
  { id: 5, user: 'user5@email.com', title: '1984', status: 'waiting', date: '2023-10-05' },
];

const statusColors = {
  waiting: '#FFA500',
  in_progress: '#A3BFFA',
  completed: '#4CAF50',
  canceled: '#9E9E9E',
};

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

const ReservationsList = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [activeDateFilter, setActiveDateFilter] = useState(false);
  const calendarRef = useRef(null);

  // Închide calendarul la click în afara lui
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCalendar]);

  // Filtrare vizuală
  const filtered = MOCK_RESERVATIONS.filter((r) => {
    // Filtru text
    const matchesSearch =
      r.user.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase());
    // Filtru status
    const matchesStatus = status === 'ALL' ? true : r.status === status;
    // Filtru dată
    let matchesDate = true;
    if (activeDateFilter && dateRange[0] && dateRange[1]) {
      const d = new Date(r.date);
      matchesDate =
        d >= dateRange[0].toDate() && d <= dateRange[1].toDate();
    }
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="librarian-reservations-container">
      <h2 className="librarian-title">Panou Control Bibliotecar</h2>
      <div className="librarian-filters-bar">
        <input
          type="text"
          placeholder="Caută după user sau carte"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="librarian-search-input"
        />
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="librarian-status-select"
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button
          className="librarian-date-btn"
          onClick={() => setShowCalendar(v => !v)}
        >
          Filtrează după dată
        </button>
        {activeDateFilter && (dateRange[0] || dateRange[1]) && (
          <div className="librarian-date-range-display">
            {dateRange[0] && dateRange[1] ? (
              <>Rezervări între <b>{dateRange[0].format('YYYY-MM-DD')}</b> și <b>{dateRange[1].format('YYYY-MM-DD')}</b></>
            ) : dateRange[0] ? (
              <>Rezervări pentru <b>{dateRange[0].format('YYYY-MM-DD')}</b></>
            ) : null}
            <button
              className="librarian-remove-date-filter"
              onClick={() => {
                setActiveDateFilter(false);
                setDateRange([null, null]);
              }}
            >
              Elimină
            </button>
          </div>
        )}
      </div>
      {showCalendar && (
        <div className="librarian-calendar-modal" style={{ zIndex: 10, background: '#181c24', borderRadius: 12, padding: 16, position: 'absolute' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {SHORTCUTS.map(sc => (
                <button
                  key={sc.label}
                  style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}
                  onClick={() => setDateRange(sc.getValue())}
                >
                  {sc.label}
                </button>
              ))}
            </Box>
          </LocalizationProvider>
          <div className="librarian-calendar-actions">
            <button
              className="librarian-calendar-apply"
              onClick={() => {
                setActiveDateFilter(true);
                setShowCalendar(false);
              }}
            >Aplică</button>
            <button
              className="librarian-calendar-cancel"
              onClick={() => setShowCalendar(false)}
            >Anulează</button>
          </div>
        </div>
      )}
      <div className="librarian-table-wrapper">
        <table className="librarian-table">
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
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>
                  Nu există rezervări pentru acest filtru.
                </td>
              </tr>
            )}
            {filtered.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.user}</td>
                <td>{r.title}</td>
                <td>
                  <span
                    style={{
                      background: statusColors[r.status],
                      color: '#fff',
                      borderRadius: 8,
                      padding: '0.2rem 0.7rem',
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    {STATUS_OPTIONS.find(opt => opt.value === r.status)?.label || r.status}
                  </span>
                </td>
                <td>{r.date}</td>
                <td>
                  <button className="librarian-update-btn">Update Status</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationsList; 