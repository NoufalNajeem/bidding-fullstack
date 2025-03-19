// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Link } from 'react-router-dom';

// const Main = () => {
//   return (
//     <div>
//       {/* Navbar */}
//       <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
//         <div className="container-fluid">
//           <Link className="navbar-brand" to="/">BidMaster</Link>
//           <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div className="collapse navbar-collapse" id="navbarNav">
//             <ul className="navbar-nav ms-auto">
//               <li className="nav-item">
//                 <a className="nav-link" href="#about">About</a> {/* It's fine here, as it's scrolling to section */}
//               </li>
//               <li className="nav-item">
//                 <Link to="/login" className="nav-link">Login</Link>
//               </li>
//               <li className="nav-item">
//                 <Link to="/signup" className="nav-link">Signup</Link>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className="container text-center mt-5">
//         <h1 className="display-4 mb-3">Welcome to BidMaster!</h1>
//         <p className="lead mb-4">
//           Join the best online bidding platform. Place bids, win auctions, and enjoy great deals!
//         </p>
//         <Link to="/login" className="btn btn-primary me-3">Login</Link>
//         <Link to="/signup" className="btn btn-outline-primary">Signup</Link>
//       </div>

//       {/* About Section */}
//       <div id="about" className="container mt-5">
//         <h2 className="text-center mb-4">About Us</h2>
//         <p className="text-center">
//           BidMaster is an innovative online bidding platform designed to offer seamless and secure auction experiences.
//           Our mission is to connect buyers and sellers from around the world and provide a transparent bidding process.
//         </p>
//       </div>

//       {/* Footer */}
//       <footer className="bg-primary text-white text-center py-3 mt-5">
//         &copy; {new Date().getFullYear()} BidMaster. All rights reserved.
//       </footer>
//     </div>
//   );
// };

// export default Main;


import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, NavLink } from 'react-router-dom';
import './Main.css'; // Import custom CSS for hover effects

const auctionItems = [
  {
    id: 1,
    title: 'Antique Pocket Watch',
    description: 'Classic antique pocket watch. Starting at $150.',
    image: 'https://www.shutterstock.com/shutterstock/photos/9527836/display_1500/stock-photo-antique-clock-9527836.jpg'
  },
  {
    id: 2,
    title: 'Vintage Car Model',
    description: 'Collectible vintage car model. Starting at $200.',
    image: 'https://www.shutterstock.com/shutterstock/photos/2499582647/display_1500/stock-photo-stockholm-sweden-august-orange-st-generation-ford-mustang-mach-low-profile-view-2499582647.jpg'
  },
  {
    id: 3,
    title: 'Original Artwork Painting',
    description: 'Original artwork by renowned artist. Starting at $450.',
    image: 'https://www.shutterstock.com/shutterstock/photos/2485234667/display_1500/stock-photo-a-vintage-style-artwork-depicting-a-majestic-dragon-intricately-detailed-with-shimmering-scales-in-2485234667.jpg'
  },
  {
    id: 4,
    title: 'Luxury Designer Handbag',
    description: 'Limited edition designer handbag. Starting at $700.',
    image: 'https://www.shutterstock.com/shutterstock/photos/2033802905/display_1500/stock-photo-happy-smiling-fashionable-woman-wearing-trendy-pink-fuchsia-color-suit-orange-sunglasses-strappy-2033802905.jpg'
  },
  {
    id: 5,
    title: 'Autographed Football Jersey',
    description: 'Signed football jersey. Starting at $250.',
    image: 'https://www.shutterstock.com/shutterstock/photos/2598025273/display_1500/stock-photo-vatican-vatican-argentina-jersey-as-a-gift-to-pope-francis-from-diego-maradona-2598025273.jpg'
  },
  {
    id: 6,
    title: 'Vintage Camera',
    description: 'Rare vintage camera. Starting at $350.',
    image: 'https://www.shutterstock.com/shutterstock/photos/197574791/display_1500/stock-photo-old-retro-camera-on-vintage-wooden-boards-abstract-background-197574791.jpg'
  }
];

const Main = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">BidMaster</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#about">About</a>
              </li>
              <li className="nav-item">
                <NavLink to="/login" className="nav-link">Login</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/signup" className="nav-link">Signup</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container text-center py-5">
        <h1 className="display-4 mb-3">Welcome to BidMaster!</h1>
        <p className="lead mb-4">
          Join the best online bidding platform. Place bids, win auctions, and enjoy great deals!
        </p>
      </div>

      {/* Bidding Items Section */}
      <div className="container py-5">
        <h2 className="text-center mb-4">Featured Auctions</h2>
        <div className="row">
          {auctionItems.map(item => (
            <div className="col-md-4 mb-4" key={item.id}>
              <div className="card h-100 auction-card">
                <img
                  src={`${item.image}?w=400&h=300&fit=crop`}
                  className="card-img-top"
                  alt={item.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.description}</p>
                  <Link
                    to="/login"
                    className="btn btn-primary mt-auto"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Login to bid");
                      window.location.href = "/login";
                    }}
                  >
                    Bid Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="container py-5">
        <h2 className="text-center mb-4">About Us</h2>
        <p className="text-center">
          BidMaster is an innovative online bidding platform designed to offer seamless and secure auction experiences.
          Our mission is to connect buyers and sellers from around the world and provide a transparent bidding process.
          At BidMaster, we believe in transforming the auction experience into something exciting, secure, and seamless. Founded with a passion for connecting buyers and sellers globally, our platform offers a transparent, user-friendly space to bid on unique, high-quality items. Whether you're a collector, enthusiast, or just looking for a great deal, BidMaster provides a trusted environment where you can confidently place bids and win auctions. Our mission is to empower users with fair bidding opportunities, real-time updates, and a wide range of products — making online auctions more accessible and thrilling than ever before.
        </p>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-white text-center py-3">
        &copy; {new Date().getFullYear()} BidMaster. All rights reserved.
      </footer>
    </div>
  );
};

export default Main;
