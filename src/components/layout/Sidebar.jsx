import { NavLink } from "react-router-dom";
import { LayoutDashboard, ReceiptText, Lightbulb, ShieldAlert } from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";

export default function Sidebar() {
  const isAuthenticated = useFinanceStore((s) => s.isAuthenticated);
  const prefix = isAuthenticated ? "/dashboard" : "";

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">💰</div>
        <div>
          <h2>Finance UI</h2>
          <p>{isAuthenticated ? "Admin Portal" : "Public Dashboard"}</p>
        </div>
      </div>

      <nav className="nav-links">
        <NavLink to={isAuthenticated ? "/dashboard" : "/"} end className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <LayoutDashboard size={18} />
          {isAuthenticated ? "Admin Overview" : "Overview"}
        </NavLink>

        <NavLink to={`${prefix}/transactions`} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <ReceiptText size={18} />
          Transactions
        </NavLink>

        <NavLink to={`${prefix}/insights`} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <Lightbulb size={18} />
          Insights
        </NavLink>
      </nav>
      
      {isAuthenticated && (
        <div style={{ marginTop: 'auto', padding: '16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#8b93ff', fontSize: '13px', fontWeight: 'bold' }}>
          <ShieldAlert size={16} />
          Admin Mode Active
        </div>
      )}
    </aside>
  );
}