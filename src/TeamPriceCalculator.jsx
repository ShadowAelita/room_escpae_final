import React, { useState } from "react";
import "./index.css";

function App() {
  // ... your existing state and functions unchanged ...

  const { minSplit, maxSplit } = calculateBreakdown();

  // Calculate even split price (same as before)
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

  const handleFocus = (e) => e.target.select();

  // Check if min and max totals differ (show warning if yes)
  const priceVaries = minSplit && maxSplit && minSplit.total !== maxSplit.total;

  return (
    <div className="app-container">
      <h2>Escape Room Price Calculator</h2>

      {/* Warning if price varies */}
      {priceVaries && (
        <div className="warning-message">
          Team Price varies with different combinations
        </div>
      )}

      {/* Inputs */}
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

      {/* Always show Even Split Price */}
      <h3>Even Split Price</h3>
      {evenSplitTeams.map((team, i) => (
        <p key={"even" + i}>
          Team {i + 1}: {team.adults} Adults, {team.children} Children →{" "}
          {calcTeamPrice(team.adults, team.children, kpHours).toFixed(2)}€
        </p>
      ))}
      <strong>Total: {evenTotal.toFixed(2)}€</strong>

      {/* Toggle to show min/max breakdown */}
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
