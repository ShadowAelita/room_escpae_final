
import React, { useState } from 'react';

export default function TeamPriceCalculator() {
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [teams, setTeams] = useState(1);
  const [hours, setHours] = useState(0);

  // Calculate price per single team based on the rules
  const calculateTeamPrice = (a, c, h) => {
    const totalPlayers = a + c;
    const basePrice = 40;

    let adultPrice = 15;
    let childPrice = 9;

    // If total players 3 or less, adult price changes
    if (totalPlayers > 0 && totalPlayers <= 3) {
      adultPrice = 20;
    }

    let price = basePrice;
    if (totalPlayers > 0) {
      price = Math.max(basePrice, a * adultPrice + c * childPrice);
    }

    if (h > 0) {
      price += a * 5 * h + c * 4 * h;
    }

    return price;
  };

  // Calculate min/max price and team breakdown for given inputs
  const getBreakdown = () => {
    // Total adults and children must be split into the number of teams
    // We want min and max price per team by distributing adults and children

    const totalPlayers = adults + children;
    if (teams <= 0) return null;
    if (totalPlayers === 0) return null;

    // We want to find how to split adults and children into teams to minimize/maximize price per team
    // Simplest approach: evenly distribute adults and children across teams (floor division and remainder)
    // Then adjust remainder in a way to maximize or minimize price

    const baseAdultPerTeam = Math.floor(adults / teams);
    const adultRemainder = adults % teams;

    const baseChildPerTeam = Math.floor(children / teams);
    const childRemainder = children % teams;

    // Minimum price distribution: try to put less costly players on teams with remainders
    // Maximum price distribution: put more costly players on teams with remainders

    // Build minimum priced team: distribute remainder children first (since child is cheaper than adult)
    let minTeams = Array(teams).fill(null).map(() => ({a: baseAdultPerTeam, c: baseChildPerTeam}));
    for (let i = 0; i < childRemainder; i++) minTeams[i].c += 1;
    for (let i = childRemainder; i < childRemainder + adultRemainder; i++) minTeams[i].a += 1;

    // Build maximum priced team: distribute remainder adults first (adults more expensive)
    let maxTeams = Array(teams).fill(null).map(() => ({a: baseAdultPerTeam, c: baseChildPerTeam}));
    for (let i = 0; i < adultRemainder; i++) maxTeams[i].a += 1;
    for (let i = adultRemainder; i < adultRemainder + childRemainder; i++) maxTeams[i].c += 1;

    const minPrice = Math.min(...minTeams.map(team => calculateTeamPrice(team.a, team.c, hours)));
    const maxPrice = Math.max(...maxTeams.map(team => calculateTeamPrice(team.a, team.c, hours)));

    return {
      minPrice: minPrice.toFixed(2),
      maxPrice: maxPrice.toFixed(2),
      minTeams,
      maxTeams,
    };
  };

  const breakdown = getBreakdown();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Escape Room Team Price Calculator</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <label className="flex flex-col">
          Adults
          <input
            type="number"
            min="0"
            value={adults}
            onChange={e => setAdults(Math.max(0, parseInt(e.target.value) || 0))}
            className="mt-1 p-2 border rounded"
          />
        </label>

        <label className="flex flex-col">
          Children
          <input
            type="number"
            min="0"
            value={children}
            onChange={e => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
            className="mt-1 p-2 border rounded"
          />
        </label>

        <label className="flex flex-col">
          Number of Teams
          <input
            type="number"
            min="1"
            value={teams}
            onChange={e => setTeams(Math.max(1, parseInt(e.target.value) || 1))}
            className="mt-1 p-2 border rounded"
          />
        </label>

        <label className="flex flex-col">
          Hours of KP Packet
          <input
            type="number"
            min="0"
            value={hours}
            onChange={e => setHours(Math.max(0, parseInt(e.target.value) || 0))}
            className="mt-1 p-2 border rounded"
          />
        </label>
      </div>

      {breakdown ? (
        <div className="bg-white p-4 rounded border">
          <h2 className="text-xl font-semibold mb-2">Price Breakdown</h2>
          <p className="mb-1">
            Minimum Price per Team: <strong>€{breakdown.minPrice}</strong>
          </p>
          <ul className="mb-4">
            {breakdown.minTeams.map((team, idx) => (
              <li key={idx}>
                Team {idx + 1}: {team.a} Adults, {team.c} Children
              </li>
            ))}
          </ul>
          <p className="mb-1">
            Maximum Price per Team: <strong>€{breakdown.maxPrice}</strong>
          </p>
          <ul>
            {breakdown.maxTeams.map((team, idx) => (
              <li key={idx}>
                Team {idx + 1}: {team.a} Adults, {team.c} Children
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-center text-gray-600">Enter valid inputs to see price breakdown.</p>
      )}
    </div>
  );
}
