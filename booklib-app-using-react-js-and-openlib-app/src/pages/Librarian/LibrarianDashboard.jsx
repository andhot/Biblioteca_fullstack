// Add a console log at the very top of the file
console.log('LibrarianDashboard module evaluated');

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

// Define possible reservation statuses based on backend enum (adjust if needed)
const RESERVATION_STATUSES = ['PENDING', 'IN_PROGRESS', 'DELAYED', 'FINISHED', 'CANCELED'];

const LibrarianDashboard = () => {
  // Console log at the beginning of the component
  console.log('LibrarianDashboard component rendered');
  console.log('Initial user state:', useGlobalContext().user);

  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' or one of RESERVATION_STATUSES
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [dateRange, setDateRange] = useState([null, null]);
  const [loadingReservations, setLoadingReservations] = useState(false); // New loading state
  const navigate = useNavigate();
  const { user, API_BASE_URL } = useGlobalContext();

  // Fetch reservations from backend
  useEffect(() => {
    // Console log inside useEffect to see dependencies
    console.log('useEffect for fetching reservations triggered.');
    console.log('user in useEffect:', user);
    console.log('dateRange in useEffect:', dateRange);
    console.log('statusFilter in useEffect:', statusFilter);

    const fetchReservations = async () => {
      // Condition to check for user role (lowercase) and user.id
      if (!user || user.role !== 'librarian' || !user.id) {
          console.log("Fetch condition not met: User is not a librarian or user ID is missing.");
          setReservations([]);
          setFilteredReservations([]);
          return;
      }

      console.log(`Fetching reservations for library ID: ${user.id} with filters...`);

      setLoadingReservations(true);
      const librarianLibraryId = user.id;

      // Construct query parameters
      const queryParams = new URLSearchParams();
      // if (dateRange[0]) {
      //   queryParams.append('startDate', dateRange[0].format('YYYY-MM-DD'));
      // }
      // if (dateRange[1]) {
      //   queryParams.append('endDate', dateRange[1].format('YYYY-MM-DD'));
      // }
      if (statusFilter !== 'all') {
        // Backend expects a list of statuses, so we send it as multiple parameters
        // Or modify backend to accept comma-separated string if preferred
        queryParams.append('reservationStatusList', statusFilter.toUpperCase());
        // If backend expects multiple status parameters with the same name, use this:
        // queryParams.append('reservationStatusList', statusFilter.toUpperCase());
      }
       // Add page and size parameters if needed, assuming default values on backend
       // queryParams.append('page', '0'); // Example
       // queryParams.append('size', '10'); // Example

      try {
        // Using GET and sending filters as query parameters
        const response = await fetch(`${API_BASE_URL}/reservations/library/${librarianLibraryId}?${queryParams.toString()}`, {
          method: 'GET',
          // No headers or body needed for a simple GET request with query params
        });

        if (!response.ok) {
          throw new Error(`Error fetching reservations: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Data received from backend:', data);

         // Assuming backend returns a list of ReservationDTOs
        setReservations(data || []);
        console.log('Reservations state updated:', data || []);

      } catch (error) {
        console.error('Error fetching reservations:', error);
        setReservations([]);
        setFilteredReservations([]); // Also clear filtered reservations on fetch error
      } finally {
          setLoadingReservations(false);
      }
    };

    // Fetch reservations only if user is a librarian and user.id is available
    if (user && user.role === 'librarian' && user.id) {
        fetchReservations();
    } else {
      console.log("Fetch not triggered because user is not a librarian or user ID is missing.");
    }

  }, [user, API_BASE_URL, dateRange, statusFilter]); // Dependencies for refetching

    // Frontend filtering by searchTerm (applied after fetching)
    useEffect(() => {
        console.log('useEffect for frontend filtering triggered.');
        console.log('searchTerm in filtering useEffect:', searchTerm);
        console.log('reservations in filtering useEffect:', reservations);
        console.log('statusFilter in filtering useEffect:', statusFilter);
        console.log('dateRange in filtering useEffect:', dateRange); // Although date filtering is backend, dateRange is a dependency

        let filtered = reservations;
        if (searchTerm) {
             filtered = filtered.filter(res =>
                 (res.user && res.user.email && res.user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                 (res.exemplary && res.exemplary.book && res.exemplary.book.title && res.exemplary.book.title.toLowerCase().includes(searchTerm.toLowerCase()))
             );
         }
         // Combine with status and date filters already applied in fetchReservations's effect
         // Note: This might lead to double filtering if backend adds searchTerm support later
         const backendStatusFilter = statusFilter === 'all' ? null : statusFilter.toUpperCase();
         if (backendStatusFilter) {
             filtered = filtered.filter(res => res.reservationStatus === backendStatusFilter);
         }
         // The date filtering is now primarily done on the backend, 
         // but this useEffect dependency will trigger a refetch when dates change.

        console.log('Filtered reservations for display:', filtered);
        setFilteredReservations(filtered);
    }, [searchTerm, reservations, statusFilter, dateRange]); // Dependencies for filtering



  // Update status
  const updateStatus = async (reservationId, newStatus) => {
     if (!user || !user.id || user.role !== 'librarian') { // Check for lowercase 'librarian' role here too
         alert("Nu aveți permisiunea de a modifica statusul rezervării.");
         setIsModalOpen(false);
         return;
     }

     const librarianId = user.id; // Assuming user.id is the librarianId when role is LIBRARIAN

     try {
         const response = await fetch(`${API_BASE_URL}/reservations/${librarianId}/${reservationId}`, {
             method: 'PUT',
             headers: {
                 'Content-Type': 'application/json',
             },
             // If your backend requires credentials, include them here
             // credentials: 'include',
             body: JSON.stringify({ reservationStatus: newStatus }), // Send new status in the body
         });

         if (!response.ok) {
             const errorText = await response.text();
             let errorMessage = `Eroare la actualizarea statusului rezervării ${reservationId}: ${response.statusText}`;
              try {
                 const errorJson = JSON.parse(errorText);
                  if (errorJson && errorJson.message) {
                      errorMessage = `Eroare la actualizarea statusului rezervării ${errorJson.message}`;
                 } else {
                      errorMessage = `Eroare la actualizarea statusului rezervării ${errorText}`;
                 }
               } catch (parseError) {
                   errorMessage = `Eroare la actualizarea statusului rezervării ${errorText}`;
               }
             throw new Error(errorMessage);
         }

         const updatedReservation = await response.json();

         // Update the reservations list with the updated reservation
         // Instead of mapping and replacing, ideally refetch reservations after update
         // For now, we'll update the specific reservation in the list
         setReservations(reservations.map(res =>
             res.id === reservationId ? updatedReservation : res
         ));

         alert('Status rezervare actualizat cu succes!');
         setIsModalOpen(false);
     } catch (error) {
         console.error('Error updating reservation status:', error);
         alert(`A apărut o eroare la actualizarea statusului rezervării: ${error.message}`);
         setIsModalOpen(false);
     }
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
               {/* Dynamically generate options from RESERVATION_STATUSES */}
              {RESERVATION_STATUSES.map(status => (
                  <option key={status} value={status.toLowerCase()}>{status}</option>
              ))}
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
          {loadingReservations ? (
              <p>Loading Reservations...</p>
          ) : filteredReservations.length === 0 ? (
              <p>No reservations found.</p>
          ) : (
              <table className="reservations-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User Email</th>
                    <th>Book Title</th>
                    <th>Status</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map(res => (
                    <tr key={res.id}>
                      <td>{res.id}</td>
                       {/* Display user email and book title from nested objects */}
                      <td>{res.user ? res.user.email : 'N/A'}</td>
                      <td>{res.exemplary && res.exemplary.book ? res.exemplary.book.title : 'N/A'}</td>
                      <td>{res.reservationStatus}</td>
                      <td>{res.startDate}</td>
                      <td>{res.endDate}</td>
                      <td>
                        <button onClick={() => { setSelectedReservation(res); setIsModalOpen(true); }}>
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           )}
          {isModalOpen && selectedReservation && (
            <div className="modal">
              <div className="modal-content">
                <h3>Update Status pentru Rezervare ID: {selectedReservation.id}</h3>
                <p>Carte: {selectedReservation.exemplary && selectedReservation.exemplary.book ? selectedReservation.exemplary.book.title : 'N/A'}</p>
                <p>User: {selectedReservation.user ? selectedReservation.user.email : 'N/A'}</p>
                <select
                  value={selectedReservation.reservationStatus} // Use reservationStatus from backend data
                  onChange={(e) => updateStatus(selectedReservation.id, e.target.value.toUpperCase())} // Convert to uppercase for backend enum
                >
                   {/* Dynamically generate options from RESERVATION_STATUSES */}
                   {RESERVATION_STATUSES.map(status => (
                       <option key={status} value={status}>{status}</option>
                   ))}
                </select>
                <button onClick={() => setIsModalOpen(false)}>Close</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LibrarianDashboard; 