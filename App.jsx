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

  // Split adults and children into teams
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

  // Generate all possible distributions and calculate their corresponding prices
  const generatePossibleDistributions = () => {
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let minPriceDistribution = null;
    let maxPriceDistribution = null;

    // Loop over all possible combinations of adults and children per team
    const distributions = [];
    for (let i = 0; i < Math.pow(2, parsedTeams); i++) {
      let adultDist = [];
      let childDist = [];
      
      // Assign adults and children to each team based on the binary representation of i
      for (let j = 0; j < parsedTeams; j++) {
        adultDist.push(i & (1 << j) ? 1 : 0);
        childDist.push(i & (1 << (j + parsedTeams)) ? 1 : 0);
      }

      // Calculate price for this distribution
      let totalPrice = 0;
      let breakdown = [];
      for (let j = 0; j < parsedTeams; j++) {
        const teamAdults = adultDist[j] * parsedAdults;
        const teamChildren = childDist[j] * parsedChildren;
        const price = calculateTeamPrice(teamAdults, teamChildren);
        totalPrice += price;
        breakdown.push(`Team ${j + 1}: Adults = ${teamAdults}, Children = ${teamChildren}, Price = ${price} €`);
      }

      // Update min/max price
      if (totalPrice < minPrice) {
        minPrice = totalPrice;
        minPriceDistribution = breakdown;
      }
      if (totalPrice > maxPrice) {
        maxPrice = totalPrice;
        maxPriceDistribution = breakdown;
      }
    }

    return {
      minPrice,
      maxPrice,
      minPriceDistribution,
      maxPriceDistribution
    };
  };

  // Get the distributions
  const { minPrice, maxPrice, minPriceDistribution, maxPriceDistribution } = generatePossibleDistributions();

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
          <h3>Total Price: {minPrice} € (Min) / {maxPrice} € (Max)</h3>
        </div>

        <div>
          <h4>Price Breakdown:</h4>
          <div>
            <strong>Min Price Breakdown:</strong>
            <ul>
              {minPriceDistribution && minPriceDistribution.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Max Price Breakdown:</strong>
            <ul>
              {maxPriceDistribution && maxPriceDistribution.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          </div>
        </div>

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
