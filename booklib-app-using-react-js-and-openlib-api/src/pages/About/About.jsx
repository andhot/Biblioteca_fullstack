import React, { useState, useEffect } from 'react';
import "./About.css";
import aboutImg from "../../images/about-img.jpg";
import { FaBook, FaUsers, FaHeart, FaStar, FaGraduationCap, FaGlobe, FaShieldAlt, FaClock, FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const About = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState({
    books: 0,
    users: 0,
    libraries: 0,
    reviews: 0
  });
  const navigate = useNavigate();

  // Animate statistics on component mount
  useEffect(() => {
    fetch('http://localhost:8081/api/statistics/global')
      .then(res => res.json())
      .then(data => setStats({
        books: data.totalBooks,
        users: data.totalUsers,
        libraries: data.totalLibraries,
        reviews: data.totalReviews
      }))
      .catch(() => setStats({ books: 0, users: 0, libraries: 0, reviews: 0 }));
  }, []);

  const features = [
    {
      icon: FaBook,
      title: "Colecție Vastă",
      description: "Peste 50,000 de cărți din toate genurile și domeniile, actualizate constant cu noutăți."
    },
    {
      icon: FaUsers,
      title: "Comunitate Activă",
      description: "Alătură-te unei comunități de peste 12,000 de cititori pasionați din toată țara."
    },
    {
      icon: FaHeart,
      title: "Experiență Personalizată",
      description: "Recomandări personalizate bazate pe preferințele și istoricul tău de lectură."
    },
    {
      icon: FaStar,
      title: "Recenzii Autentice",
      description: "Citește și scrie recenzii pentru a ajuta comunitatea să descopere cărți minunate."
    },
    {
      icon: FaGraduationCap,
      title: "Resurse Educaționale",
      description: "Acces la materiale educaționale, cursuri online și ghiduri de lectură."
    },
    {
      icon: FaGlobe,
      title: "Acces Global",
      description: "Platformă disponibilă 24/7, accesibilă de oriunde te-ai afla."
    }
  ];

  const testimonials = [
    {
      name: "Maria Popescu",
      role: "Student, Universitatea București",
      text: "BookCentral mi-a schimbat complet experiența de lectură. Găsesc întotdeauna cărțile de care am nevoie pentru studii și am descoperit autori noi fascinanti.",
      rating: 5
    },
    {
      name: "Alexandru Ionescu",
      role: "Profesor de Literatură",
      text: "Folosesc BookCentral pentru a recomanda cărți elevilor mei. Platforma este intuitivă și colecția este impresionantă.",
      rating: 5
    },
    {
      name: "Elena Dumitrescu",
      role: "Cititor pasionat",
      text: "Am citit peste 100 de cărți prin BookCentral anul trecut. Sistemul de recomandări este excepțional!",
      rating: 5
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Andrei Popescu",
      role: "Fondator & CEO",
      description: "Pasionat de tehnologie și literatură, cu peste 15 ani experiență în dezvoltarea de platforme educaționale.",
      image: "/images/team-1.jpg"
    },
    {
      name: "Ioana Marinescu",
      role: "Director Tehnic",
      description: "Expert în dezvoltarea de aplicații web moderne și arhitectura sistemelor scalabile.",
      image: "/images/team-2.jpg"
    },
    {
      name: "Mihai Georgescu",
      role: "Manager Conținut",
      description: "Bibliotecar cu experiență în curarea colecțiilor digitale și managementul metadatelor.",
      image: "/images/team-3.jpg"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const formatNumber = (num) => {
    return num.toLocaleString('ro-RO');
  };

  return (
    <div className='about-page'>
      {/* Hero Section */}
      <section className='about-hero'>
        <div className='container'>
          <div className='hero-content'>
            <div className='hero-text'>
              <h1 className='hero-title'>
                Despre <span className='highlight'>BookCentral</span>
              </h1>
              <p className='hero-subtitle'>
                Transformăm modul în care oamenii descoperă, citesc și împărtășesc cărți. 
                Suntem mai mult decât o bibliotecă digitală - suntem o comunitate de cititori pasionați.
              </p>
              <div className='hero-stats'>
                <div className='stat-item'>
                  <span className='stat-number'>{formatNumber(stats.books)}+</span>
                  <span className='stat-label'>Cărți</span>
                </div>
                <div className='stat-item'>
                  <span className='stat-number'>{formatNumber(stats.users)}+</span>
                  <span className='stat-label'>Utilizatori</span>
                </div>
                <div className='stat-item'>
                  <span className='stat-number'>{stats.libraries}+</span>
                  <span className='stat-label'>Biblioteci</span>
                </div>
                <div className='stat-item'>
                  <span className='stat-number'>{formatNumber(stats.reviews)}+</span>
                  <span className='stat-label'>Recenzii</span>
                </div>
              </div>
            </div>
            <div className='hero-image'>
              <img src={aboutImg} alt="BookCentral - Biblioteca ta digitală" />
              <div className='image-overlay'>
                <div className='floating-card'>
                  <FaBook className='card-icon' />
                  <span>Citește oriunde, oricând</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className='mission-section'>
        <div className='container'>
          <div className='section-header'>
            <h2>Misiunea Noastră</h2>
            <p>Credem că accesul la cunoaștere trebuie să fie universal și simplu</p>
          </div>
          <div className='mission-content'>
            <div className='mission-card primary'>
              <FaShieldAlt className='mission-icon' />
              <h3>Accesibilitate</h3>
              <p>Facem literatura și cunoașterea accesibile tuturor, indiferent de locație sau resurse financiare.</p>
            </div>
            <div className='mission-card secondary'>
              <FaClock className='mission-icon' />
              <h3>Inovație</h3>
              <p>Folosim tehnologia pentru a crea experiențe de lectură moderne și personalizate.</p>
            </div>
            <div className='mission-card tertiary'>
              <FaUsers className='mission-icon' />
              <h3>Comunitate</h3>
              <p>Construim o comunitate vibrantă de cititori care se inspiră și se ajută reciproc.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='features-section'>
        <div className='container'>
          <div className='section-header'>
            <h2>De Ce BookCentral?</h2>
            <p>Descoperă avantajele care ne fac unici în lumea bibliotecilor digitale</p>
          </div>
          <div className='features-grid'>
            {features.map((feature, index) => (
              <div key={index} className='feature-card'>
                <div className='feature-icon'>
                  <feature.icon />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Temporarily commented out
      <section className='team-section'>
        <div className='container'>
          <div className='section-header'>
            <h2>Echipa Noastră</h2>
            <p>Oamenii pasionați din spatele BookCentral</p>
          </div>
          <div className='team-grid'>
            {teamMembers.map((member, index) => (
              <div key={index} className='team-card'>
                <div className='member-image'>
                  <img 
                    src={member.image} 
                    alt={member.name}
                    onError={(e) => {
                      e.target.src = '/images/default-avatar.jpg';
                    }}
                  />
                </div>
                <div className='member-info'>
                  <h3>{member.name}</h3>
                  <span className='member-role'>{member.role}</span>
                  <p>{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Testimonials Section */}
      <section className='testimonials-section'>
        <div className='container'>
          <div className='section-header'>
            <h2>Ce Spun Utilizatorii</h2>
            <p>Experiențele reale ale comunității BookCentral</p>
          </div>
          <div className='testimonials-container'>
            <button className='testimonial-nav prev' onClick={prevTestimonial}>
              <FaChevronLeft />
            </button>
            <div className='testimonial-card'>
              <FaQuoteLeft className='quote-icon' />
              <p className='testimonial-text'>{testimonials[currentTestimonial].text}</p>
              <div className='testimonial-rating'>
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <FaStar key={i} className='star' />
                ))}
              </div>
              <div className='testimonial-author'>
                <h4>{testimonials[currentTestimonial].name}</h4>
                <span>{testimonials[currentTestimonial].role}</span>
              </div>
            </div>
            <button className='testimonial-nav next' onClick={nextTestimonial}>
              <FaChevronRight />
            </button>
          </div>
          <div className='testimonial-dots'>
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='cta-section'>
        <div className='container'>
          <div className='cta-content'>
            <h2>Începe Călătoria Ta de Lectură</h2>
            <p>Alătură-te comunității BookCentral și descoperă o lume de cărți extraordinare</p>
            <div className='cta-buttons'>
              <a href="/book" className='cta-btn primary'>
                <FaBook />
                Explorează Cărțile
              </a>
              <button
                className='cta-btn secondary'
                onClick={() => navigate('/login')}
                style={{ border: 'none', background: 'none', padding: 0, margin: 0 }}
              >
                <FaUsers />
                Creează Cont Gratuit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className='contact-section'>
        <div className='container'>
          <div className='section-header'>
            <h2>Contactează-ne</h2>
            <p>Suntem aici să te ajutăm cu orice întrebări sau sugestii</p>
          </div>
          <div className='contact-content'>
            <div className='contact-info'>
              <div className='contact-card'>
                <div className='contact-icon'>
                  <i className='fas fa-map-marker-alt'></i>
                </div>
                <h4>Adresa</h4>
                <p>Strada Cărților nr. 123<br />București, România</p>
              </div>
              <div className='contact-card'>
                <div className='contact-icon'>
                  <i className='fas fa-phone'></i>
                </div>
                <h4>Telefon</h4>
                <p>+40 21 123 4567<br />Luni - Vineri: 9:00 - 18:00</p>
              </div>
              <div className='contact-card'>
                <div className='contact-icon'>
                  <i className='fas fa-envelope'></i>
                </div>
                <h4>Email</h4>
                <p>contact@bookcentral.ro<br />suport@bookcentral.ro</p>
              </div>
            </div>
            <div className='contact-form-container'>
              <form className='contact-form'>
                <div className='form-group'>
                  <input type='text' placeholder='Numele tău' required />
                </div>
                <div className='form-group'>
                  <input type='email' placeholder='Email-ul tău' required />
                </div>
                <div className='form-group'>
                  <input type='text' placeholder='Subiect' required />
                </div>
                <div className='form-group'>
                  <textarea placeholder='Mesajul tău' rows='5' required></textarea>
                </div>
                <button type='submit' className='submit-btn'>
                  <i className='fas fa-paper-plane'></i>
                  Trimite Mesajul
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
