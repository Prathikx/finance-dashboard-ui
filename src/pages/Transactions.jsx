import { useState, useMemo } from "react";
import { Plus, Download, Lock, ArrowLeft, Calendar } from "lucide-react";
import { useFinanceStore } from "../store/useFinanceStore";
import FiltersBar from "../components/transactions/FiltersBar";
import TransactionsTable from "../components/transactions/TransactionsTable";
import AddEditTransactionModal from "../components/transactions/AddEditTransactionModal";
import { exportToCSV } from "../utils/export";

export default function Transactions() {
  const role = useFinanceStore((s) => s.role);
  const transactions = useFinanceStore((s) => s.transactions);
  const filters = useFinanceStore((s) => s.filters);
  const openModal = useFinanceStore((s) => s.openModal);

  const [viewingMonth, setViewingMonth] = useState(null);

  const filtered = useMemo(() => {
    let list = [...transactions];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (t) =>
          (t.category || "").toLowerCase().includes(q) ||
          (t.note || "").toLowerCase().includes(q)
      );
    }

    if (filters.type !== "all") {
      list = list.filter((t) => t.type === filters.type);
    }

    if (filters.category !== "all") {
      list = list.filter((t) => t.category === filters.category);
    }

    if (filters.sort === "latest") {
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (filters.sort === "oldest") {
      list.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return list;
  }, [transactions, filters]);

  // Group by month
  const grouped = useMemo(() => {
    return filtered.reduce((acc, t) => {
      const d = new Date(t.date);
      const monthName = d.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[monthName]) acc[monthName] = { name: monthName, data: [], income: 0, expense: 0 };
      acc[monthName].data.push(t);
      if (t.type === 'income') acc[monthName].income += Number(t.amount);
      else acc[monthName].expense += Number(t.amount);
      return acc;
    }, {});
  }, [filtered]);

  const monthKeys = useMemo(() => {
    const keys = Object.keys(grouped);
    if (filters.sort === "latest") {
      return keys.sort((a, b) => new Date(grouped[b].data[0].date) - new Date(grouped[a].data[0].date));
    } else {
      return keys.sort((a, b) => new Date(grouped[a].data[0].date) - new Date(grouped[b].data[0].date));
    }
  }, [grouped, filters.sort]);

  return (
    <div className="page">
      <div className="section-header page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {viewingMonth && (
              <button className="icon-btn" onClick={() => setViewingMonth(null)} title="Back to Months">
                <ArrowLeft size={20} />
              </button>
            )}
            <h2>
              {viewingMonth ? `${viewingMonth}` : (role === "admin" ? "Transaction Management" : "Transactions")}
            </h2>
          </div>
          <p>
            {viewingMonth 
              ? `Reviewing entries for ${viewingMonth}`
              : (role === "admin" ? "Full control over financial entries" : "View-only access")}
          </p>
        </div>

        <div className="page-actions">
          <button className="ghost-btn" onClick={() => exportToCSV(filtered)}>
            <Download size={16} /> Export
          </button>

          {role === "admin" ? (
            <button className="primary-btn" onClick={() => openModal()}>
              <Plus size={16} /> Add Transaction
            </button>
          ) : (
            <button className="disabled-btn">
              <Lock size={16} /> Locked
            </button>
          )}
        </div>
      </div>

      {role === "viewer" && !viewingMonth && (
        <div className="viewer-banner">
          🔒 Viewer Mode: You can view data but cannot add, edit or delete transactions.
        </div>
      )}

      {!viewingMonth && <FiltersBar />}
      
      <div className="transactions-content">
        {!viewingMonth ? (
          <div className="month-grid">
            {monthKeys.map(month => (
              <div key={month} className="month-card" onClick={() => setViewingMonth(month)}>
                <div className="month-card-header">
                  <Calendar className="month-icon" size={24} />
                  <h3>{month}</h3>
                </div>
                <div className="month-card-stats">
                  <div className="stat">
                    <span>Income</span>
                    <p className="text-success">₹{grouped[month].income.toLocaleString()}</p>
                  </div>
                  <div className="stat">
                    <span>Expense</span>
                    <p className="text-danger">₹{grouped[month].expense.toLocaleString()}</p>
                  </div>
                </div>
                <div className="month-card-footer">
                  <span>{grouped[month].data.length} Transactions</span>
                  <span className="view-link">View Details →</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          grouped[viewingMonth] ? (
            <div className="month-detail">
              <div className="month-summary-grid">
                <div className="month-summary-card income">
                  <span>Monthly Income</span>
                  <h3>₹{grouped[viewingMonth].income.toLocaleString()}</h3>
                </div>
                <div className="month-summary-card expense">
                  <span>Monthly Expense</span>
                  <h3>₹{grouped[viewingMonth].expense.toLocaleString()}</h3>
                </div>
                <div className="month-summary-card balance">
                  <span>Net Savings</span>
                  <h3>₹{(grouped[viewingMonth].income - grouped[viewingMonth].expense).toLocaleString()}</h3>
                </div>
              </div>
              
              <div className="section-header" style={{ marginTop: '32px', marginBottom: '16px' }}>
                <h3>Transaction List</h3>
                <p>Showing all {grouped[viewingMonth].data.length} entries for this period</p>
              </div>
              
              <TransactionsTable transactions={grouped[viewingMonth].data} />
            </div>
          ) : (
            <div className="empty-state">
              <h3>No data found for this month</h3>
              <p>Try clearing your filters or go back to the month list.</p>
              <button className="primary-btn" onClick={() => setViewingMonth(null)} style={{ marginTop: '20px' }}>
                <ArrowLeft size={16} /> Back to Months
              </button>
            </div>
          )
        )}
      </div>
      
      <AddEditTransactionModal />
    </div>
  );
}