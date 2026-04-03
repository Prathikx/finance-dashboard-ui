import { create } from "zustand";
import transactionsData from "../data/transactions";

export const useFinanceStore = create((set) => ({
  transactions: transactionsData,
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

  setRole: (role) => set({ role }),

  toggleDarkMode: () =>
    set((state) => ({
      darkMode: !state.darkMode,
    })),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [
        { ...transaction, id: Date.now() },
        ...state.transactions,
      ],
    })),

  updateTransaction: (updatedTransaction) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === updatedTransaction.id ? updatedTransaction : t
      ),
    })),

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

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