import { Moon, Sun } from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";

export default function ThemeToggle() {
  const darkMode = useFinanceStore((s) => s.darkMode);
  const toggleDarkMode = useFinanceStore((s) => s.toggleDarkMode);

  return (
    <button className="ghost-btn theme-btn" onClick={toggleDarkMode}>
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      {darkMode ? "Light" : "Dark"}
    </button>
  );
}