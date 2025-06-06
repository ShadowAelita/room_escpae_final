import React, { useState } from "react";
import "./index.css";

function App() {
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [teams, setTeams] = useState(1);
  const [kpHours, setKpHours] = useState(0);
  const [teamCombinations, setTeamCombinations] = useState([]);

  const basePricePerTeam = 40;
  const childPrice = 9;
  const adultPrice = 15;
  const adultPriceSmallGroup = 20;
  const kpPricePerHourAdult = 5;
  const kpPricePerHourChild = 4;

  const calcTeamPrice = (a, c, kp) => {
    const totalPlayers = a + c;
    if (totalPlayers === 0) return 0;
    let priceAdults = totalPlayers <= 3 ? a * adultPriceSmallGroup : a * adultPrice;
    let priceChildren = c * childPrice;
    priceAdults += a * kp * kpPricePerHourAdult;
    priceChildren += c * kp * kpPricePerHourChild;
    const total = priceAdults + priceChildren;
    return total < basePricePerTeam ? basePricePerTeam : total;
  };

  const handleFocus = (e) => e.target.select();

  const handleCombinationChange = (index, field, value) => {
    const updated = [...teamCombinations];
    updated[index] = {
      ...updated[index],
      [field]: Number(value),
    };
    setTeamCombinations(updated);
  };

  const initializeTeams = (numTeams) => {
    const newTeams = Array.from({ length: numTeams }, () => ({ adults: 0, children: 0 }));
    setTeamCombinations(newTeams);
  };

  const handleTeamChange = (val) => {
    const t = Number(val);
    setTeams(t);
    initializeTeams(t);
  };

  return (
    <div className="app-container">
      <h2>Escape Room Price Calculator</h2>

      <div className="input-group">
        <label>
          Adults: 
          <input
            type="number"
            min="0"
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            onFocus={handleFocus}
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Children: 
          <input
            type="number"
            min="0"
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
            onFocus={handleFocus}
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Teams: 
          <input
            type="number"
            min="1"
            value={teams}
            onChange={(e) => handleTeamChange(e.target.value)}
            onFocus={handleFocus}
          />
        </label>
      </div>

      <div className="input-group kp-hours">
        <label>KP Hours: </label>
        {[0, 1, 2].map((hour) => (
          <button
            key={hour}
            onClick={() => setKpHours(hour)}
            className={kpHours === hour ? "btn-selected" : ""}
          >
            {hour}
          </button>
        ))}
      </div>

      <hr />

      {teams > 1 && (
        <div>
          <h3>Manual Team Assignment</h3>
          {teamCombinations.map((team, index) => (
            <div key={index} className="input-group">
              <label>Team {index + 1} - Adults: </label>
              <input
                type="number"
                min="0"
                value={team.adults}
                onChange={(e) => handleCombinationChange(index, "adults", e.target.value)}
                onFocus={handleFocus}
              />
              <label> Children: </label>
              <input
                type="number"
                min="0"
                value={team.children}
                onChange={(e) => handleCombinationChange(index, "children", e.target.value)}
                onFocus={handleFocus}
              />
              <span>
                → {calcTeamPrice(team.adults, team.children, kpHours).toFixed(2)}€
              </span>
            </div>
          ))}
          <strong>
            Total: {teamCombinations.reduce((sum, t) => sum + calcTeamPrice(t.adults, t.children, kpHours), 0).toFixed(2)}€
          </strong>
        </div>
      )}
    </div>
  );
}

export default App;
