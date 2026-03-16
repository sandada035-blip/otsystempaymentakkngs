export function exportRowsToCSV(filename, rows) {
  if (!rows || !rows.length) {
    alert("No data to export")
    return
  }
  const headers = Object.keys(rows[0])
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(","))
  ].join("\n")

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
