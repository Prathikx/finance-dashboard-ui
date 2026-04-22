import { useEffect } from "react";
import { useFinanceStore } from "./store/useFinanceStore";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const darkMode = useFinanceStore((s) => s.darkMode);
  const initAuth = useFinanceStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return <AppRoutes />;
}