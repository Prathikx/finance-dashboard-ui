import { useState } from "react";
import { useFinanceStore } from "../../store/useFinanceStore";

function TransactionForm({ editingTransaction, closeModal, addTransaction, updateTransaction }) {
  const initialForm = editingTransaction
    ? {
        date: editingTransaction.date ? new Date(editingTransaction.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        category: editingTransaction.category || "",
        type: editingTransaction.type || "expense",
        amount:
          editingTransaction.amount !== undefined
            ? String(editingTransaction.amount)
            : "",
        note: editingTransaction.note || "",
      }
    : {
        date: new Date().toISOString().slice(0, 10),
        category: "",
        type: "expense",
        amount: "",
        note: "",
      };

  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category.trim() || !form.amount) return;

    const payload = {
      ...form,
      amount: Number(form.amount),
    };

    setIsLoading(true);
    setError(null);

    try {
      if (editingTransaction) {
        await updateTransaction({
          ...payload,
          id: editingTransaction.id,
        });
        alert("Transaction updated successfully!");
      } else {
        await addTransaction(payload);
        alert("Transaction added successfully!");
      }
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <input type="date" name="date" value={form.date} onChange={handleChange} required />
      <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
      <select name="type" value={form.type} onChange={handleChange}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} required />
      <input type="text" name="note" placeholder="Note (optional)" value={form.note} onChange={handleChange} />
      <div className="modal-actions">
        <button type="button" className="ghost-btn" onClick={closeModal} disabled={isLoading}>Cancel</button>
        <button type="submit" className="primary-btn" disabled={isLoading}>
          {isLoading ? "Saving..." : (editingTransaction ? "Update" : "Add")}
        </button>
      </div>
    </form>
  );
}

export default function AddEditTransactionModal() {
  const isModalOpen = useFinanceStore((s) => s.isModalOpen);
  const closeModal = useFinanceStore((s) => s.closeModal);
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const updateTransaction = useFinanceStore((s) => s.updateTransaction);
  const editingTransaction = useFinanceStore((s) => s.editingTransaction);

  if (!isModalOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{editingTransaction ? "Edit Transaction" : "Add Transaction"}</h2>
        <TransactionForm
          key={editingTransaction ? editingTransaction.id : "new"}
          editingTransaction={editingTransaction}
          closeModal={closeModal}
          addTransaction={addTransaction}
          updateTransaction={updateTransaction}
        />
      </div>
    </div>
  );
}