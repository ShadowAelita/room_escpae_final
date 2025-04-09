import React, { useState } from 'react';
import './index.css';

const App = () => {
  // States for adults, children, KP option (No KP, 1 hour, 2 hours)
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [kpOption, setKpOption] = useState("none"); // "none", "1hour", "2hours"

  // Function to calculate the total price
  const calculatePrice = () => {
    let price = 0;

    // Calculate base price based on adults and children
    if (adults + children <= 3) {
      price += adults * 20;
    } else {
      price += adults * 15;
    }

    price += children * 9;

    // Apply minimum price of 40€
    if (price < 40) price = 40;

    // Calculate KP pricing based on selection
    if (adults + children >= 5) {
      if (kpOption === "1hour") {
        price += adults * 5 + children * 4; // 1 hour KP
      } else if (kpOption === "2hours") {
        price += (adults * 10 + children * 8); // 2 hours KP
      }
    }

    return price;
  };

  return (
    <div className="container">
      <h1>Escape Room Price Calculator</h1>

      <div className="inputs">
        <div className="input-group">
          <label>Adults:</label>
          <input
            type="number"
            value={adults}
            onChange={(e) => setAdults(parseInt(e.target.value))}
            min="0"
          />
        </div>

        <div className="input-group">
          <label>Children:</label>
          <input
            type="number"
            value={children}
            onChange={(e) => setChildren(parseInt(e.target.value))}
            min="0"
          />
        </div>

        <div className="input-group">
          <label>Choose KP Option:</label>
          <div>
            <label>
              <input
                type="radio"
                value="none"
                checked={kpOption === "none"}
                onChange={() => setKpOption("none")}
              />
              No KP
            </label>
            <label>
              <input
                type="radio"
                value="1hour"
                checked={kpOption === "1hour"}
                onChange={() => setKpOption("1hour")}
              />
              1 Hour KP
            </label>
            <label>
              <input
                type="radio"
                value="2hours"
                checked={kpOption === "2hours"}
                onChange={() => setKpOption("2hours")}
              />
              2 Hours KP
            </label>
          </div>
        </div>

        <div className="result">
          <h3>Total Price: {calculatePrice()} €</h3>
        </div>
      </div>
    </div>
  );
};

export default App;
