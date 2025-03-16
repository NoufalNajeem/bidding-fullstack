import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      {/* Header */}
      <header className="header">
        <div className="logo">PREMIUM CAR AUCTION</div>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/auction">Auction</Link></li>
            <li><Link to="/login">Login</Link></li> {/* Fixed link case */}
          </ul>
        </nav>
      </header>

      {/* About Us Content */}
      <section className="aboutus-content">
        <h1>About Us</h1>
        <p>
          Welcome to <strong>Premium Car Auction</strong>, the leading online marketplace for classic, luxury,
          and exotic vehicles. Our platform is designed for car enthusiasts and collectors to connect,
          bid, and own their dream rides.
        </p>

        <h2>Our History</h2>
        <p>
          Founded in 2010, Premium Car Auction started as a small, passionate team of car enthusiasts
          determined to revolutionize the car auction experience. Over the years, we have grown into a
          global platform, hosting thousands of successful auctions and helping clients buy and sell some
          of the most sought-after vehicles in the world.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to create a trusted and transparent space for buyers and sellers of premium
          vehicles. We aim to revolutionize the car auction experience by providing seamless online
          bidding, secure transactions, and a curated selection of top-tier automobiles.
        </p>

        <h2>Why Choose Us?</h2>
        <ul>
          <li><strong>Curated Selection:</strong> We showcase only the best classic and luxury vehicles.</li>
          <li><strong>Secure Transactions:</strong> Your trust is our priority. We ensure safe and verified auctions.</li>
          <li><strong>Expert Support:</strong> Our team of car experts is always ready to assist you.</li>
          <li><strong>Global Reach:</strong> Join auctions from anywhere in the world.</li>
          <li><strong>Proven Track Record:</strong> With over a decade of experience, we have built a reputation for reliability and excellence.</li>
        </ul>

        <h2>Our Location</h2>
        <p>
          Visit us at our headquarters or join us online from the comfort of your home. We are located at:
        </p>
        <address>
          123 Premium Car Auction Street,<br />
          Auto City, CA 90210,<br />
          United States
        </address>

        {/* Google Maps Embed */}
        <h2>Find Us on the Map</h2>
        <div className="map-container">
          <iframe
            title="Our Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.853163860628!2d-122.4194156846813!3d37.77492977975925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c5c5c5c5c%3A0x5c5c5c5c5c5c5c5c!2sPremium%20Car%20Auction!5e0!3m2!1sen!2sus!4v1712345678901!5m2!1sen!2sus"
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Premium Car Auction. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;
