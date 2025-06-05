
import React, { useState } from 'react';

function TeamPriceCalculator() {
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [teams, setTeams] = useState(1);
  const [hoursKP, setHoursKP] = useState(0);

  const calculatePrices = () => {
    const results = [];

    for (let t = 0; t < teams; t++) {
      const totalPeople = adults + children;
      const adultsPerTeam = Math.floor(adults / teams) + (t < adults % teams ? 1 : 0);
      const childrenPerTeam = Math.floor(children / teams) + (t < children % teams ? 1 : 0);
      const peoplePerTeam = adultsPerTeam + childrenPerTeam;

      let teamPrice = 0;
      if (peoplePerTeam <= 3) {
        teamPrice += adultsPerTeam * 20 + childrenPerTeam * 9;
      } else {
        teamPrice += adultsPerTeam * 15 + childrenPerTeam * 9;
      }

      teamPrice += adultsPerTeam * hoursKP * 5 + childrenPerTeam * hoursKP * 4;
      teamPrice = Math.max(teamPrice, 40); // Minimum team price
      results.push({ adults: adultsPerTeam, children: childrenPerTeam, price: teamPrice });
    }

    const totalPrice = results.reduce((sum, r) => sum + r.price, 0);
    return { results, totalPrice };
  };

  const { results, totalPrice } = calculatePrices();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-center">Escape Room Pricing</h1>

      <div className="grid grid-cols-2 gap-4">
        <label>
          Adults
          <input type="number" value={adults} onChange={(e) => setAdults(parseInt(e.target.value) || 0)}
                 className="w-full border p-2 rounded" min="0" />
        </label>

        <label>
          Children
          <input type="number" value={children} onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                 className="w-full border p-2 rounded" min="0" />
        </label>

        <label>
          Teams
          <input type="number" value={teams} onChange={(e) => setTeams(Math.max(1, parseInt(e.target.value) || 1))}
                 className="w-full border p-2 rounded" min="1" />
        </label>

        <label>
          KP Hours
          <input type="number" value={hoursKP} onChange={(e) => setHoursKP(parseInt(e.target.value) || 0)}
                 className="w-full border p-2 rounded" min="0" />
        </label>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Price Breakdown</h2>
        <ul className="list-disc list-inside space-y-1">
          {results.map((r, i) => (
            <li key={i}>
              Team {i + 1}: {r.adults} Adults, {r.children} Children → {r.price.toFixed(2)}€
            </li>
          ))}
        </ul>
        <p className="font-bold mt-2">Total: {totalPrice.toFixed(2)}€</p>
      </div>
    </div>
  );
}

export default TeamPriceCalculator;
