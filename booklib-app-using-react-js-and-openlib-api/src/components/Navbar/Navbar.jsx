import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Navbar.css";
import logoImg from "../../images/logo.png";
import {HiOutlineMenuAlt3, HiX} from "react-icons/hi";
import {FaUser, FaHeart, FaHome, FaInfoCircle} from "react-icons/fa";
import { useGlobalContext } from '../../context.jsx';

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, setUser } = useGlobalContext();

  const userEmail = localStorage.getItem('userEmail');
  const userName = userEmail ? userEmail.split('@')[0] : 'User';

  const handleNavbar = () => setToggleMenu(!toggleMenu);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userLibrary');
    navigate('/');
    setToggleMenu(false);
  };

  return (
    <nav className='navbar' id="navbar">
      <div className='container navbar-content'>
        <div className='navbar-brand-section'>
          <Link to="/" className='navbar-brand'>
            <img src={logoImg} alt="BookHub Logo" className='navbar-logo' />
            <div className='brand-text'>
              <span className='brand-name'>BookHub</span>
              <span className='brand-tagline'>Biblioteca Ta Digitală</span>
            </div>
          </Link>
        </div>

        <div className='navbar-nav-desktop'>
          <ul className='nav-list'>
            <li className='nav-item'>
              <Link to="/book" className='nav-link'>
                <FaHome className='nav-icon' />
                <span>Acasă</span>
              </Link>
            </li>
            <li className='nav-item'>
              <Link to="/about" className='nav-link'>
                <FaInfoCircle className='nav-icon' />
                <span>Despre Noi</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className='navbar-actions'>
          {isLoggedIn ? (
            <>
              <Link to="/favorites" className='nav-action-btn favorites-btn'>
                <FaHeart />
                <span>Favorite</span>
              </Link>
              <Link to="/profile" className='nav-action-btn profile-btn'>
                <FaUser />
                <span>Contul Meu</span>
              </Link>
              <button onClick={handleLogout} className='nav-action-btn logout-btn'>
                Deconectare
              </button>
            </>
          ) : (
            <Link to="/login" className='nav-action-btn login-btn'>
              Conectare
            </Link>
          )}
        </div>

        <button 
          type="button" 
          className='mobile-menu-toggle'
          onClick={handleNavbar}
        >
          {toggleMenu ? <HiX size={24} /> : <HiOutlineMenuAlt3 size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${toggleMenu ? 'show' : ''}`}>
        <div className='mobile-menu-content'>
          <ul className='mobile-nav-list'>
            <li>
              <Link to="/book" className='mobile-nav-link' onClick={() => setToggleMenu(false)}>
                <FaHome />
                <span>Acasă</span>
              </Link>
            </li>
            <li>
              <Link to="/about" className='mobile-nav-link' onClick={() => setToggleMenu(false)}>
                <FaInfoCircle />
                <span>Despre Noi</span>
              </Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/favorites" className='mobile-nav-link' onClick={() => setToggleMenu(false)}>
                    <FaHeart />
                    <span>Favorite</span>
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className='mobile-nav-link' onClick={() => setToggleMenu(false)}>
                    <FaUser />
                    <span>Contul Meu</span>
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className='mobile-nav-link logout'>
                    Deconectare
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className='mobile-nav-link' onClick={() => setToggleMenu(false)}>
                  Conectare
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {toggleMenu && <div className='mobile-menu-overlay' onClick={() => setToggleMenu(false)}></div>}
    </nav>
  )
}

export default Navbar