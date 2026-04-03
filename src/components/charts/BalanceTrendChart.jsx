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

export default function BalanceTrendChart() {
  const transactions = useFinanceStore((state) => state.transactions);

  const chartData = useMemo(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) return [];

    const sorted = [...transactions].sort((a, b) =>
      String(a.date).localeCompare(String(b.date))
    );

    let runningBalance = 0;

    return sorted.map((txn) => {
      const amount = Number(txn.amount) || 0;

      if (txn.type === "income") {
        runningBalance += amount;
      } else {
        runningBalance -= amount;
      }

      return {
        date: txn.date || "",
        balance: runningBalance,
      };
    });
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
          <XAxis dataKey="date" />
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