import React, { useState } from 'react';
import './index.css';

const App = () => {
  const [adults, setAdults] = useState();
  const [children, setChildren] = useState();
  const [teams, setTeams] = useState(1);
  const [kpOption, setKpOption] = useState("none");

  const calculatePrice = () => {
    if (!adults || !children || !teams || teams < 1) return 0;

    const totalPeople = adults + children;
    const adultsPerTeam = Math.floor(adults / teams);
    const remainingAdults = adults % teams;
    const childrenPerTeam = Math.floor(children / teams);
    const remainingChildren = children % teams;

    let price = 0;

    for (let i = 0; i < teams; i++) {
      const teamAdults = adultsPerTeam + (i < remainingAdults ? 1 : 0);
      const teamChildren = childrenPerTeam + (i < remainingChildren ? 1 : 0);
      const teamSize = teamAdults + teamChildren;

      let teamPrice = 0;
      teamPrice += teamAdults * (teamSize <= 3 ? 20 : 15);
      teamPrice += teamChildren * 9;

      // Minimum per team is 30€
      if (teamPrice < 30) teamPrice = 30;

      price += teamPrice;
    }

    // KP pricing for entire group (only if total people ≥ 5)
    if (totalPeople >= 5) {
      if (kpOption === "1hour") {
        price += adults * 5 + children * 4;
      } else if (kpOption === "2hours") {
        price += adults * 10 + children * 8;
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
          <label>Teams:</label>
          <input
            type="number"
            value={teams}
            onChange={(e) => setTeams(Math.max(1, parseInt(e.target.value)))}
            min="1"
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
