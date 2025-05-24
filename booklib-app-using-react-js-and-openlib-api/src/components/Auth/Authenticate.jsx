import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Auth.css'; // Assuming you have Auth.css for styling
import { useGlobalContext } from '../../context'; // Import useGlobalContext

const Authenticate = () => {
  const [step, setStep] = useState(1); // 1: Registration form, 2: Email verification
  const [registrationType, setRegistrationType] = useState('user'); // 'user' sau 'librarian'
  const [formData, setFormData] = useState({
    // Common fields
    email: '',
    password: '',
    // User specific fields
    firstName: '',
    lastName: '',
    phoneNumber: '',
    yearOfBirth: '',
    country: '',
    gender: 'MALE', // Default value
    // Librarian specific fields
    name: '', // Used for librarian name
    libraryId: '',
    // Library fields
    libraryName: '',
    libraryAddress: '',
    libraryPhoneNumber: '',
    // Verification code (for user step 2)
    verificationCode: '',
  });
  const [userIdForVerification, setUserIdForVerification] = useState(null); // To store userId after successful user registration
  const [librarianIdForVerification, setLibrarianIdForVerification] = useState(null); // To store librarianId after successful librarian registration
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { API_BASE_URL } = useGlobalContext(); // Use API_BASE_URL from context

  // Check if navigating from Register with userId (e.g., after resending code)
  useEffect(() => {
     if (location.state?.userId) {
       setUserIdForVerification(location.state.userId);
       setStep(2); // Jump to verification step
     }
     if (location.state?.librarianId) {
       setLibrarianIdForVerification(location.state.librarianId);
       setStep(2); // Jump to verification step
     }
   }, [location.state?.userId, location.state?.librarianId]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const registrationEndpoint = registrationType === 'user' ? `${API_BASE_URL}/users` : `${API_BASE_URL}/librarians`;
    let requestBody = {};

    if (registrationType === 'user') {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.phoneNumber) {
         setError('Prenumele, Numele, Email-ul, Parola și Numărul de telefon sunt obligatorii.');
         setLoading(false);
         return;
      }
      requestBody = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        yearOfBirth: parseInt(formData.yearOfBirth) || null, // Convert to number, null if empty
        country: formData.country,
        gender: formData.gender,
      };
    } else { // librarian registration
       if (!formData.name || !formData.email || !formData.password || 
           !formData.libraryName || !formData.libraryAddress || !formData.libraryPhoneNumber) {
         setError('Toate câmpurile sunt obligatorii pentru înregistrarea unui bibliotecar.');
         setLoading(false);
         return;
       }
       requestBody = {
         name: formData.name,
         email: formData.email,
         password: formData.password,
         library: {
           name: formData.libraryName,
           adress: formData.libraryAddress,
           phoneNumber: formData.libraryPhoneNumber
         }
       };
    }

    try {
      console.log("Attempting to register", registrationType, "with data:", requestBody);
      console.log("Endpoint:", registrationEndpoint);
      const response = await fetch(registrationEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text(); // Read as text first
      console.log("Response status:", response.status);
      console.log("Response text:", responseText);

      if (!response.ok) {
         // Try to parse JSON error if Content-Type is application/json
         if (response.headers.get('content-type')?.includes('application/json')) {
             try {
                 const errorData = JSON.parse(responseText);
                 const errorMsg = errorData.message || `Înregistrare ${registrationType} eșuată`;
                 setError(errorMsg);
                 console.error(`Registration error (${registrationType}):`, errorData);
             } catch (jsonError) {
                  // If JSON parsing fails, use the raw text
                 const errorMsg = `Înregistrare ${registrationType} eșuată: ${responseText || response.statusText}`;
                 setError(errorMsg);
                 console.error(`Registration error (${registrationType}) - JSON parse failed:`, jsonError, "Response text:", responseText);
             }
         } else {
             // Handle non-JSON error responses (like HTML error pages)
             const errorMsg = `Înregistrare ${registrationType} eșuată. Răspuns neașteptat de la server.`;
             setError(errorMsg);
             console.error(`Registration error (${registrationType}) - Non-JSON response:`, responseText);
         }
      } else {
         // Assuming successful responses are JSON
         const responseData = JSON.parse(responseText); // Parse successful response as JSON
         if (registrationType === 'user') {
           alert('Cont de utilizator creat cu succes! Vă rugăm să verificați email-ul pentru codul de verificare.');
           setUserIdForVerification(responseData.id); // Store userId for the next step
           setStep(2); // Move to verification step
         } else { // librarian
           alert('Cont de bibliotecar creat cu succes! Vă rugăm să verificați email-ul pentru codul de verificare.');
           setLibrarianIdForVerification(responseData.id); // Store librarianId for the next step
           setStep(2); // Move to verification step
         }
      }
    } catch (err) {
      console.error(`Registration fetch error (${registrationType}):`, err);
      setError(err.message || `A apărut o eroare la înregistrare ${registrationType}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.verificationCode) {
        setError('Introduceți codul de verificare.');
        setLoading(false);
        return;
    }

    const idForVerification = registrationType === 'user' ? userIdForVerification : librarianIdForVerification;
    if (!idForVerification) {
        setError('ID lipsă pentru verificare.');
        setLoading(false);
        return;
    }

    try {
      console.log("Attempting email verification for ID:", idForVerification);
      const endpoint = registrationType === 'user' 
        ? `${API_BASE_URL}/users/${idForVerification}`
        : `${API_BASE_URL}/librarians/${idForVerification}`;

      // Pentru bibliotecari, trimitem doar codul de verificare
      const requestBody = {
        verificationCode: formData.verificationCode
      };

      console.log("Sending verification request with body:", requestBody);

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();
      console.log("Verification response status:", response.status);
      console.log("Verification response text:", responseText);

      if (!response.ok) {
          if (response.headers.get('content-type')?.includes('application/json')) {
             try {
                 const errorData = JSON.parse(responseText);
                 const errorMsg = errorData.message || 'Verificare email eșuată';
                 setError(errorMsg);
                 console.error('Email verification error:', errorData);
             } catch (jsonError) {
                 const errorMsg = `Verificare email eșuată: ${responseText || response.statusText}`;
                 setError(errorMsg);
                 console.error('Email verification error - JSON parse failed:', jsonError, "Response text:", responseText);
             }
         } else {
              const errorMsg = 'Verificare email eșuată. Răspuns neașteptat de la server.';
              setError(errorMsg);
              console.error('Email verification error - Non-JSON response:', responseText);
         }
      } else {
         alert('Email verificat cu succes! Acum vă puteți autentifica.');
         navigate('/login');
      }
    } catch (err) {
      console.error('Email verification fetch error:', err);
      setError(err.message || 'A apărut o eroare la verificare');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setLoading(true);

    const idForResend = registrationType === 'user' ? userIdForVerification : librarianIdForVerification;
    if (!idForResend) {
        setError('ID lipsă pentru retrimiterea codului.');
        setLoading(false);
        return;
    }

    try {
      console.log("Attempting to resend verification code for ID:", idForResend);
      const endpoint = registrationType === 'user'
        ? `${API_BASE_URL}/users/resendCode/${idForResend}`
        : `${API_BASE_URL}/librarians/resendCode/${idForResend}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
      });

      const responseText = await response.text();
      console.log("Resend code response status:", response.status);
      console.log("Resend code response text:", responseText);

      if (!response.ok) {
         if (response.headers.get('content-type')?.includes('application/json')) {
             try {
                 const errorData = JSON.parse(responseText);
                 const errorMsg = errorData.message || 'Retrimitere cod eșuată';
                 setError(errorMsg);
                 console.error('Resend code error:', errorData);
             } catch (jsonError) {
                 const errorMsg = `Retrimitere cod eșuată: ${responseText || response.statusText}`;
                 setError(errorMsg);
                 console.error('Resend code error - JSON parse failed:', jsonError, "Response text:", responseText);
             }
         } else {
              const errorMsg = 'Retrimitere cod eșuată. Răspuns neașteptat de la server.';
              setError(errorMsg);
              console.error('Resend code error - Non-JSON response:', responseText);
         }
      } else {
         alert('Un nou cod de verificare a fost trimis pe email-ul dvs.');
         setFormData(prev => ({ ...prev, verificationCode: '' }));
      }
    } catch (err) {
      console.error('Resend code fetch error:', err);
      setError(err.message || 'A apărut o eroare la retrimiterea codului');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Înregistrare</h2>
        {error && <p className="error-message">{error}</p>}

        {step === 1 && (
           <div className="login-type"> {/* Reusing login-type class for styling consistency */}
             <button
               type="button"
               className={registrationType === 'user' ? 'active' : ''}
               onClick={() => setRegistrationType('user')}
               disabled={loading}
             >
               Înregistrare User
             </button>
             <button
               type="button"
               className={registrationType === 'librarian' ? 'active' : ''}
               onClick={() => setRegistrationType('librarian')}
               disabled={loading}
             >
               Înregistrare Bibliotecar
             </button>
           </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRegistrationSubmit}>

            {registrationType === 'user' ? (
              <>
                <div className="form-group">
                  <label htmlFor="firstName">Prenume:</label>
                  <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required disabled={loading} />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Nume:</label>
                  <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required disabled={loading} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Introduceți email-ul" required disabled={loading} />
                </div>
                 <div className="form-group">
                  <label htmlFor="phoneNumber">Număr de telefon:</label>
                  <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required disabled={loading} />
                </div>
                <div className="form-group">
                  <label htmlFor="yearOfBirth">An naștere:</label>
                  <input type="number" id="yearOfBirth" name="yearOfBirth" value={formData.yearOfBirth} onChange={handleInputChange} min="1900" max={new Date().getFullYear()} disabled={loading} />
                </div>
                <div className="form-group">
                  <label htmlFor="country">Țară:</label>
                  <input type="text" id="country" name="country" value={formData.country} onChange={handleInputChange} disabled={loading} />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Gen:</label>
                  <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} disabled={loading}>
                    <option value="MALE">Masculin</option>
                    <option value="FEMALE">Feminin</option>
                    <option value="OTHER">Altul</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                 <div className="form-group">
                  <label htmlFor="name">Nume Bibliotecar:</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required disabled={loading} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Introduceți email-ul" required disabled={loading} />
                </div>
                <div className="form-group">
                  <label htmlFor="libraryName">Nume Librărie:</label>
                  <input type="text" id="libraryName" name="libraryName" value={formData.libraryName} onChange={handleInputChange} required disabled={loading} />
                </div>
                <div className="form-group">
                  <label htmlFor="libraryAddress">Adresă Librărie:</label>
                  <input type="text" id="libraryAddress" name="libraryAddress" value={formData.libraryAddress} onChange={handleInputChange} required disabled={loading} />
                </div>
                <div className="form-group">
                  <label htmlFor="libraryPhoneNumber">Telefon Librărie:</label>
                  <input type="tel" id="libraryPhoneNumber" name="libraryPhoneNumber" value={formData.libraryPhoneNumber} onChange={handleInputChange} required disabled={loading} />
                </div>
              </>
            )}

             <div className="form-group">
              <label htmlFor="password">Parolă:</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Introduceți parola" required minLength="6" disabled={loading} />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Se înregistrează...' : 'Înregistrare'}
            </button>
          </form>

        ) : ( // Step 2: Email Verification (for users only)
           <div className="verification-section"> {/* Reusing a class or create new specific styles */}
              <p className="verification-info">
                Un cod de verificare a fost trimis pe email-ul dvs. Vă rugăm să introduceți codul mai jos.
              </p>
              <form onSubmit={handleVerificationSubmit}>
                <div className="form-group">
                  <label htmlFor="verificationCode">Cod de verificare:</label>
                  <input
                    type="text"
                    id="verificationCode"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleInputChange}
                    required
                    maxLength="6"
                    minLength="6"
                    disabled={loading}
                  />
                </div>
                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? 'Se verifică...' : 'Verifică Email'}
                </button>
                 <button 
                    type="button" 
                    className="auth-btn secondary"
                    onClick={handleResendCode}
                    disabled={loading}
                 >
                   {loading ? 'Se retrimite...' : 'Retrimite Cod'}
                 </button>
              </form>
               <p className="auth-switch" style={{marginTop: '1rem'}}> {/* Adjust margin as needed */}
                 <span onClick={() => navigate('/login')}>Înapoi la Autentificare</span>
               </p>
           </div>
        )}

         {step === 1 && (
           <p className="auth-switch">
             Ai deja cont? <span onClick={() => navigate('/login')}>Autentifică-te</span>
           </p>
         )}

      </div>
    </div>
  );
};

export default Authenticate; 