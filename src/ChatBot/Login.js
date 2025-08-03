// Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'react-feather';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; // Adjust the path if needed
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful!');
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="app-logo">
          <MessageCircle size={48} />
          <h1 className="app-name">ChatApp</h1>
        </div>
        <h2 className="login-title">Welcome Back!</h2>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="remember-me">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe">Remember me</label>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="login-button">Log In</button>

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
        <p className="forgot-password">
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
