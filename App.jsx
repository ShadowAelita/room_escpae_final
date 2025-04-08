
import React, { useState } from "react";

export default function EscapeRoomCalculator() {
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [kpDuration, setKpDuration] = useState("none");

  const totalPeople = adults + children;

  const basePrice = (() => {
    if (totalPeople < 2) return "-";
    const adultRate = totalPeople <= 3 ? 20 : 15;
    const price = adults * adultRate + children * 9;
    return Math.max(price, 40);
  })();

  const kpAvailable = totalPeople >= 5;

  const kpPrice = (() => {
    if (!kpAvailable || kpDuration === "none" || basePrice === "-") return 0;
    const rate = kpDuration === "2h" ? 2 : 1;
    return (adults * 5 + children * 4) * rate;
  })();

  const totalPrice = basePrice === "-" ? "-" : basePrice + kpPrice;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-2xl space-y-4 text-center">
      <h2 className="text-xl font-bold">Escape Room Price Calculator</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Adults</label>
          <input
            type="number"
            min="0"
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Children</label>
          <input
            type="number"
            min="0"
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">KP Duration</label>
        <select
          value={kpDuration}
          onChange={(e) => setKpDuration(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
        >
          <option value="none">None</option>
          <option value="1h" disabled={!kpAvailable}>1 hour</option>
          <option value="2h" disabled={!kpAvailable}>2 hours</option>
        </select>
      </div>

      <div className="text-left text-sm space-y-1 mt-4">
        <p><strong>Base Price:</strong> {basePrice === "-" ? "Not enough players" : `${basePrice}€`}</p>
        <p><strong>KP Price:</strong> {kpPrice}€</p>
        <p className="text-lg font-semibold"><strong>Total Price:</strong> {totalPrice === "-" ? "-" : `${totalPrice}€`}</p>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        * KP available only if 5 or more people. 5€/adult, 4€/child per hour.
      </p>
    </div>
  );
}
