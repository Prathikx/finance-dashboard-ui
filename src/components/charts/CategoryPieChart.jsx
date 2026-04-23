import { useFinanceStore } from "../../store/useFinanceStore";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#ef4444", "#06b6d4", "#f59e0b", "#8b5cf6"];

export default function CategoryPieChart({ transactions: propsTransactions }) {
  const storeTransactions = useFinanceStore((s) => s.transactions);
  const transactions = propsTransactions || storeTransactions;

  const totals = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + Number(t.amount);
    });

  const data = Object.entries(totals).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}