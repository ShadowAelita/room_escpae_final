const calculatePrice = () => {
  let totalPrice = 0;
  const totalPeople = adults + children;
  const teamCount = Math.max(1, parseInt(teams));

  const peoplePerTeam = Math.floor(totalPeople / teamCount);
  const remainder = totalPeople % teamCount;

  // Simulate team-by-team pricing
  for (let i = 0; i < teamCount; i++) {
    // Distribute remainder across first few teams
    const teamSize = peoplePerTeam + (i < remainder ? 1 : 0);

    // Estimate team composition (rough split based on proportion)
    const teamAdults = Math.round((adults / totalPeople) * teamSize);
    const teamChildren = teamSize - teamAdults;

    let teamPrice = 0;

    if (teamSize <= 3) {
      teamPrice += teamAdults * 20;
    } else {
      teamPrice += teamAdults * 15;
    }

    teamPrice += teamChildren * 9;

    totalPrice += teamPrice;
  }

  // KP pricing applies if total group is 5+ people
  if (totalPeople >= 5) {
    if (kpOption === "1hour") {
      totalPrice += adults * 5 + children * 4;
    } else if (kpOption === "2hours") {
      totalPrice += adults * 10 + children * 8;
    }
  }

  // Enforce minimum total price of €40
  return Math.max(totalPrice, 40);
};
