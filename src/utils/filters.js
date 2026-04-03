export const getCategories = (transactions) => {
  const categories = [...new Set(transactions.map((t) => t.category))];
  return categories;
};