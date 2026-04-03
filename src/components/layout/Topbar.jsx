import RoleSwitch from "../ui/RoleSwitch";
import ThemeToggle from "../ui/ThemeToggle";
import { useFinanceStore } from "../../store/useFinanceStore";

export default function Topbar() {
  const role = useFinanceStore((s) => s.role);

  return (
    <header className="topbar">
      <div>
        <h1>Finance Dashboard</h1>
        <p>Track, explore and understand your financial activity</p>
      </div>

      <div className="topbar-actions">
        {role === "admin" && (
          <div className="admin-live-badge">
            <span className="live-dot"></span>
            Admin Active
          </div>
        )}

        <RoleSwitch />
        <ThemeToggle />
      </div>
    </header>
  );
}