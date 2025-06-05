export function calculateAllBreakdowns(adults, children, teams, kpHours) {
  function distribute(total, parts) {
    if (parts === 1) return [[total]];
    const result = [];
    for (let i = 0; i <= total; i++) {
      for (const rest of distribute(total - i, parts - 1)) {
        result.push([i, ...rest]);
      }
    }
    return result;
  }

  const adultSplits = distribute(adults, teams);
  const childSplits = distribute(children, teams);

  const allCombinations = [];

  adultSplits.forEach((aSplit) => {
    childSplits.forEach((cSplit) => {
      const teamBreakdowns = [];

      for (let i = 0; i < teams; i++) {
        const a = aSplit[i];
        const c = cSplit[i];
        let basePrice = 0;

        if (a + c <= 3) {
          basePrice = Math.max(40, a * 20 + c * 9);
        } else {
          basePrice = Math.max(40, a * 15 + c * 9);
        }

        let kpPrice = a * 5 * kpHours + c * 4 * kpHours;

        teamBreakdowns.push({
          adults: a,
          children: c,
          price: basePrice + kpPrice,
        });
      }

      const totalPrice = teamBreakdowns.reduce((sum, team) => sum + team.price, 0);
      allCombinations.push({ totalPrice, teamBreakdowns });
    });
  });

  allCombinations.sort((a, b) => a.totalPrice - b.totalPrice);
  const min = allCombinations[0];
  const max = allCombinations[allCombinations.length - 1];

  return { min, max };
}
