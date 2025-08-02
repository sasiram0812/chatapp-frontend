import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'react-feather';
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
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).some(field => field === '')) {
      setError('Please fill in all fields');
    } else if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError('');
      // Here you would typically handle the signup logic
      console.log('Signup attempted with:', formData);
      // For demonstration purposes, we'll just navigate to the home page
      navigate('/home');
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
          By signing up, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;

