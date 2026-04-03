import { ShieldCheck, Eye } from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";

export default function RoleSwitch() {
  const role = useFinanceStore((s) => s.role);
  const setRole = useFinanceStore((s) => s.setRole);

  return (
    <div className="role-switch">
      <button
        className={`role-btn ${role === "viewer" ? "active" : ""}`}
        onClick={() => setRole("viewer")}
      >
        <Eye size={16} />
        Viewer
      </button>

      <button
        className={`role-btn ${role === "admin" ? "active" : ""}`}
        onClick={() => setRole("admin")}
      >
        <ShieldCheck size={16} />
        Admin
      </button>
    </div>
  );
}