export function exportRowsToCSV(filename, rows) {
  if (!rows || !rows.length) {
    alert("No data to export")
    return
  }

  const headers = Object.keys(rows[0])

  const csvRows = [
    headers.join(","),
    ...rows.map(row =>
      headers.map(h => `"${(row[h] ?? "").toString().replace(/"/g,'""')}"`).join(",")
    )
  ]

  const csvContent = "\uFEFF" + csvRows.join("\n")   // ⭐ UTF-8 BOM fix

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()

  URL.revokeObjectURL(url)
}
