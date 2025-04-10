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

  // Split people into teams
  const splitIntoTeams = (total, teams) => {
    const base = Math.floor(total / teams);
    const remainder = total % teams;
    return Array.from({ length: teams }, (_, i) => base + (i < remainder ? 1 : 0));
  };

  // Calculate the price for each team
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

  // Calculate Min and Max prices for the teams
  const calculateMinMaxPrice = () => {
    let minPrice = 0;
    let maxPrice = 0;

    // Calculate the minimum price: each team should have at least 3 people
    const minAdultsPerTeam = splitIntoTeams(parsedAdults, parsedTeams);
    const minChildrenPerTeam = splitIntoTeams(parsedChildren, parsedTeams);

    // Ensure all teams have at least 3 people
    for (let i = 0; i < parsedTeams; i++) {
      if (minAdultsPerTeam[i] + minChildrenPerTeam[i] < 3) {
        let remainingPeople = 3 - (minAdultsPerTeam[i] + minChildrenPerTeam[i]);
        // Fill the team with remaining people, prioritizing adults
        if (remainingPeople <= minChildrenPerTeam[i]) {
          minChildrenPerTeam[i] -= remainingPeople;
          minAdultsPerTeam[i] += remainingPeople;
        } else {
          minAdultsPerTeam[i] += minChildrenPerTeam[i];
          minChildrenPerTeam[i] = 0;
        }
      }
      // Calculate the min price for each team and add
      minPrice += calculateTeamPrice(minAdultsPerTeam[i], minChildrenPerTeam[i]);
    }

    // Maximum price calculation: split children and adults to maximize the price
    const maxAdultsPerTeam = [...minAdultsPerTeam];
    const maxChildrenPerTeam = [...minChildrenPerTeam];

    // Try to put as many children in one team to maximize the price
    maxChildrenPerTeam[0] = parsedChildren; // Put all children in the first team
    maxAdultsPerTeam[0] = Math.max(3, parsedAdults); // Ensure there are at least 3 people in the first team

    // Calculate the max price for each team
    for (let i = 0; i < parsedTeams; i++) {
      maxPrice += calculateTeamPrice(maxAdultsPerTeam[i], maxChildrenPerTeam[i]);
    }

    return { minPrice, maxPrice };
  };

  const { minPrice, maxPrice } = calculateMinMaxPrice();

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
          <h3>Total Price: {minPrice} €</h3>
        </div>

        {showBreakdown && (
          <div className="breakdown">
            <h4>Price Breakdown:</h4>
            <h5>Min Price Breakdown:</h5>
            {adultsPerTeam.map((adultCount, i) => {
              const childCount = childrenPerTeam[i];
              const price = calculateTeamPrice(adultCount, childCount);
              return (
                <div key={i}>
                  <strong>Team {i + 1}:</strong> {adultCount} Adults, {childCount} Children → {price} €
                </div>
              );
            })}
            <h5>Max Price Breakdown:</h5>
            {maxAdultsPerTeam.map((adultCount, i) => {
              const childCount = maxChildrenPerTeam[i];
              const price = calculateTeamPrice(adultCount, childCount);
              return (
                <div key={i}>
                  <strong>Team {i + 1}:</strong> {adultCount} Adults, {childCount} Children → {price} €
                </div>
              );
            })}
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
