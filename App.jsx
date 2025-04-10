import React, { useState } from 'react';
import './index.css';

const App = () => {
  const [adults, setAdults] = useState('');
  const [children, setChildren] = useState('');
  const [kpOption, setKpOption] = useState("none");
  const [teams, setTeams] = useState('1');

  const parsedAdults = parseInt(adults) || 0;
  const parsedChildren = parseInt(children) || 0;
  const parsedTeams = Math.max(parseInt(teams) || 1, 1);

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
    const totalPeople = parsedAdults + parsedChildren;
    let minPrice = 0;
    let minPriceDistribution = [];

    // Split people evenly into two teams
    const teamSize = Math.floor(totalPeople / parsedTeams);
    let remainingPeople = totalPeople - teamSize * parsedTeams;

    // Ensure each team gets at least 3 people
    let teamDistribution = Array(parsedTeams).fill(teamSize);
    for (let i = 0; i < remainingPeople; i++) {
      teamDistribution[i]++;
    }

    // Calculate the minimum price based on team distribution
    for (let i = 0; i < parsedTeams; i++) {
      const adultsInTeam = Math.min(teamDistribution[i], parsedAdults);
      const childrenInTeam = teamDistribution[i] - adultsInTeam;
      minPriceDistribution.push([adultsInTeam, childrenInTeam]);
      minPrice += calculateTeamPrice(adultsInTeam, childrenInTeam);
    }

    return { minPrice, minPriceDistribution };
  };

  // Function to calculate the maximum price
  const calculateMaxPrice = () => {
    const totalPeople = parsedAdults + parsedChildren;
    let maxPrice = 0;
    let maxPriceDistribution = [];

    // Distribute the children to one team to create one underpriced team
    const teamSize = Math.floor(totalPeople / parsedTeams);
    let remainingPeople = totalPeople - teamSize * parsedTeams;

    // Ensure each team gets at least 3 people
    let teamDistribution = Array(parsedTeams).fill(teamSize);
    for (let i = 0; i < remainingPeople; i++) {
      teamDistribution[i]++;
    }

    // Calculate the maximum price based on team distribution
    for (let i = 0; i < parsedTeams; i++) {
      let adultsInTeam = 0;
      let childrenInTeam = 0;

      if (i === 0) {
        // Team 1 will have as many children as possible, and minimum adults
        childrenInTeam = Math.min(parsedChildren, teamDistribution[i]);
        childrenInTeam = Math.max(childrenInTeam, 3); // Ensure at least 3 people
        adultsInTeam = Math.max(teamDistribution[i] - childrenInTeam, 0);
      } else {
        // Team 2 gets the remaining people
        childrenInTeam = Math.max(teamDistribution[i] - parsedAdults, 0);
        adultsInTeam = teamDistribution[i] - childrenInTeam;
      }

      maxPriceDistribution.push([adultsInTeam, childrenInTeam]);
      maxPrice += calculateTeamPrice(adultsInTeam, childrenInTeam);
    }

    return { maxPrice, maxPriceDistribution };
  };

  // Calculate minimum and maximum prices
  const { minPrice, minPriceDistribution } = calculateMinPrice();
  const { maxPrice, maxPriceDistribution } = calculateMaxPrice();

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

        <div className="result">
          <h3>Total Price: {minPrice} € (Min) / {maxPrice} € (Max)</h3>
        </div>

        <div>
          <strong>Min Price Breakdown:</strong>
          <ul>
            {minPriceDistribution.map((line, index) => (
              <li key={index}>Team {index + 1}: Adults = {line[0]}, Children = {line[1]}, Price = {calculateTeamPrice(line[0], line[1])} €</li>
            ))}
          </ul>
        </div>

        <div>
          <strong>Max Price Breakdown:</strong>
          <ul>
            {maxPriceDistribution.map((line, index) => (
              <li key={index}>Team {index + 1}: Adults = {line[0]}, Children = {line[1]}, Price = {calculateTeamPrice(line[0], line[1])} €</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
