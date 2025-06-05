import React, { useState } from "react";
import "./index.css"; // import the CSS for styling

function App() {
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [teams, setTeams] = useState(1);
  const [kpHours, setKpHours] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Pricing rules
  const basePricePerTeam = 40;
  const childPrice = 9;
  const adultPrice = 15;
  const adultPriceSmallGroup = 20; // if total players in team <= 3
  const kpPricePerHourAdult = 5;
  const kpPricePerHourChild = 4;

  // Calculate price for one team
  const calcTeamPrice = (a, c, kp) => {
    const totalPlayers = a + c;
    if (totalPlayers === 0) return 0;
    let priceAdults = 0;
    let priceChildren = 0;

    if (totalPlayers <= 3) {
      priceAdults = a * adultPriceSmallGroup;
    } else {
      priceAdults = a * adultPrice;
    }
    priceChildren = c * childPrice;

    // KP add-ons
    priceAdults += a * kp * kpPricePerHourAdult;
    priceChildren += c * kp * kpPricePerHourChild;

    const total = priceAdults + priceChildren;
    return total < basePricePerTeam ? basePricePerTeam : total;
  };

  // Generate all valid splits with min 2 people per team
  const generateSplits = (adultsLeft, childrenLeft, teamNum, currentSplit, results) => {
    if (teamNum === teams) {
      if (adultsLeft === 0 && childrenLeft === 0) {
        results.push([...currentSplit]);
      }
      return;
    }

    const maxAdults = adultsLeft;
    const maxChildren = childrenLeft;

    for (let a = 0; a <= maxAdults; a++) {
      for (let c = 0; c <= maxChildren; c++) {
        if (a + c >= 2) {
          currentSplit[teamNum] = { adults: a, children: c };
          generateSplits(adultsLeft - a, childrenLeft - c, teamNum + 1, currentSplit, results);
        }
      }
    }
  };

  const calculateBreakdown = () => {
    if (teams === 0) return { minSplit: null, maxSplit: null };

    const results = [];
    generateSplits(adults, children, 0, new Array(teams), results);

    if (results.length === 0) {
      return { minSplit: null, maxSplit: null };
    }

    const pricedSplits = results.map((split) => {
      let total = 0;
      split.forEach(({ adults, children }) => {
        total += calcTeamPrice(adults, children, kpHours);
      });
      return { split, total };
    });

    pricedSplits.sort((a, b) => a.total - b.total);
    const minSplit = pricedSplits[0];
    const maxSplit = pricedSplits[pricedSplits.length - 1];

    return { minSplit, maxSplit };
  };

  const { minSplit, maxSplit } = calculateBreakdown();

  // Calculate even split price (rough split adults & children per team)
  const evenAdults = Math.floor(adults / teams);
  const extraAdults = adults % teams;
  const evenChildren = Math.floor(children / teams);
  const extraChildren = children % teams;

  const evenSplitTeams = [];
  for (let i = 0; i < teams; i++) {
    evenSplitTeams.push({
      adults: evenAdults + (i < extraAdults ? 1 : 0),
      children: evenChildren + (i < extraChildren ? 1 : 0),
    });
  }
  const evenTotal = evenSplitTeams.reduce(
    (sum, team) => sum + calcTeamPrice(team.adults, team.children, kpHours),
    0
  );

  // Input auto-select handler
  const handleFocus = (e) => e.target.select();

  return (
    <div className="app-container">
      <h2>Escape Room Price Calculator</h2>
      <div className="input-group">
        <label>
          Adults:{" "}
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
          Children:{" "}
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
          Teams:{" "}
          <input
            type="number"
            min="1"
            value={teams}
            onChange={(e) => setTeams(Number(e.target.value))}
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

      {!showBreakdown && (
        <>
          <h3>Even Split Price</h3>
          {evenSplitTeams.map((team, i) => (
            <p key={"even" + i}>
              Team {i + 1}: {team.adults} Adults, {team.children} Children →{" "}
              {calcTeamPrice(team.adults, team.children, kpHours).toFixed(2)}€
            </p>
          ))}
          <strong>Total: {evenTotal.toFixed(2)}€</strong>
        </>
      )}

      <div className="toggle-breakdown">
        <label>
          <input
            type="checkbox"
            checked={showBreakdown}
            onChange={() => setShowBreakdown(!showBreakdown)}
          />{" "}
          Show Minimum and Maximum Price Breakdown
        </label>
      </div>

      {showBreakdown && !minSplit && <p>No valid splits found with minimum 2 players per team.</p>}

      {showBreakdown && minSplit && (
        <>
          <h3>Minimum Price Breakdown</h3>
          {minSplit.split.map((team, i) => (
            <p key={"min" + i}>
              Team {i + 1}: {team.adults} Adults, {team.children} Children →{" "}
              {calcTeamPrice(team.adults, team.children, kpHours).toFixed(2)}€
            </p>
          ))}
          <strong>Total: {minSplit.total.toFixed(2)}€</strong>
        </>
      )}

      {showBreakdown && maxSplit && maxSplit !== minSplit && (
        <>
          <h3>Maximum Price Breakdown</h3>
          {maxSplit.split.map((team, i) => (
            <p key={"max" + i}>
              Team {i + 1}: {team.adults} Adults, {team.children} Children →{" "}
              {calcTeamPrice(team.adults, team.children, kpHours).toFixed(2)}€
            </p>
          ))}
          <strong>Total: {maxSplit.total.toFixed(2)}€</strong>
        </>
      )}
    </div>
  );
}

export default App;
