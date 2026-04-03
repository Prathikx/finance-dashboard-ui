export function getInsights(transactions) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return {
      income: 0,
      expense: 0,
      balance: 0,
      topCategory: "N/A",
      savingsRate: 0,
    };
  }

  let income = 0;
  let expense = 0;
  const categories = {};

  transactions.forEach((t) => {
    const amt = Number(t.amount) || 0;

    if (t.type === "income") {
      income += amt;
    } else {
      expense += amt;
    }

    if (t.type === "expense") {
      categories[t.category] =
        (categories[t.category] || 0) + amt;
    }
  });

  const topCategory =
    Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const balance = income - expense;
  const savingsRate = income ? (balance / income) * 100 : 0;

  return {
    income,
    expense,
    balance,
    topCategory,
    savingsRate,
  };
}