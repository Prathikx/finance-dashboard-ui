export function exportToCSV(rows = []) {
  if (!rows.length) return;

  const headers = ["date", "category", "type", "amount", "note"];
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "transactions.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}