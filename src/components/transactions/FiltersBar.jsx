import { useFinanceStore } from "../../store/useFinanceStore";

export default function FiltersBar() {
  const filters = useFinanceStore((s) => s.filters);
  const setFilters = useFinanceStore((s) => s.setFilters);
  const transactions = useFinanceStore((s) => s.transactions);

  const categories = [...new Set(transactions.map((t) => t.category))];

  return (
    <div className="filters-bar">
      <input
        type="text"
        placeholder="Search category or note..."
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
      />

      <select
        value={filters.type}
        onChange={(e) => setFilters({ type: e.target.value })}
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select
        value={filters.category}
        onChange={(e) => setFilters({ category: e.target.value })}
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <select
        value={filters.sort}
        onChange={(e) => setFilters({ sort: e.target.value })}
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
}