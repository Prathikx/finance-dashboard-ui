import { useMemo } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  BadgeIndianRupee,
  PiggyBank,
} from "lucide-react";
import { useFinanceStore } from "../store/useFinanceStore";
import { getInsights } from "../utils/insights";

export default function Insights() {
  const transactions = useFinanceStore((s) => s.transactions);
  const role = useFinanceStore((s) => s.role);

  const { income, expense, balance, topCategory, savingsRate } = useMemo(
    () => getInsights(transactions),
    [transactions]
  );

  const cards = [
    {
      title: "Highest Spending Category",
      value: topCategory,
      sub:
        role === "admin"
          ? "Highest cost center identified"
          : `₹${expense.toLocaleString("en-IN")}`,
      icon: <TrendingUp size={22} />,
      tone: "danger",
    },
    {
      title: "Total Income",
      value: `₹${income.toLocaleString("en-IN")}`,
      sub:
        role === "admin"
          ? "Revenue inflow across active records"
          : "Current financial inflow",
      icon: <BadgeIndianRupee size={22} />,
      tone: "success",
    },
    {
      title: "Total Expense",
      value: `₹${expense.toLocaleString("en-IN")}`,
      sub:
        role === "admin"
          ? "Monitored spending outflow"
          : "Current spending outflow",
      icon: <Wallet size={22} />,
      tone: "warning",
    },
    {
      title: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      sub:
        role === "admin"
          ? "Efficiency score based on current records"
          : balance > 0
          ? "Excellent money discipline"
          : "Needs stronger control",
      icon: <PiggyBank size={22} />,
      tone: "primary",
    },
  ];

  return (
    <div className="insights-page">
      <div className="page-hero">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1>Financial Insights</h1>
          <p className="hero-sub">
            {role === "admin"
              ? "Advanced financial intelligence and decision-support analytics."
              : "Interactive financial observations generated from your transaction activity."}
          </p>
        </div>

        <div className="hero-pill">
          {balance >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
          <span>
            Net Balance: <strong>₹{balance.toLocaleString("en-IN")}</strong>
          </span>
        </div>
      </div>

      <div className="insights-grid">
        {cards.map((card, index) => (
          <div key={index} className={`insight-premium-card ${card.tone}`}>
            <div className="card-top">
              <div className="icon-wrap">{card.icon}</div>
              <span className="mini-badge">{card.title}</span>
            </div>

            <div className="card-main">
              <h2>{card.value}</h2>
              <p>{card.sub}</p>
            </div>

            <div className="card-glow" />
          </div>
        ))}
      </div>

      <div className="insights-bottom-grid">
        <div className="deep-insight-card">
          <p className="section-tag">Smart Observation</p>
          <h3>Where your money is going</h3>
          <p className="muted">
            Your highest spending category is <strong>{topCategory}</strong>. This suggests your
            biggest recurring outflow is concentrated there.
          </p>

          <div className="metric-line">
            <span>Primary Spend Bucket</span>
            <strong>{topCategory}</strong>
          </div>
          <div className="metric-line">
            <span>Total Expense</span>
            <strong>₹{expense.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        <div className="deep-insight-card">
          <p className="section-tag">Financial Health</p>
          <h3>Cashflow Snapshot</h3>
          <p className="muted">
            Based on your income and expenses, your current financial position is{" "}
            <strong>{balance >= 0 ? "healthy" : "under pressure"}</strong>.
          </p>

          <div className="metric-line">
            <span>Total Income</span>
            <strong>₹{income.toLocaleString("en-IN")}</strong>
          </div>
          <div className="metric-line">
            <span>Net Balance</span>
            <strong>₹{balance.toLocaleString("en-IN")}</strong>
          </div>
          <div className="metric-line">
            <span>Savings Rate</span>
            <strong>{savingsRate.toFixed(1)}%</strong>
          </div>
        </div>
      </div>

      {role === "admin" && (
        <div className="admin-insights">
          <h2>Admin Intelligence Panel</h2>

          <div className="admin-grid">
            <div className="admin-card">
              <p>⚠️ Expense Risk</p>
              <h4>
                {expense > income * 0.7
                  ? "High spending detected"
                  : "Healthy spending"}
              </h4>
            </div>

            <div className="admin-card">
              <p>📊 Efficiency</p>
              <h4>
                {savingsRate > 50
                  ? "Excellent"
                  : savingsRate > 20
                  ? "Moderate"
                  : "Needs improvement"}
              </h4>
            </div>

            <div className="admin-card">
              <p>💡 Recommendation</p>
              <h4>Reduce {topCategory} expenses</h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}