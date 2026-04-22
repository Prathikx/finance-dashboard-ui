import { create } from "zustand";
import { expenseService } from "../services/expenseService";

export const useFinanceStore = create((set, get) => ({
  // Authentication State
  isAuthenticated: false,
  token: null,
  user: null,

  // Transactions State
  transactions: [],
  isLoading: false,
  error: null,
  role: "viewer",
  darkMode: false,

  filters: {
    search: "",
    type: "all",
    category: "all",
    sort: "latest",
  },

  editingTransaction: null,
  isModalOpen: false,

  // Auth Actions
  initAuth: () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (token && user) {
      set({ isAuthenticated: true, token, user });
    }
  },

  setAuth: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ isAuthenticated: true, token, user });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ isAuthenticated: false, token: null, user: null, transactions: [] });
  },

  // Settings Actions
  setRole: (role) => set({ role }),

  toggleDarkMode: () =>
    set((state) => ({
      darkMode: !state.darkMode,
    })),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  // API Actions
  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await expenseService.getExpenses();
      set({ transactions: data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to fetch expenses", isLoading: false });
    }
  },

  addTransaction: async (transaction) => {
    try {
      const newTransaction = await expenseService.createExpense(transaction);
      set((state) => ({
        transactions: [newTransaction, ...state.transactions],
      }));
    } catch (err) {
      console.error("Failed to add transaction", err);
      throw err;
    }
  },

  updateTransaction: async (updatedTransaction) => {
    try {
      const updated = await expenseService.updateExpense(updatedTransaction.id, updatedTransaction);
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === updated.id ? updated : t
        ),
      }));
    } catch (err) {
      console.error("Failed to update transaction", err);
      throw err;
    }
  },

  deleteTransaction: async (id) => {
    try {
      await expenseService.deleteExpense(id);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
    } catch (err) {
      console.error("Failed to delete transaction", err);
      throw err;
    }
  },

  openModal: (transaction = null) =>
    set({
      isModalOpen: true,
      editingTransaction: transaction,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      editingTransaction: null,
    }),
}));
