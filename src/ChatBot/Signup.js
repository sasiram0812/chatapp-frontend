import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'react-feather';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './firebase';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      return setError('Please fill in all fields');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      navigate('/home');
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="app-logo">
          <MessageCircle size={48} />
          <h1 className="app-name">ChatApp</h1>
        </div>
        <h2 className="signup-title">Create Your Account</h2>
        {['name', 'email', 'phoneNumber', 'password', 'confirmPassword'].map((field) => (
          <div key={field} className="input-group">
            <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}</label>
            <input
              type={field.includes('password') ? 'password' : field === 'email' ? 'email' : field === 'phoneNumber' ? 'tel' : 'text'}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
              required
            />
          </div>
        ))}
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="signup-button">Create Account</button>
        <p className="login-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
        <p className="terms">
          By signing up, you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
