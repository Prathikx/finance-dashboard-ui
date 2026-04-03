export default function SummaryCard({ title, value, subtitle }) {
  return (
    <div className="summary-card premium-summary-card">
      <div className="summary-top">
        <span className="summary-title">{title}</span>
      </div>

      <div className="summary-main">
        <h2>
          {typeof value === "number"
            ? `₹${value.toLocaleString("en-IN")}`
            : value}
        </h2>
        <p>{subtitle}</p>
      </div>

      <div className="summary-orb summary-orb-1" />
      <div className="summary-orb summary-orb-2" />
    </div>
  );
}