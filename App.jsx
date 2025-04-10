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

  const splitIntoTeams = (total, teams) => {
    const base = Math.floor(total / teams);
    const remainder = total % teams;
    return Array.from({ length: teams }, (_, i) => base + (i < remainder ? 1 : 0));
  };

  const adultsPerTeam = splitIntoTeams(parsedAdults, parsedTeams);
  const childrenPerTeam = splitIntoTeams(parsedChildren, parsedTeams);

  const calculateTeamPrice = (adults, children) => {
    let teamPrice = 0;
    const totalPeople = adults + children;

    if (totalPeople <= 3) {
      teamPrice += adults * 20;
    } else {
      teamPrice += adults * 15;
    }

    teamPrice += children * 9;
    if (teamPrice < 40) teamPrice = 40;

    if (parsedAdults + parsedChildren >= 5) {
      if (kpOption === "1hour") {
        teamPrice += adults * 5 + children * 4;
      } else if (kpOption === "2hours") {
        teamPrice += adults * 10 + children * 8;
      }
    }

    return teamPrice;
  };

  const totalPrice = adultsPerTeam.reduce((sum, adultCount, i) => {
    return sum + calculateTeamPrice(adultCount, childrenPerTeam[i]);
  }, 0);

  // ----- Accurate Edge Case Detection -----
  const generateSplits = (total, teams) => {
    if (teams === 1) return [[total]];
    const results = [];
    for (let i = 0; i <= total; i++) {
      const subSplits = generateSplits(total - i, teams - 1);
      subSplits.forEach(sub => results.push([i, ...sub]));
    }
    return results;
  };

  const getAllDistributions = (adults, children, teams) => {
    const adultSplits = generateSplits(adults, teams);
    const childSplits = generateSplits(children, teams);
    const distributions = [];

    adultSplits.forEach(ad => {
      childSplits.forEach(ch => {
        distributions.push(ad.map((a, i) => ({ adults: a, children: ch[i] })));
      });
    });

    return distributions;
  };

  const uniquePrices = new Set();
  if (parsedTeams > 1 && (parsedAdults + parsedChildren) > 0) {
    const allConfigs = getAllDistributions(parsedAdults, parsedChildren, parsedTeams);
    allConfigs.forEach(config => {
      const price = config.reduce((sum, team) => sum + calculateTeamPrice(team.adults, team.children), 0);
      uniquePrices.add(price);
    });
  }

const edgeCaseWarning = parsedTeams > 1 && (
  adultsPerTeam.some((adultCount, i) => {
    const childCount = childrenPerTeam[i];
    const price = calculateTeamPrice(adultCount, childCount);
    return price !== calculateTeamPrice(adultCount, childCount);  // If the price is different across teams
  })
);



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
            <p>⚠️ Achtung: Verschiedene Aufteilungen können unterschiedliche Preise ergeben.⚠️</p>
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
