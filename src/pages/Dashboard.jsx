import { useState, useMemo } from "react";
import { useFinanceStore } from "../store/useFinanceStore";
import SummaryCard from "../components/cards/SummaryCard";
import BalanceTrendChart from "../components/charts/BalanceTrendChart";
import CategoryPieChart from "../components/charts/CategoryPieChart";

export default function Dashboard() {
  const transactions = useFinanceStore((s) => s.transactions);
  const isLoading = useFinanceStore((s) => s.isLoading);
  const error = useFinanceStore((s) => s.error);
  const role = useFinanceStore((s) => s.role);

  const [selectedMonth, setSelectedMonth] = useState("all");

  // Get unique months from transactions for the selector
  const availableMonths = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    
    const months = [...new Set(transactions.filter(t => t && t.date).map(t => {
      const d = new Date(t.date);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleString('default', { month: 'long', year: 'numeric' });
    }))].filter(Boolean);
    
    // Sort months descending (latest first)
    return months.sort((a, b) => new Date(b) - new Date(a));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    if (selectedMonth === "all") return transactions;
    return transactions.filter(t => {
      if (!t || !t.date) return false;
      const d = new Date(t.date);
      return d.toLocaleString('default', { month: 'long', year: 'numeric' }) === selectedMonth;
    });
  }, [transactions, selectedMonth]);

  const totalIncome = (filteredTransactions || [])
    .filter((t) => t && t.type === "income")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalExpense = (filteredTransactions || [])
    .filter((t) => t && t.type === "expense")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalBalance = totalIncome - totalExpense;

  // IMPORTANT: Hooks must come before early returns
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading your financial data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-banner">
        <h3>Unable to load data</h3>
        <p>{error}. Please ensure the backend server is running.</p>
        <button onClick={() => window.location.reload()} className="retry-link">Retry</button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <h2>{role === "admin" ? "Admin Control Center" : "Financial Overview"}</h2>
          <p>
            {role === "admin"
              ? "Monitor trends, manage transactions, and make data-driven decisions."
              : "Track your finances with clear and simple insights."}
          </p>
        </div>

        <div className="dashboard-filter">
          <label>View Data For: </label>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="month-selector"
          >
            <option value="all">All Time (12 Months)</option>
            {availableMonths.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid-summary">
        <SummaryCard
          title="Total Balance"
          value={totalBalance}
          subtitle={role === "admin" ? "Live net cashflow under management" : "Net amount"}
        />
        <SummaryCard
          title="Income"
          value={totalIncome}
          subtitle={role === "admin" ? "Current inflow across tracked records" : "Total earnings"}
        />
        <SummaryCard
          title="Expenses"
          value={totalExpense}
          subtitle={role === "admin" ? "Tracked operational outflow" : "Total spending"}
        />
      </div>

      {role === "admin" && (
        <div className="admin-banner">
          ⚡ Admin Mode Active — Advanced monitoring and control enabled
        </div>
      )}

      <div className="charts-grid">
        <div className="chart-card">
          <div className="section-header">
            <h3>Balance Trend</h3>
            <p>Time-based visualization</p>
          </div>
          <BalanceTrendChart transactions={filteredTransactions} />
        </div>

        <div className="chart-card">
          <div className="section-header">
            <h3>Category Breakdown</h3>
            <p>Spending distribution</p>
          </div>
          <CategoryPieChart transactions={filteredTransactions} />
        </div>
      </div>

      {role === "admin" && (
        <div className="admin-insights">
          <h2>Admin Performance Snapshot</h2>

          <div className="admin-grid">
            <div className="admin-card">
              <p>📊 Financial Health</p>
              <h4>{totalBalance >= 0 ? "Stable" : "Negative Balance Risk"}</h4>
            </div>

            <div className="admin-card">
              <p>💸 Expense Pressure</p>
              <h4>{totalExpense > totalIncome * 0.7 ? "High" : "Under Control"}</h4>
            </div>

            <div className="admin-card">
              <p>🧠 Admin Recommendation</p>
              <h4>
                {totalExpense > totalIncome * 0.7
                  ? "Reduce non-essential spending"
                  : "Maintain current spending pattern"}
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}