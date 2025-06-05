import React, { useState } from 'react';
import { calculateAllBreakdowns } from './utils/pricing';

function App() {
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [teams, setTeams] = useState(1);
  const [kpHours, setKpHours] = useState(0);

  const { min, max } = calculateAllBreakdowns(adults, children, teams, kpHours);

  return (
    <div>
      <h1>Escape Room Price Calculator</h1>
      <div>
        <label>Adults:</label>
        <input
          type="number"
          value={adults}
          onChange={(e) => setAdults(parseInt(e.target.value) || 0)}
          onFocus={(e) => e.target.select()}
        />
        <label>Children:</label>
        <input
          type="number"
          value={children}
          onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
          onFocus={(e) => e.target.select()}
        />
        <label>Teams:</label>
        <input
          type="number"
          value={teams}
          onChange={(e) => setTeams(parseInt(e.target.value) || 1)}
          onFocus={(e) => e.target.select()}
        />
        <label>KP Hours:</label>
        <input
          type="number"
          value={kpHours}
          onChange={(e) => setKpHours(parseInt(e.target.value) || 0)}
          onFocus={(e) => e.target.select()}
        />
      </div>

      <div>
        <h2>Minimum Price: {min.totalPrice.toFixed(2)}€</h2>
        {min.teamBreakdowns.map((team, index) => (
          <p key={'min-' + index}>
            Team {index + 1}: {team.adults} Adults, {team.children} Children → {team.price.toFixed(2)}€
          </p>
        ))}
        <h2>Maximum Price: {max.totalPrice.toFixed(2)}€</h2>
        {max.teamBreakdowns.map((team, index) => (
          <p key={'max-' + index}>
            Team {index + 1}: {team.adults} Adults, {team.children} Children → {team.price.toFixed(2)}€
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
