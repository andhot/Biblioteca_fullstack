import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Navbar.css";
import logoImg from "../../images/logo.png";
import {HiOutlineMenuAlt3} from "react-icons/hi";
import { useGlobalContext } from '../../context.jsx';

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, setUser } = useGlobalContext();

  const handleNavbar = () => setToggleMenu(!toggleMenu);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <nav className='navbar' id = "navbar">
      <div className='container navbar-content flex'>
        <div className='brand-and-toggler flex flex-sb'>
          <Link to = "/" className='navbar-brand flex'>
            <img src = {logoImg} alt = "site logo" />
            <span className='text-uppercase fw-7 fs-24 ls-1'>bookhub</span>
          </Link>
          <button type = "button" className='navbar-toggler-btn' onClick={handleNavbar}>
            <HiOutlineMenuAlt3 size = {35} style = {{
              color: `${toggleMenu ? "#fff" : "#010101"}`
            }} />
          </button>
        </div>

        <div className={toggleMenu ? "navbar-collapse show-navbar-collapse" : "navbar-collapse"}>
          <ul className = "navbar-nav">
            <li className='nav-item'>
              <Link to = "/book" className='nav-link text-uppercase text-white fs-22 fw-6 ls-1'>Home</Link>
            </li>
            <li className='nav-item'>
              <Link to = "/about" className='nav-link text-uppercase text-white fs-22 fw-6 ls-1'>about</Link>
            </li>
            <li className='nav-item'>
              {isLoggedIn ? (
                <>
                  <Link to="/favorites" className='nav-link text-uppercase text-white fs-22 fw-6 ls-1'>
                    <i className='fas fa-heart'></i> Favorite
                  </Link>
                  <Link to="/profile" className='nav-link text-uppercase text-white fs-22 fw-6 ls-1'>Contul meu</Link>
                  <button onClick={handleLogout} className='nav-link text-uppercase text-white fs-22 fw-6 ls-1 logout-btn'>Logout</button>
                </>
              ) : (
                <Link to="/login" className='nav-link text-uppercase text-white fs-22 fw-6 ls-1'>Login</Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar