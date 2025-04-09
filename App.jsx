import React, { useState } from 'react';
import './index.css';

const App = () => {
  const [adults, setAdults] = useState('');
  const [children, setChildren] = useState('');
  const [teams, setTeams] = useState(1);
  const [kpOption, setKpOption] = useState("none");

  const handleReset = () => {
    setAdults('');
    setChildren('');
    setTeams(1);
    setKpOption('none');
  };

  const calculatePrice = () => {
    const adultCount = parseInt(adults) || 0;
    const childCount = parseInt(children) || 0;
    const teamCount = Math.max(parseInt(teams) || 1, 1);

    let totalPrice = 0;
    const baseAdultsPerTeam = Math.floor(adultCount / teamCount);
    const baseChildrenPerTeam = Math.floor(childCount / teamCount);
    const remainderAdults = adultCount % teamCount;
    const remainderChildren = childCount % teamCount;

    for (let i = 0; i < teamCount; i++) {
      const adultsInTeam = baseAdultsPerTeam + (i < remainderAdults ? 1 : 0);
      const childrenInTeam = baseChildrenPerTeam + (i < remainderChildren ? 1 : 0);
      const teamSize = adultsInTeam + childrenInTeam;

      let teamPrice = 0;

      if (teamSize <= 3) {
        teamPrice += adultsInTeam * 20;
      } else {
        teamPrice += adultsInTeam * 15;
      }

      teamPrice += childrenInTeam * 9;
      if (teamPrice < 40) teamPrice = 40;

      if (teamSize >= 5) {
        if (kpOption === "1hour") {
          teamPrice += adultsInTeam * 5 + childrenInTeam * 4;
        } else if (kpOption === "2hours") {
          teamPrice += adultsInTeam * 10 + childrenInTeam * 8;
        }
      }

      totalPrice += teamPrice;
    }

    return totalPrice;
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
            onChange={(e) => setAdults(e.target.value)}
            min="0"
          />
        </div>

        <div className="input-group">
          <label>Children:</label>
          <input
            type="number"
            value={children}
            onChange={(e) => setChildren(e.target.value)}
            min="0"
          />
        </div>

        <div className="input-group">
          <label>Number of Teams:</label>
          <input
            type="number"
            value={teams}
            onChange={(e) => setTeams(e.target.value)}
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

        <div className="input-group">
          <button onClick={handleReset} className="reset-button">
            Reset
          </button>
        </div>

        <div className="result">
          <h3>Total Price: {calculatePrice()} €</h3>
        </div>
      </div>
    </div>
  );
};

export default App;
