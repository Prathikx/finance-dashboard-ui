import { useMemo } from "react";
import { useFinanceStore } from "../../store/useFinanceStore";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function BalanceTrendChart({ transactions: propsTransactions }) {
  const storeTransactions = useFinanceStore((state) => state.transactions);
  const transactions = propsTransactions || storeTransactions;

  const chartData = useMemo(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) return [];

    const sorted = [...transactions].sort((a, b) =>
      new Date(a.date) - new Date(b.date)
    );

    // Check how many months are spanned
    const firstDate = new Date(sorted[0].date);
    const lastDate = new Date(sorted[sorted.length - 1].date);
    const monthSpan = (lastDate.getFullYear() - firstDate.getFullYear()) * 12 + (lastDate.getMonth() - firstDate.getMonth());

    if (monthSpan === 0) {
      // Individual Month view -> Aggregate by Day
      const dailyData = {};
      let runningBalance = 0;

      sorted.forEach((txn) => {
        const amount = Number(txn.amount) || 0;
        if (txn.type === "income") runningBalance += amount;
        else runningBalance -= amount;

        const dateStr = new Date(txn.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        dailyData[dateStr] = {
          name: dateStr,
          balance: runningBalance,
          dateObj: new Date(txn.date)
        };
      });
      return Object.values(dailyData).sort((a, b) => a.dateObj - b.dateObj);
    } else {
      // Multi-month/Yearly view -> Aggregate by Month
      const monthlyData = {};
      let runningBalance = 0;

      sorted.forEach((txn) => {
        const amount = Number(txn.amount) || 0;
        if (txn.type === "income") runningBalance += amount;
        else runningBalance -= amount;

        const d = new Date(txn.date);
        const monthYear = d.toLocaleString('default', { month: 'short', year: '2-digit' });
        
        monthlyData[monthYear] = {
          name: monthYear,
          balance: runningBalance,
          dateObj: new Date(d.getFullYear(), d.getMonth(), 1)
        };
      });
      return Object.values(monthlyData).sort((a, b) => a.dateObj - b.dateObj);
    }
  }, [transactions]);

  if (!chartData.length) {
    return (
      <div
        style={{
          width: "100%",
          height: "320px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--muted)",
          borderRadius: "20px",
        }}
      >
        No balance trend data available
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="4 4" opacity={0.15} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Balance"]}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}