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
  const [editMode, setEditMode] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [formData, setFormData] = useState({
    itemname: "",
    itemprice: "",
    description: "",
    image: null,
    endDate: "",
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
          setCars(data);
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

    return () => {
      socket.off("bidUpdate");
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
    if (!buyerId || buyers[buyerId]) return;

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
    if (formData.image) data.append("image", formData.image);
    data.append("auctionstatus", "open");
    data.append("userwhouploded", userId);
    data.append("endDate", new Date(formData.endDate).toISOString());

    try {
      let url = "http://localhost:5000/items";
      let method = "POST";

      if (editMode && editingItemId) {
        url = `http://localhost:5000/items/${editingItemId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        alert(editMode ? "Item updated successfully!" : "Item added successfully!");
        setShowPopup(false);
        setEditMode(false);
        setEditingItemId(null);
        setFormData({ itemname: "", itemprice: "", description: "", image: null, endDate: "" });

        const fetchResponse = await fetch("http://localhost:5000/items/open");
        const fetchData = await fetchResponse.json();
        setCars(fetchData);
      } else {
        alert("Error uploading item: " + result.error);
      }
    } catch (error) {
      console.error("Error uploading item:", error);
    }
  };

  const handleEdit = (car) => {
    setFormData({
      itemname: car.itemname,
      itemprice: car.itemprice,
      description: car.description,
      image: null,
      endDate: new Date(car.endDate).toISOString().slice(0, 16),
    });
    setEditingItemId(car._id);
    setEditMode(true);
    setShowPopup(true);
  };

  const handleDelete = async (carId) => {
    try {
      const response = await fetch(`http://localhost:5000/items/${carId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (response.ok) {
        alert("Item deleted successfully!");
        setCars(cars.filter((car) => car._id !== carId));
      } else {
        alert("Error deleting item: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="live-auction-container">
      <header className="header">
        <Link to="/about" className="about-link">About Us</Link>
        <div>
          <span className="username">Welcome {username}</span>
        </div>
        <div className="user-info">
          <button className="add-car-btn" onClick={() => {
            setShowPopup(true);
            setEditMode(false);
            setFormData({ itemname: "", itemprice: "", description: "", image: null, endDate: "" });
          }}>Add New</button>
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
              <img src={`http://localhost:5000${car.imageUrl}`} alt={car.itemname} className="car-image" />
              <h3>{car.itemname}</h3>
              <p><strong>Starting Price:</strong> ${car.itemprice}</p>
              <p><strong>Highest Bid:</strong> ${car.bidprice || car.itemprice}</p>
              <p>{car.description}</p>

              {car.userwhouploded === userId && (
                <div className="edit-delete-btns">
                  <button className="edit-btn" onClick={() => handleEdit(car)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(car._id)}>Delete</button>
                </div>
              )}

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
              <p className="buyer-name"><strong>Bought by:</strong> {buyers[car.userwhobuyed] || "Unknown"}</p>
            </div>
          ))
        ) : (
          <p>No open auction items available.</p>
        )}
      </div>

      {showPopup && (
        <div className="upload-popup">
          <div className="popup-content">
            <h3>{editMode ? "Edit Item" : "Upload New Item"}</h3>
            <input type="text" name="itemname" placeholder="Item Name" value={formData.itemname} onChange={handleFormChange} />
            <input type="number" name="itemprice" placeholder="Starting Price" value={formData.itemprice} onChange={handleFormChange} />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleFormChange}></textarea>
            <input type="file" name="image" accept="image/*" onChange={handleFormChange} />
            <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleFormChange} />
            <button className="upload-btn" onClick={handleUpload}>{editMode ? "Update" : "Upload"}</button>
            <button className="close-btn" onClick={() => { setShowPopup(false); setEditMode(false); }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auction;
