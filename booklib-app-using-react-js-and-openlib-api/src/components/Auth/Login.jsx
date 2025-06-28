import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGlobalContext } from '../../context';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('user'); // 'user', 'librarian', sau 'administrator'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser, API_BASE_URL } = useGlobalContext(); // Get API_BASE_URL from context

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Construct the correct login endpoint using API_BASE_URL
    let loginEndpoint;
    switch (loginType) {
      case 'user':
        loginEndpoint = `${API_BASE_URL}/users/login`;
        break;
      case 'librarian':
        loginEndpoint = `${API_BASE_URL}/librarians/login`;
        break;
      case 'administrator':
        loginEndpoint = `${API_BASE_URL}/administrators/login`;
        break;
      default:
        loginEndpoint = `${API_BASE_URL}/users/login`;
    }

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

      const responseText = await response.text(); 
      console.log("Login response status:", response.status);
      console.log("Login response text:", responseText);

      if (!response.ok) {
      
         if (response.headers.get('content-type')?.includes('application/json')) {
             try {
                 const errorData = JSON.parse(responseText);
                 const errorMsg = errorData.message || `Autentificare ${loginType} eșuată`;
                 setError(errorMsg);
                 console.error(`Login error (${loginType}):`, errorData);
             } catch (jsonError) {
            
                 const errorMsg = `Autentificare ${loginType} eșuată: ${responseText || response.statusText}`;
                 setError(errorMsg);
                 console.error(`Login error (${loginType}) - JSON parse failed:`, jsonError, "Response text:", responseText);
             }
         } else {
            
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

         // Redirect based on login type
         switch (loginType) {
           case 'librarian':
             navigate('/librarian');
             break;
           case 'administrator':
             navigate('/administrator');
             break;
           default:
             navigate('/profile'); // For regular users
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
          <button
            type="button"
            className={loginType === 'administrator' ? 'active' : ''}
            onClick={() => setLoginType('administrator')}
            disabled={loading}
          >
            Login ca Administrator
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