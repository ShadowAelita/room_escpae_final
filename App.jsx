import React, { useState } from 'react';
import './index.css';

const App = () => {
  // States for adults, children, and KP
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [isKp, setIsKp] = useState(false);

  const calculatePrice = () => {
    // Calculate base price based on adults and children
    let price = 0;

    if (adults <= 3) {
      price += adults * 20;
    } else {
      price += adults * 15;
    }

    price += children * 9;

    // Apply minimum price of 40€
    if (price < 40) price = 40;

    // Calculate KP pricing
    if (adults + children >= 5 && isKp) {
      price += adults * 5 + children * 4;
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
          <label>
            Add KP (Optional, for 5 or more people):
            <input
              type="checkbox"
              checked={isKp}
              onChange={() => setIsKp(!isKp)}
            />
          </label>
        </div>

        <div className="result">
          <h3>Total Price: {calculatePrice()} €</h3>
        </div>
      </div>
    </div>
  );
};

export default App;
