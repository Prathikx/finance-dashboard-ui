import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useFinanceStore } from '../store/useFinanceStore';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Transactions from '../pages/Transactions';
import Insights from '../pages/Insights';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

const AppLayout = ({ children }) => (
  <div className="app">
    <Sidebar />
    <div className="main-layout">
      <Topbar />
      <main className="page-container">
        {children}
      </main>
    </div>
  </div>
);

const PublicRoute = ({ children }) => {
  const setRole = useFinanceStore((s) => s.setRole);
  const fetchTransactions = useFinanceStore((s) => s.fetchTransactions);

  useEffect(() => {
    setRole("viewer");
    fetchTransactions();
  }, [setRole, fetchTransactions]);

  return <AppLayout>{children}</AppLayout>;
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useFinanceStore((s) => s.isAuthenticated);
  const setRole = useFinanceStore((s) => s.setRole);
  const fetchTransactions = useFinanceStore((s) => s.fetchTransactions);

  useEffect(() => {
    if (isAuthenticated) {
      setRole("admin");
      fetchTransactions();
    }
  }, [isAuthenticated, setRole, fetchTransactions]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

export default function AppRoutes() {
  const isAuthenticated = useFinanceStore((s) => s.isAuthenticated);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><Dashboard /></PublicRoute>} />
      <Route path="/transactions" element={<PublicRoute><Transactions /></PublicRoute>} />
      <Route path="/insights" element={<PublicRoute><Insights /></PublicRoute>} />

      {/* Login Route */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Protected Admin Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
      <Route path="/dashboard/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
