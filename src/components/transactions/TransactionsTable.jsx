import { Pencil, Trash2, Eye } from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";
import { formatCurrency, formatDate } from "../../utils/format";
import EmptyState from "../ui/EmptyState";

export default function TransactionsTable({ transactions = [] }) {
  const role = useFinanceStore((s) => s.role);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);
  const openModal = useFinanceStore((s) => s.openModal);

  if (!transactions.length) {
    return (
      <EmptyState
        title="No transactions found"
        text="Try changing filters or add a transaction to get started."
      />
    );
  }

  return (
    <div className="table-card">
      <table className="txn-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Note</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{formatDate(t.date)}</td>
              <td>{t.category}</td>
              <td>
                <span className={t.type === "income" ? "pill income" : "pill expense"}>
                  {t.type}
                </span>
              </td>
              <td>{formatCurrency(t.amount)}</td>
              <td>{t.note || "—"}</td>
              <td>
                <span className={role === "admin" ? "status-admin" : "status-viewer"}>
                  {role === "admin" ? "Editable" : "View Only"}
                </span>
              </td>

              <td className="actions-cell">
                {role === "admin" ? (
                  <>
                    <button className="icon-btn" onClick={() => openModal(t)}>
                      <Pencil size={16} />
                    </button>
                    <button className="icon-btn danger" onClick={async () => {
                      if (window.confirm("Are you sure you want to delete this transaction?")) {
                        try {
                          await deleteTransaction(t.id);
                          alert("Transaction deleted successfully");
                        } catch (err) {
                          alert("Failed to delete transaction");
                        }
                      }
                    }}>
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <button className="icon-btn viewer-only" disabled>
                    <Eye size={16} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}