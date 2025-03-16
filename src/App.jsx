import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import AboutUs from './Components/AboutUs';
import Login from './Components/Login';
import Auction from './Components/Auction';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auction" element={<Auction />} />
      </Routes>
    </Router>
  );
}

export default App;
