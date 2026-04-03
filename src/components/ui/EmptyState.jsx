export default function EmptyState({ text }) {
  return (
    <div style={{ textAlign: "center", padding: "40px", opacity: 0.6 }}>
      <h3>{text}</h3>
      <p>Start by adding your first transaction 🚀</p>
    </div>
  );
}