import React, { useState } from "react";

function App() {
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [teams, setTeams] = useState(1);
  const [kpHours, setKpHours] = useState(0);

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
  // adultsLeft, childrenLeft = remaining adults/children to assign
  // teamNum = current team index (0-based)
  // currentSplit = array of {a, c} assigned per team so far
  // results = array of all valid splits
  const generateSplits = (adultsLeft, childrenLeft, teamNum, currentSplit, results) => {
    if (teamNum === teams) {
      // All teams assigned, check if all adults and children are assigned
      if (adultsLeft === 0 && childrenLeft === 0) {
        results.push([...currentSplit]);
      }
      return;
    }

    // For current team, try all combinations of adults and children such that:
    // - sum >= 2 (min team size)
    // - adultsLeft >= a
    // - childrenLeft >= c
    // Also, max total per team <= remaining players (just logical limit)
    const maxAdults = adultsLeft;
    const maxChildren = childrenLeft;

    for (let a = 0; a <= maxAdults; a++) {
      for (let c = 0; c <= maxChildren; c++) {
        if (a + c >= 2) {
          // Assign this split and recurse for next team
          currentSplit[teamNum] = { adults: a, children: c };
          generateSplits(adultsLeft - a, childrenLeft - c, teamNum + 1, currentSplit, results);
        }
      }
    }
  };

  // Get all splits and calculate prices, then find min and max total price
  const calculateBreakdown = () => {
    if (teams === 0) return { minSplit: null, maxSplit: null };

    const results = [];
    generateSplits(adults, children, 0, new Array(teams), results);

    if (results.length === 0) {
      return { minSplit: null, maxSplit: null };
    }

    // Map splits to total prices
    const pricedSplits = results.map((split) => {
      let total = 0;
      split.forEach(({ adults, children }) => {
        total += calcTeamPrice(adults, children, kpHours);
      });
      return { split, total };
    });

    // Find min and max total price splits
    pricedSplits.sort((a, b) => a.total - b.total);
    const minSplit = pricedSplits[0];
    const maxSplit = pricedSplits[pricedSplits.length - 1];

    return { minSplit, maxSplit };
  };

  const { minSplit, maxSplit } = calculateBreakdown();

  return (
    <div style={{ padding: 20 }}>
      <h2>Escape Room Price Calculator</h2>
      <div>
        <label>
          Adults:{" "}
          <input
            type="number"
            min="0"
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Children:{" "}
          <input
            type="number"
            min="0"
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Teams:{" "}
          <input
            type="number"
            min="1"
            value={teams}
            onChange={(e) => setTeams(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          KP Hours:{" "}
          <input
            type="number"
            min="0"
            value={kpHours}
            onChange={(e) => setKpHours(Number(e.target.value))}
          />
        </label>
      </div>

      <hr />

      {!minSplit && <p>No valid splits found with minimum 2 players per team.</p>}

      {minSplit && (
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

      {maxSplit && maxSplit !== minSplit && (
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
