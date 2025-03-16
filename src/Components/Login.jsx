import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import logo from '../assets/a.png';
import '../App.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // React Router navigation

  // Handle login or signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // Handle login (Call your API to check credentials)
      try {
        const response = await fetch(`http://localhost:5000/users?email=${email}&password=${password}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
  
        const data = await response.json();
        console.log('Login API Response:', data); // Log response
  
        if (response.ok && data) {
          console.log('Login Successful:', data);
         
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem("userId",data._id);
          localStorage.setItem("username", data.firstname);
          navigate('/Auction'); // Redirect to home
        } else {
          console.log('Login Failed:', data);
          setError('Invalid email or password. Try again.');
        }
      } catch (error) {
        setError('Error connecting to server. Try again later.');
      }
    } else {
      // Handle sign-up (Call API to create a new user)
      const userData = { firstname, lastname, email, password };
      console.log('Signup Successful:', userData);
      try {
        const response = await fetch('http://localhost:5000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });

        const data = await response.json();
        console.log('Signup Successful:', data);
        if (response.ok) {
         
          setFirstname('');
          setLastname('');
          setEmail('');
          setPassword('');
          setIsLogin(true);
        } else {
          alert('Account created successfully!');
          setError(data.message || 'Signup failed. Try again.');
        }
      } catch (error) {
        alert('Account created successfully!');
        setError('Error connecting to server. Try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo" className="logo" />
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="input-group">
                <label>First Name</label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
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
