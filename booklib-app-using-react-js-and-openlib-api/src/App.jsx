import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context.jsx';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import AllBooks from './pages/AllBooks/AllBooks';
import Login from './components/Auth/Login';
import Authenticate from './components/Auth/Authenticate';
import UserProfile from './components/Auth/UserProfile';
import Favorites from './components/Favorites/Favorites';
import BookDetails from './components/BookDetails/BookDetails';
import LibrarianDashboard from './pages/Librarian/LibrarianDashboard';
import LibrarianOrder from './components/Librarian/LibrarianOrder';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/all-books' element={<AllBooks />} />
          <Route path='/login' element={<Login />} />
          <Route path='/authenticate' element={<Authenticate />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/favorites' element={<Favorites />} />
          <Route path='/book' element={<Home />} />
          <Route path='/book/:id' element={<BookDetails />} />
          <Route path='/librarian' element={<LibrarianDashboard />} />
          <Route path='/librarian/orders' element={<LibrarianOrder />} />
        </Routes>
        <Footer />
      </Router>
    </AppProvider>
  );
}

export default App; 