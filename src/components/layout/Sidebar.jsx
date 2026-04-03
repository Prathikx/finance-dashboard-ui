import { NavLink } from "react-router-dom";
import { LayoutDashboard, ReceiptText, Lightbulb } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">💰</div>
        <div>
          <h2>Finance UI</h2>
          <p>Dashboard</p>
        </div>
      </div>

      <nav className="nav-links">
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/transactions" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <ReceiptText size={18} />
          Transactions
        </NavLink>

        <NavLink to="/insights" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <Lightbulb size={18} />
          Insights
        </NavLink>
      </nav>
    </aside>
  );
}