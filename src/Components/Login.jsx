import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import logo from '../assets/a.png';
import '../App.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // React Router navigation

  // Predefined user credentials
  const predefinedUser = {
    email: 'user@gmail.com',
    password: '1111'
  };

  // Handle login or signup
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Check if user input matches predefined credentials
      if (email === predefinedUser.email && password === predefinedUser.password) {
        alert('Login successful!');
        setError('');
        navigate('/'); // Redirect to Home
      } else {
        setError('Invalid email or password. Try again.');
      }
    } else {
      // Sign-up logic (you can extend this to store new users)
      alert('Account created successfully!');
      setEmail('');
      setPassword('');
      setIsLogin(true);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo" className="logo" />
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
        localStorage.setItem('isLoggedIn', 'true');

          {!isLogin && (
            <>
              <div className="input-group">
                <label>Username</label>
                <input type="text" placeholder="Enter your username" required />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="Enter your phone number" required />
              </div>
            </>
          )}
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            className="toggle-btn"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(''); // Clear errors when switching
            }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
