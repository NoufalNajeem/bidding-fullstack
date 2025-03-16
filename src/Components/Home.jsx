import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/a.png';
import teslaImg from '../assets/t.png';
import bmwImg from '../assets/bmw.jpg';
import audiImg from '../assets/audi.jpg';
import '../App.css';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCars, setFilteredCars] = useState([]);
  const [auctionEndTime, setAuctionEndTime] = useState(new Date().getTime() + 3600000); // 1 hour from now
  const [timeLeft, setTimeLeft] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(userLoggedIn === 'true');

    // Simulated car data
    const carData = [
      { id: 1, name: 'Tesla Model S', year: 2022, price: '$80,000', mileage: '10,000 miles', image: teslaImg },
      { id: 2, name: 'BMW M3', year: 2021, price: '$70,000', mileage: '12,000 miles', image: bmwImg },
      { id: 3, name: 'Audi R8', year: 2020, price: '$150,000', mileage: '8,000 miles', image: audiImg }
    ];
    setCars(carData);
    setFilteredCars(carData);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = auctionEndTime - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft('Auction Ended');
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [auctionEndTime]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = cars.filter(car => car.name.toLowerCase().includes(e.target.value.toLowerCase()));
    setFilteredCars(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    alert('You have been logged out.');
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <nav>
          <ul className="nav-links">
            <li><Link to="/auction">Auction</Link></li>
            <li><Link to="/about">About Us</Link></li>
            {!isLoggedIn ? (
              <li><Link to="/login">Login</Link></li>
            ) : (
              <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
            )}
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Find Your Dream Car</h1>
        <p>Exclusive Auctions for Premium Cars</p>
        <input 
          type="text" 
          placeholder="Search cars..." 
          value={searchTerm} 
          onChange={handleSearch} 
          className="search-bar"
        />
      </section>

      {/* Auction Countdown */}
      <div className="auction-timer">
        <h2>Live Auction Ends In: <span>{timeLeft}</span></h2>
      </div>

      {/* Featured Cars */}
      <section className="featured-cars">
        <h2>Featured Cars</h2>
        <div className="car-list">
          {filteredCars.map(car => (
            <div key={car.id} className="car-card">
              <img src={car.image} alt={car.name} className="car-image" />
              <h3>{car.name}</h3>
              <p>Year: {car.year}</p>
              <p>Price: {car.price}</p>
              <p>Mileage: {car.mileage}</p>
              <Link to="/auction" className="bid-btn">Bid Now</Link>
            </div>
          ))}
        </div>
      </section>

      {/* User Dashboard (if logged in) */}
      {isLoggedIn && (
        <section className="user-dashboard">
          <h2>Welcome Back!</h2>
          <div className="dashboard-content">
            <div className="saved-cars">
              <h3>Your Saved Cars</h3>
              {/* Display saved cars */}
            </div>
            <div className="bidding-history">
              <h3>Your Bidding History</h3>
              {/* Display bidding history */}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Subscription */}
      <section className="newsletter">
        <h2>Subscribe to Our Newsletter</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Enter your email" required />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-list">
          <div className="testimonial">
            <p>"I found my dream car at an amazing price. Highly recommended!"</p>
            <p>- John Doe</p>
          </div>
          <div className="testimonial">
            <p>"The auction process was smooth and easy to follow."</p>
            <p>- Jane Smith</p>
          </div>
        </div>
      </section>

      {/* Live Chat Support */}
      <div className="live-chat">
        <button onClick={() => setChatOpen(!isChatOpen)} className="chat-btn">
          {isChatOpen ? 'Close Chat' : 'Chat with Us'}
        </button>
        {isChatOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <h3>Support</h3>
            </div>
            <div className="chat-messages">
              {/* Display chat messages */}
            </div>
            <input type="text" placeholder="Type a message..." className="chat-input" />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Premium Car Auction. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;