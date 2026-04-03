import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useFinanceStore } from "./store/useFinanceStore";

import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";

export default function App() {
  const darkMode = useFinanceStore((s) => s.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="app">
      <Sidebar />
      <div className="main-layout">
        <Topbar />
        <main className="page-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/insights" element={<Insights />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}