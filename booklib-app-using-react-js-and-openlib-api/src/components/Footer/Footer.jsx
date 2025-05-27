import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logoImg from "../../images/logo.png";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaBook, FaHeart, FaUsers, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Here you would typically send the email to your backend
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const quickLinks = [
    { path: '/book', label: 'Explorează Cărți' },
    { path: '/about', label: 'Despre Noi' },
    { path: '/favorites', label: 'Favorite' },
    { path: '/profile', label: 'Contul Meu' },
  ];

  const categories = [
    'Ficțiune',
    'Non-ficțiune',
    'Science Fiction',
    'Romantice',
    'Mister & Thriller',
    'Biografii',
    'Istorie',
    'Dezvoltare Personală'
  ];

  const socialLinks = [
    { icon: FaFacebook, url: 'https://facebook.com/bookhub', label: 'Facebook' },
    { icon: FaTwitter, url: 'https://twitter.com/bookhub', label: 'Twitter' },
    { icon: FaInstagram, url: 'https://instagram.com/bookhub', label: 'Instagram' },
    { icon: FaLinkedin, url: 'https://linkedin.com/company/bookhub', label: 'LinkedIn' },
    { icon: FaYoutube, url: 'https://youtube.com/bookhub', label: 'YouTube' },
  ];

  return (
    <footer className='footer'>
      {/* Newsletter Section */}
      <div className='newsletter-section'>
        <div className='container'>
          <div className='newsletter-content'>
            <div className='newsletter-text'>
              <h3>Rămâi la curent cu noutățile</h3>
              <p>Primește recomandări de cărți și noutăți direct în inbox-ul tău</p>
            </div>
            <form className='newsletter-form' onSubmit={handleNewsletterSubmit}>
              <div className='newsletter-input-group'>
                <input
                  type='email'
                  placeholder='Adresa ta de email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type='submit' className='newsletter-btn'>
                  <FaPaperPlane />
                  {subscribed ? 'Mulțumim!' : 'Abonează-te'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className='footer-main'>
        <div className='container'>
          <div className='footer-grid'>
            {/* Company Info */}
            <div className='footer-section company-info'>
              <Link to="/" className='footer-brand'>
                <img src={logoImg} alt="BookHub Logo" className='footer-logo' />
                <span className='footer-brand-name'>BookHub</span>
              </Link>
              <p className='company-description'>
                Platforma ta de încredere pentru descoperirea și împrumutarea cărților. 
                Conectăm cititorii cu o colecție vastă de literatură din toate genurile.
              </p>
              <div className='company-stats'>
                <div className='stat'>
                  <FaBook className='stat-icon' />
                  <span>50,000+ Cărți</span>
                </div>
                <div className='stat'>
                  <FaUsers className='stat-icon' />
                  <span>12,000+ Utilizatori</span>
                </div>
                <div className='stat'>
                  <FaHeart className='stat-icon' />
                  <span>8,900+ Recenzii</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className='footer-section'>
              <h4>Navigare Rapidă</h4>
              <ul className='footer-links'>
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
                <li><Link to="/help">Ajutor & Suport</Link></li>
                <li><Link to="/faq">Întrebări Frecvente</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div className='footer-section'>
              <h4>Categorii Populare</h4>
              <ul className='footer-links categories'>
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link to={`/book?category=${encodeURIComponent(category)}`}>
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className='footer-section'>
              <h4>Contact</h4>
              <div className='contact-info'>
                <div className='contact-item'>
                  <FaMapMarkerAlt className='contact-icon' />
                  <span>Strada Cărților nr. 123<br />București, România</span>
                </div>
                <div className='contact-item'>
                  <FaPhone className='contact-icon' />
                  <span>+40 21 123 4567</span>
                </div>
                <div className='contact-item'>
                  <FaEnvelope className='contact-icon' />
                  <span>contact@bookhub.ro</span>
                </div>
              </div>
              
              {/* Social Media */}
              <div className='social-media'>
                <h5>Urmărește-ne</h5>
                <div className='social-links'>
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='social-link'
                      title={social.label}
                    >
                      <social.icon />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className='footer-bottom'>
        <div className='container'>
          <div className='footer-bottom-content'>
            <div className='copyright'>
              <p>&copy; 2024 BookHub. Toate drepturile rezervate.</p>
            </div>
            <div className='footer-bottom-links'>
              <Link to="/privacy">Politica de Confidențialitate</Link>
              <Link to="/terms">Termeni și Condiții</Link>
              <Link to="/cookies">Politica Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 