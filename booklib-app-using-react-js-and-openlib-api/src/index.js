import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './context.jsx';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProvider>
    <App />
  </AppProvider>
);

