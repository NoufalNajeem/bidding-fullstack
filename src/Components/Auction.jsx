import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./Auction.css";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket"],
});

const Auction = () => {
  const [cars, setCars] = useState([]);
  const [bidAmount, setBidAmount] = useState({});
  const [buyers, setBuyers] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    itemname: "",
    itemprice: "",
    description: "",
    image: null,
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchOpenAuctions = async () => {
      try {
        const response = await fetch("http://localhost:5000/items/open");
        const data = await response.json();
        if (response.ok) {
          setCars(
            data.map((car) => ({
              ...car,
              timeRemaining: calculateTimeRemaining(car.createddate),
            }))
          );
        } else {
          console.error("Failed to fetch auction items:", data.error);
        }
      } catch (error) {
        console.error("Error fetching open auctions:", error);
      }
    };

    fetchOpenAuctions();

    socket.on("bidUpdate", ({ itemId, newBid }) => {
      setCars((prevCars) =>
        prevCars.map((car) =>
          car._id === itemId ? { ...car, bidprice: newBid } : car
        )
      );
    });

    const interval = setInterval(() => {
      setCars((prevCars) =>
        prevCars.map((car) => ({
          ...car,
          timeRemaining: calculateTimeRemaining(car.createddate),
        }))
      );
    }, 1000);

    return () => {
      socket.off("bidUpdate");
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    cars.forEach((car) => {
      if (car.userwhobuyed) {
        fetchBuyerDetails(car.userwhobuyed);
      }
    });
  }, [cars]);

  const fetchBuyerDetails = async (buyerId) => {
    if (!buyerId || buyers[buyerId]) return; // Skip if already fetched

    try {
      const response = await fetch(`http://localhost:5000/users/${buyerId}`);
      const data = await response.json();
      if (response.ok) {
        setBuyers((prev) => ({
          ...prev,
          [buyerId]: `${data.firstname} ${data.lastname}`,
        }));
      }
    } catch (error) {
      console.error("Error fetching buyer details:", error);
    }
  };

  const calculateTimeRemaining = (createdDate) => {
    const createdTime = new Date(createdDate).getTime();
    //const endTime = createdTime + 24 * 60 * 60 * 1000; // 24 hours countdown
    const endTime = createdTime + 2 * 60 * 1000; 
    const now = new Date().getTime();
    const timeDiff = endTime - now;

    if (timeDiff <= 0) return "00:00:00";

    const hours = String(Math.floor((timeDiff / (1000 * 60 * 60)) % 24)).padStart(2, "0");
    const minutes = String(Math.floor((timeDiff / (1000 * 60)) % 60)).padStart(2, "0");
    const seconds = String(Math.floor((timeDiff / 1000) % 60)).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  const handleBid = (carId, currentHighestBid) => {
    const bidValue = parseFloat(bidAmount[carId]);

    if (!bidValue || bidValue <= currentHighestBid) {
      alert("Please enter a bid higher than the current highest bid.");
      return;
    }

    setCars((prevCars) =>
      prevCars.map((car) =>
        car._id === carId ? { ...car, bidprice: bidValue } : car
      )
    );

    socket.emit("placeBid", { itemId: carId, newBid: bidValue, userId });
    setBidAmount((prev) => ({ ...prev, [carId]: "" }));
  };

  const handleFormChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleUpload = async () => {
    const data = new FormData();
    data.append("itemname", formData.itemname);
    data.append("itemprice", formData.itemprice);
    data.append("description", formData.description);
    data.append("image", formData.image);
    data.append("auctionstatus", "open");
    data.append("userwhouploded", userId);

    try {
      const response = await fetch("http://localhost:5000/items", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Item added successfully!");
        setShowPopup(false);
        setFormData({ itemname: "", itemprice: "", description: "", image: null });
        setCars([...cars, result.item]);
      } else {
        alert("Error uploading item: " + result.error);
      }
    } catch (error) {
      console.error("Error uploading item:", error);
    }
  };

  return (
    <div className="live-auction-container">
      <header className="header">
        <Link to="/about" className="about-link">About Us</Link>
        <div className="user-info">
          <span className="username">Welcome {username}</span>
          <button className="add-car-btn" onClick={() => setShowPopup(true)}>Add New</button>
          <button className="logout-btn" onClick={() => {
            localStorage.clear();
            navigate("/Login");
          }}>Logout</button>
        </div>
      </header>

      <div className="car-listings">
        {cars.length > 0 ? (
          cars.map((car) => (
            <div key={car._id} className="car-card">
              {car.timeRemaining === "00:00:00" ? (
                <div className="auction-timer sold">Sold</div>
              ) : (
                <div className="auction-timer">Time Left: {car.timeRemaining}</div>
              )}
              <img src={`http://localhost:5000${car.imageUrl}`} alt={car.itemname} className="car-image" />
              <h3>{car.itemname}</h3>
              <p><strong>Starting Price:</strong> ${car.itemprice}</p>
              <p><strong>Highest Bid:</strong> ${car.bidprice || car.itemprice}</p>
              <p>{car.description}</p>

              {car.timeRemaining !== "00:00:00" ? (
                <div className="bid-input-container">
                  <input
                    type="number"
                    placeholder="Enter bid amount"
                    value={bidAmount[car._id] || ""}
                    onChange={(e) => setBidAmount({ ...bidAmount, [car._id]: e.target.value })}
                  />
                  <button className="bid-btn" onClick={() => handleBid(car._id, car.bidprice || car.itemprice)}>
                    Bid
                  </button>
                </div>
              ) : (
                <p className="buyer-name"><strong>Bought by:</strong> {buyers[car.userwhobuyed] || "Unknown"}</p>
              )}
            </div>
          ))
        ) : (
          <p>No open auction items available.</p>
        )}
      </div>

      {showPopup && (
        <div className="upload-popup">
          <div className="popup-content">
            <h3>Upload New Item</h3>
            <input type="text" name="itemname" placeholder="Item Name" onChange={handleFormChange} />
            <input type="number" name="itemprice" placeholder="Starting Price" onChange={handleFormChange} />
            <textarea name="description" placeholder="Description" onChange={handleFormChange}></textarea>
            <input type="file" name="image" accept="image/*" onChange={handleFormChange} />
            <button className="upload-btn" onClick={handleUpload}>Upload</button>
            <button className="close-btn" onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auction;
