import { useFinanceStore } from "../../store/useFinanceStore";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

export default function CategoryPieChart({ transactions: propsTransactions }) {
  const storeTransactions = useFinanceStore((s) => s.transactions);
  const transactions = propsTransactions || storeTransactions;

  const totals = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + Number(t.amount);
    });

  const data = Object.entries(totals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const totalExpense = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <div style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
        No expense data for this period
      </div>
    );
  }

  return (
    <div className="pie-chart-container">
      <div className="pie-wrap">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={4}
              cx="50%"
              cy="50%"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `₹${Number(value).toLocaleString()}`}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pie-center-text">
          <span>Total</span>
          <p>₹{totalExpense > 100000 ? (totalExpense/1000).toFixed(1) + 'K' : totalExpense.toLocaleString()}</p>
        </div>
      </div>

      <div className="pie-legend">
        {data.map((item, index) => (
          <div key={item.name} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
            <div className="legend-info">
              <span className="legend-name">{item.name}</span>
              <span className="legend-percent">{((item.value / totalExpense) * 100).toFixed(1)}%</span>
            </div>
            <span className="legend-value">₹{item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}