import { LogOut, LogIn } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import { useFinanceStore } from "../../store/useFinanceStore";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const logout = useFinanceStore((s) => s.logout);
  const isAuthenticated = useFinanceStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div>
        <h1>Finance Dashboard</h1>
        <p>Track, explore and understand your financial activity</p>
      </div>

      <div className="topbar-actions flex items-center space-x-4">
        <ThemeToggle />
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
            title="Logout"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontWeight: 600 }}
          >
            <LogOut className="h-5 w-5" size={18} />
            <span>Logout</span>
          </button>
        )}
      </div>
    </header>
  );
}