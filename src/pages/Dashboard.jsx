import { useFinanceStore } from "../store/useFinanceStore";
import SummaryCard from "../components/cards/SummaryCard";
import BalanceTrendChart from "../components/charts/BalanceTrendChart";
import CategoryPieChart from "../components/charts/CategoryPieChart";

export default function Dashboard() {
  const transactions = useFinanceStore((s) => s.transactions);
  const role = useFinanceStore((s) => s.role);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalBalance = totalIncome - totalExpense;

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
          <BalanceTrendChart />
        </div>

        <div className="chart-card">
          <div className="section-header">
            <h3>Category Breakdown</h3>
            <p>Spending distribution</p>
          </div>
          <CategoryPieChart />
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