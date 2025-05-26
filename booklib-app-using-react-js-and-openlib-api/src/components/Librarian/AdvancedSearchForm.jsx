import React from 'react';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box } from '@mui/material';
import './AdvancedSearchForm.css';

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

const AdvancedSearchForm = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  placeholder = "Caută după titlu sau autor...",
  showStatusFilter = false,
  statusFilter,
  setStatusFilter,
  statusOptions = [],
  showDateFilter = false,
  dateRange,
  setDateRange,
  additionalFilters = null
}) => {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="advanced-search-form">
      <form onSubmit={handleSubmit} className="search-form-container">
        <div className="search-input-container">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Caută
          </button>
        </div>
        
        <div className="filters-container">
          {showStatusFilter && (
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">Toate statusurile</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {showDateFilter && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                      type="button"
                      className="date-shortcut-btn"
                      onClick={() => setDateRange(sc.getValue())}
                    >
                      {sc.label}
                    </button>
                  ))}
                  {(dateRange[0] || dateRange[1]) && (
                    <button
                      type="button"
                      className="clear-date-btn"
                      onClick={() => setDateRange([null, null])}
                    >
                      Elimină
                    </button>
                  )}
                </Box>
              </Box>
            </LocalizationProvider>
          )}

          {additionalFilters}
        </div>
      </form>
    </div>
  );
};

export default AdvancedSearchForm; 