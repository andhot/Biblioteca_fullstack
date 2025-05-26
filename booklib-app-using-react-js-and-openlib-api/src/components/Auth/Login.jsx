import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGlobalContext } from '../../context';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('user'); // 'user' sau 'librarian'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser, API_BASE_URL } = useGlobalContext(); // Get API_BASE_URL from context

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Construct the correct login endpoint using API_BASE_URL
    const loginEndpoint = loginType === 'user' ? `${API_BASE_URL}/users/login` : `${API_BASE_URL}/librarians/login`;

    try {
      console.log("Attempting login as", loginType, "with email:", email);
      console.log("Endpoint:", loginEndpoint);
      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseText = await response.text(); // Read as text first
      console.log("Login response status:", response.status);
      console.log("Login response text:", responseText);

      if (!response.ok) {
        // Try to parse JSON error if Content-Type is application/json
         if (response.headers.get('content-type')?.includes('application/json')) {
             try {
                 const errorData = JSON.parse(responseText);
                 const errorMsg = errorData.message || `Autentificare ${loginType} eșuată`;
                 setError(errorMsg);
                 console.error(`Login error (${loginType}):`, errorData);
             } catch (jsonError) {
                  // If JSON parsing fails, use the raw text
                 const errorMsg = `Autentificare ${loginType} eșuată: ${responseText || response.statusText}`;
                 setError(errorMsg);
                 console.error(`Login error (${loginType}) - JSON parse failed:`, jsonError, "Response text:", responseText);
             }
         } else {
             // Handle non-JSON error responses (like HTML error pages)
             const errorMsg = `Autentificare ${loginType} eșuată. Răspuns neașteptat de la server.`;
             setError(errorMsg);
             console.error(`Login error (${loginType}) - Non-JSON response:`, responseText);
         }
      } else {
         const userData = JSON.parse(responseText); // Parse successful response as JSON
         console.log('USERDATA LA LOGIN:', userData); // DEBUG
         // Store user data and login state
         localStorage.setItem('isLoggedIn', 'true');
         localStorage.setItem('userEmail', userData.email);
         localStorage.setItem('userRole', loginType);
          if (userData.id) {
               localStorage.setItem('userId', userData.id);
           }
         if (userData.library) {
               localStorage.setItem('userLibrary', JSON.stringify(userData.library));
         }

         setUser({...userData, role: loginType}); // Add role to user object in context
         setIsLoggedIn(true);

         if (loginType === 'librarian') {
           navigate('/librarian');
         } else {
           navigate('/profile'); // Or wherever you want to redirect users
         }
      }
    } catch (err) {
      console.error(`Login fetch error (${loginType}):`, err);
      setError(err.message || `A apărut o eroare la autentificare ${loginType}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <div className="login-type">
          <button
            type="button"
            className={loginType === 'user' ? 'active' : ''}
            onClick={() => setLoginType('user')}
            disabled={loading}
          >
            Login ca User
          </button>
          <button
            type="button"
            className={loginType === 'librarian' ? 'active' : ''}
            onClick={() => setLoginType('librarian')}
            disabled={loading}
          >
            Login ca Librarian
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Parolă</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Se autentifică...' : 'Login'}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/authenticate" className="auth-link">
            Nu ai cont? Autentifică-te
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 