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

  const isIndividualMonth = useMemo(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) return false;
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstDate = new Date(sorted[0].date);
    const lastDate = new Date(sorted[sorted.length - 1].date);
    const monthSpan = (lastDate.getFullYear() - firstDate.getFullYear()) * 12 + (lastDate.getMonth() - firstDate.getMonth());
    return monthSpan === 0;
  }, [transactions]);

  const chartData = useMemo(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) return [];

    const sorted = [...transactions].sort((a, b) =>
      new Date(a.date) - new Date(b.date)
    );

    if (isIndividualMonth) {
      // Individual Month view -> Show ALL days of the month
      const dailyData = [];
      let runningBalance = 0;
      
      const firstDate = new Date(sorted[0].date);
      const year = firstDate.getFullYear();
      const month = firstDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      // Get initial balance from before this month
      const allTransactionsSorted = [...storeTransactions].sort((a,b) => new Date(a.date) - new Date(b.date));
      const firstDateOfMonth = new Date(year, month, 1);
      
      let balanceBeforeMonth = 0;
      allTransactionsSorted.forEach(t => {
        if (new Date(t.date) < firstDateOfMonth) {
          if (t.type === 'income') balanceBeforeMonth += Number(t.amount);
          else balanceBeforeMonth -= Number(t.amount);
        }
      });

      runningBalance = balanceBeforeMonth;

      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const dateStr = currentDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        
        // Find transactions on this day
        const dayTxns = sorted.filter(t => {
          const d = new Date(t.date);
          return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
        });

        dayTxns.forEach(t => {
          if (t.type === 'income') runningBalance += Number(t.amount);
          else runningBalance -= Number(t.amount);
        });

        dailyData.push({
          name: dateStr,
          balance: runningBalance
        });
      }
      return dailyData;
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
  }, [transactions, isIndividualMonth, storeTransactions]);

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
          <XAxis 
            dataKey="name" 
            interval={isIndividualMonth ? 4 : 0} 
            angle={-45} 
            textAnchor="end" 
            height={60} 
            tick={{ fontSize: 12 }}
          />
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