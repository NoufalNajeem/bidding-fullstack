import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Auction.css';
import teslaImg from '../assets/t.png';
import bmwImg from '../assets/bmw.jpg';
import audiImg from '../assets/audi.jpg';
import mercedesImg from '../assets/mercedes.jpg';
import porscheImg from '../assets/porshe.jpg';

const Auction = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeLeft, setTimeLeft] = useState(600);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  
  const [cars, setCars] = useState([
    { id: 1, name: 'Tesla Model S', year: 2022, price: 80000, mileage: '10,000 miles', image: teslaImg, highestBid: 80000, showBidInput: false },
    { id: 2, name: 'BMW M3', year: 2021, price: 70000, mileage: '15,000 miles', image: bmwImg, highestBid: 70000, showBidInput: false },
    { id: 3, name: 'Audi R8', year: 2020, price: 150000, mileage: '8,000 miles', image: audiImg, highestBid: 150000, showBidInput: false },
    { id: 4, name: 'Mercedes AMG GT', year: 2023, price: 120000, mileage: '5,000 miles', image: mercedesImg, highestBid: 120000, showBidInput: false },
    { id: 5, name: 'Porsche 911 Turbo', year: 2022, price: 170000, mileage: '3,000 miles', image: porscheImg, highestBid: 170000, showBidInput: false }
  ]);

  const [bidValues, setBidValues] = useState({});
  

  // Timer Logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle Search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCars = cars.filter(car =>
    car.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle Bid Input Field
  const toggleBidInput = (carId) => {
    if (!isLoggedIn) {
      alert('You need to log in to place a bid.');
      return;
    }

    setCars(cars.map(car => 
      car.id === carId ? { ...car, showBidInput: !car.showBidInput } : car
    ));
    setBidValues((prev) => ({ ...prev, [carId]: '' })); // Initialize bid input
  };

  // Handle Bidding
  const handleBid = (carId) => {
    const bidAmount = parseInt(bidValues[carId]);

    if (!bidAmount || isNaN(bidAmount)) {
      alert('Please enter a valid number.');
      return;
    }

    setCars(cars.map(car => 
      car.id === carId && bidAmount > car.highestBid 
        ? { ...car, highestBid: bidAmount, showBidInput: false }
        : car
    ));

    setBidValues((prev) => ({ ...prev, [carId]: '' })); // Reset input after submission
  };

  return (
    <div className="live-auction-container">
      <header className="header">
        <div className="logo-container">
          <Link to="/">Home</Link>
        </div>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search cars..." 
            value={searchTerm} 
            onChange={handleSearch} 
          />
        </div>
      </header>

      <div className="auction-timer">
        <h2>Live Auction Countdown: {formatTime(timeLeft)}</h2>
      </div>

      <div className="car-listings">
        {filteredCars.map(car => (
          <div key={car.id} className="car-card">
            <img src={car.image} alt={car.name} className="car-image" />
            <h3>{car.name}</h3>
            <p>Year: {car.year}</p>
            <p>Price: ${car.price}</p>
            <p>Mileage: {car.mileage}</p>
            <p>Highest Bid: ${car.highestBid}</p>
            
            <button onClick={() => toggleBidInput(car.id)}>Place Bid</button>

            {car.showBidInput && (
              <div className="bid-input-container">
                <input 
                  type="number" 
                  placeholder="Enter your bid" 
                  value={bidValues[car.id] || ''} 
                  onChange={(e) => setBidValues({ ...bidValues, [car.id]: e.target.value })}
                />
                <button onClick={() => handleBid(car.id)}>Submit</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <footer className="footer">
        <p>&copy; 2025 Premium Car Auction. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Auction;
