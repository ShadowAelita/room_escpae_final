import React, { useState } from 'react';
import './index.css';

const App = () => {
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [kpOption, setKpOption] = useState("none"); // "none", "1hour", "2hours"
  const [teams, setTeams] = useState(1);

  const calculatePrice = () => {
    let totalPrice = 0;
    const totalPeople = adults + children;
    const teamsCount = Math.max(parseInt(teams), 1);

    const baseAdultsPerTeam = Math.floor(adults / teamsCount);
    const baseChildrenPerTeam = Math.floor(children / teamsCount);
    const remainderAdults = adults % teamsCount;
    const remainderChildren = children % teamsCount;

    for (let i = 0; i < teamsCount; i++) {
      // Distribute remainder adults/children
      const adultsInTeam = baseAdultsPerTeam + (i < remainderAdults ? 1 : 0);
      const childrenInTeam = baseChildrenPerTeam + (i < remainderChildren ? 1 : 0);
      const teamSize = adultsInTeam + childrenInTeam;

      let teamPrice = 0;

      // Base price per team
      if (teamSize <= 3) {
        teamPrice += adultsInTeam * 20;
      } else {
        teamPrice += adultsInTeam * 15;
      }

      teamPrice += childrenInTeam * 9;

      // Minimum team price of 40€
      if (teamPrice < 40) teamPrice = 40;

      // KP pricing
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
            onChange={(e) => setAdults(parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>

        <div className="input-group">
          <label>Children:</label>
          <input
            type="number"
            value={children}
            onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>

        <div className="input-group">
          <label>Number of Teams:</label>
          <input
            type="number"
            value={teams}
            onChange={(e) => setTeams(parseInt(e.target.value) || 1)}
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
