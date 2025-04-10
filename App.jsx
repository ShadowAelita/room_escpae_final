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

  // Split adults and children into teams
  const adultsPerTeam = splitIntoTeams(parsedAdults, parsedTeams);
  const childrenPerTeam = splitIntoTeams(parsedChildren, parsedTeams);

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

  const totalPrice = adultsPerTeam.reduce((sum, adultCount, i) => {
    return sum + calculateTeamPrice(adultCount, childrenPerTeam[i]);
  }, 0);

  // Edge case warning check
  const edgeCaseWarning =
    parsedTeams > 1 &&
    (parsedAdults + parsedChildren >= 7) &&
    (parsedAdults > 0 && parsedChildren > 0) &&
    adultsPerTeam.some((adultsInTeam, i) => {
      const childrenInTeam = childrenPerTeam[i];
      const teamPrice = calculateTeamPrice(adultsInTeam, childrenInTeam);
      return teamPrice < 40;
    });

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
          <h3>Total Price: {totalPrice} €</h3>
        </div>

        {edgeCaseWarning && (
          <div style={{ color: 'orange', fontWeight: 'bold', marginTop: '10px' }}>
            <p>Warning: Teamaufteilung variiert Teampreis. Achten Sie auf die Teameinteilung, da dies den Preis beeinflussen könnte, insbesondere bei Teams mit mehr als 4 Erwachsenen und 4 Kindern.</p>
          </div>
        )}

        <button onClick={() => setShowBreakdown(!showBreakdown)} style={{ marginTop: '10px' }}>
          {showBreakdown ? 'Hide Breakdown' : 'Show Breakdown'}
        </button>

        {showBreakdown && (
          <div className="breakdown">
            <h4>Team Breakdown:</h4>
            {adultsPerTeam.map((adultCount, i) => {
              const childCount = childrenPerTeam[i];
              const price = calculateTeamPrice(adultCount, childCount);
              return (
                <div key={i}>
                  <strong>Team {i + 1}:</strong> {adultCount} Adults, {childCount} Children → {price} €
                </div>
              );
            })}
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
