import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

export function exportRowsToExcel(filename, rows, sheetName = "Report") {
  if (!rows || !rows.length) {
    alert("No data to export")
    return
  }

  const worksheet = XLSX.utils.json_to_sheet(rows)

  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1")
  const colWidths = []

  for (let c = range.s.c; c <= range.e.c; c++) {
    let maxLength = 12
    for (let r = range.s.r; r <= range.e.r; r++) {
      const cellAddress = XLSX.utils.encode_cell({ r, c })
      const cell = worksheet[cellAddress]
      if (cell && cell.v != null) {
        const len = String(cell.v).length
        if (len > maxLength) maxLength = len
      }
    }
    colWidths.push({ wch: maxLength + 2 })
  }

  worksheet["!cols"] = colWidths

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  })

  const blob = new Blob(
    [excelBuffer],
    {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
  )

  saveAs(blob, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`)
}
