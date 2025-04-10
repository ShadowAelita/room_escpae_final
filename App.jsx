import React, { useState } from 'react';
import './index.css';

const App = () => {
  const [adults, setAdults] = useState('');
  const [children, setChildren] = useState('');
  const [kpOption, setKpOption] = useState("none");
  const [teams, setTeams] = useState('1');
  const [showBreakdown, setShowBreakdown] = useState(false); // State to toggle the breakdown

  const parsedAdults = parseInt(adults) || 0;
  const parsedChildren = parseInt(children) || 0;
  const parsedTeams = Math.max(parseInt(teams) || 1, 1);

  // Split adults and children into teams with at least 3 people in each team
  const distributePeopleIntoTeams = (adultsLeft, childrenLeft, teamsRemaining) => {
    let distribution = [];
    let totalPeople = adultsLeft + childrenLeft;

    // Each team needs at least 3 people
    let peoplePerTeam = Math.floor(totalPeople / teamsRemaining);
    let remainder = totalPeople % teamsRemaining;

    // Distribute people across teams
    for (let i = 0; i < teamsRemaining; i++) {
      let adultsInTeam = 0;
      let childrenInTeam = peoplePerTeam;

      // If there are more people left to distribute, add 1 more person to this team
      if (remainder > 0) {
        childrenInTeam += 1;
        remainder--;
      }

      // Place as many adults as we can in the team (if possible)
      if (adultsLeft > 0 && childrenInTeam < 3) {
        let adultsToAdd = Math.min(adultsLeft, 3 - childrenInTeam);
        adultsInTeam += adultsToAdd;
        childrenInTeam = 3 - adultsInTeam;
      }

      // Adjust the distribution for adults and children
      adultsLeft -= adultsInTeam;
      childrenLeft -= childrenInTeam;
      distribution.push([adultsInTeam, childrenInTeam]);
    }
    return distribution;
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

  // Generate min and max price distributions
  const generatePossibleDistributions = () => {
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let minPriceDistribution = null;
    let maxPriceDistribution = null;

    // Find the min and max price for valid distributions
    const distributions = distributePeopleIntoTeams(parsedAdults, parsedChildren, parsedTeams);
    let totalMinPrice = 0;
    let totalMaxPrice = 0;
    let minPriceBreakdown = [];
    let maxPriceBreakdown = [];

    // Calculate min price (min adults in each team)
    for (let i = 0; i < distributions.length; i++) {
      const [adultsInTeam, childrenInTeam] = distributions[i];
      const minPriceForTeam = calculateTeamPrice(adultsInTeam, childrenInTeam);
      totalMinPrice += minPriceForTeam;
      minPriceBreakdown.push(`Team ${i + 1}: Adults = ${adultsInTeam}, Children = ${childrenInTeam}, Price = ${minPriceForTeam} €`);
    }

    // Calculate max price (max adults in each team)
    let maxDistributions = distributePeopleIntoTeams(parsedAdults, parsedChildren, parsedTeams);
    for (let i = 0; i < maxDistributions.length; i++) {
      const [adultsInTeam, childrenInTeam] = maxDistributions[i];
      const maxPriceForTeam = calculateTeamPrice(adultsInTeam, childrenInTeam);
      totalMaxPrice += maxPriceForTeam;
      maxPriceBreakdown.push(`Team ${i + 1}: Adults = ${adultsInTeam}, Children = ${childrenInTeam}, Price = ${maxPriceForTeam} €`);
    }

    return {
      minPrice: totalMinPrice,
      maxPrice: totalMaxPrice,
      minPriceBreakdown,
      maxPriceBreakdown,
    };
  };

  // Get the distributions
  const { minPrice, maxPrice, minPriceBreakdown, maxPriceBreakdown } = generatePossibleDistributions();

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

        <button 
          onClick={() => setShowBreakdown(!showBreakdown)} 
          style={{ marginTop: '10px', display: 'inline-block', padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {showBreakdown ? 'Hide Breakdown' : 'Show Breakdown'}
        </button>

        {showBreakdown && (
          <div>
            <h4>Price Breakdown:</h4>
            <div>
              <strong>Min Price Breakdown:</strong>
              <ul>
                {minPriceBreakdown && minPriceBreakdown.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            </div>
            {parsedTeams > 1 && (
              <div>
                <strong>Max Price Breakdown:</strong>
                <ul>
                  {maxPriceBreakdown && maxPriceBreakdown.map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

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
