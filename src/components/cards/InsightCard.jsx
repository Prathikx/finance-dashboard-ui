export default function InsightCard({ title, value, note, highlight = false }) {
  return (
    <div className={highlight ? "insight-card highlight" : "insight-card"}>
      <p>{title}</p>
      <h3>{value}</h3>
      <span>{note}</span>
    </div>
  );
}