import React, { useState } from 'react';
import './index.css';

const App = () => {
  const [adults, setAdults] = useState('');
  const [children, setChildren] = useState('');
  const [kpOption, setKpOption] = useState("none");
  const [teams, setTeams] = useState('1');
  const [showBreakdown, setShowBreakdown] = useState(false);

  const parsedAdults = parseInt(adults) || 0;
  const parsedChildren = parseInt(children) || 0;
  const parsedTeams = Math.max(parseInt(teams) || 1, 1);

  // Function to split people into teams
  const splitIntoTeams = (total, teams) => {
    const base = Math.floor(total / teams);
    const remainder = total % teams;
    return Array.from({ length: teams }, (_, i) => base + (i < remainder ? 1 : 0));
  };

  // Helper function to calculate the price for a team
  const calculateTeamPrice = (adults, children) => {
    let teamPrice = 0;

    if (adults + children <= 3) {
      teamPrice += adults * 20;
    } else {
      teamPrice += adults * 15;
    }

    teamPrice += children * 9;
    if (teamPrice < 40) teamPrice = 40;

    if (parsedAdults + parsedChildren >= 5) {
      if (kpOption === "1hour") {
        teamPrice += adults * 5 + children * 4; // 1 hour KP
      } else if (kpOption === "2hours") {
        teamPrice += adults * 10 + children * 8; // 2 hours KP
      }
    }

    return teamPrice;
  };

  // Function to calculate the minimum price
  const calculateMinPrice = () => {
    // Split adults and children into teams for minimum price
    const adultsPerTeam = splitIntoTeams(parsedAdults, parsedTeams);
    const childrenPerTeam = splitIntoTeams(parsedChildren, parsedTeams);

    let totalMinPrice = 0;
    adultsPerTeam.forEach((adultCount, i) => {
      const childCount = childrenPerTeam[i];
      let teamPrice = calculateTeamPrice(adultCount, childCount);
      
      // Make sure every team has at least 3 people, adjust if necessary
      if (adultCount + childCount < 3) {
        const deficit = 3 - (adultCount + childCount);
        // Try to balance the teams by adding more adults or children
        if (adultCount < childCount) {
          teamPrice = calculateTeamPrice(adultCount + deficit, childCount); // add more adults
        } else {
          teamPrice = calculateTeamPrice(adultCount, childCount + deficit); // add more children
        }
      }
      totalMinPrice += teamPrice;
    });

    return totalMinPrice;
  };

  // Function to calculate the maximum price
  const calculateMaxPrice = () => {
    // Split adults and children into teams for maximum price
    const adultsPerTeam = splitIntoTeams(parsedAdults, parsedTeams);
    const childrenPerTeam = splitIntoTeams(parsedChildren, parsedTeams);

    let totalMaxPrice = 0;
    adultsPerTeam.forEach((adultCount, i) => {
      const childCount = childrenPerTeam[i];
      let teamPrice = calculateTeamPrice(adultCount, childCount);
      
      // Ensure that at least one team gets charged the minimum possible amount (under 40€)
      if (adultCount + childCount >= 3) {
        if (adultCount < childCount) {
          teamPrice = calculateTeamPrice(adultCount, childCount);
        } else {
          teamPrice = calculateTeamPrice(adultCount, childCount);
        }
      }
      totalMaxPrice += teamPrice;
    });

    return totalMaxPrice;
  };

  // Calculate min and max price for the breakdown
  const minPrice = calculateMinPrice();
  const maxPrice = calculateMaxPrice();

  return (
    <div className="container">
      <h1>Escape Room Price Calculator</h1>

      <p style={{ color: 'red', fontWeight: 'bold' }}>
        Der Rechner kann Fehler machen, bei mehreren Teams auf Teamaufteilung achten!
      </p>

      <div className="inputs">
        <div className="input-group">
          <label>Adults:</label>
          <input
            type="number"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
            min="0"
            placeholder="0"
          />
        </div>

        <div className="input-group">
          <label>Children:</label>
          <input
            type="number"
            value={children}
            onChange={(e) => setChildren(e.target.value)}
            min="0"
            placeholder="0"
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

        <div className="result">
          <h3>Total Price: {minPrice} € / {maxPrice} €</h3>
        </div>

        {showBreakdown && (
          <div className="breakdown">
            <h4>Price Breakdown:</h4>
            <h5>Min Price Breakdown:</h5>
            <p>{minPrice} €</p>
            <h5>Max Price Breakdown:</h5>
            <p>{maxPrice} €</p>
          </div>
        )}

        <button onClick={() => setShowBreakdown(!showBreakdown)} style={{ marginTop: '10px' }}>
          {showBreakdown ? 'Hide Breakdown' : 'Show Breakdown'}
        </button>

        <button
          onClick={() => {
            setAdults('');
            setChildren('');
            setTeams('1');
            setKpOption('none');
            setShowBreakdown(false);
          }}
          style={{ marginTop: '20px' }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default App;
