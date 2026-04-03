import { Plus, Download, Lock } from "lucide-react";
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

  let filtered = [...transactions];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        (t.category || "").toLowerCase().includes(q) ||
        (t.note || "").toLowerCase().includes(q)
    );
  }

  if (filters.type !== "all") {
    filtered = filtered.filter((t) => t.type === filters.type);
  }

  if (filters.category !== "all") {
    filtered = filtered.filter((t) => t.category === filters.category);
  }

  if (filters.sort === "latest") {
    filtered.sort((a, b) => b.date.localeCompare(a.date));
  } else if (filters.sort === "oldest") {
    filtered.sort((a, b) => a.date.localeCompare(b.date));
  }

  return (
    <div className="page">
      <div className="section-header page-header">
        <div>
          <h2>{role === "admin" ? "Transaction Management" : "Transactions"}</h2>
          <p>
            {role === "admin"
              ? "Full control over financial entries"
              : "View-only access"}
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

      {role === "viewer" && (
        <div className="viewer-banner">
          🔒 Viewer Mode: You can view data but cannot add, edit or delete transactions.
        </div>
      )}

      <FiltersBar />
      <TransactionsTable transactions={filtered} />
      <AddEditTransactionModal />
    </div>
  );
}