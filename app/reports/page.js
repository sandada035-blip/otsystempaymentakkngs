"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import { exportRowsToCSV } from "@/lib/exporters"
import AuthGuard from "@/components/AuthGuard"
import AppShell from "@/components/AppShell"

export default function ReportsPage() {
  const [rows, setRows] = useState([])
  const [month, setMonth] = useState("")

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("payments").select("*").order("payment_date", { ascending: false })
      setRows(data || [])
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    if (!month) return rows
    return rows.filter((r) => String(r.payment_date || "").slice(0, 7) === month)
  }, [rows, month])

  const totals = useMemo(() => {
    return filtered.reduce((acc, row) => {
      acc.total += Number(row.total_amount || 0)
      acc.teacher += Number(row.teacher_share || 0)
      acc.school += Number(row.school_share || 0)
      return acc
    }, { total: 0, teacher: 0, school: 0 })
  }, [filtered])

  return (
    <AuthGuard>
      {(user) => (
        <AppShell user={user}>
          <h1 className="title">Reports</h1>
          <p className="subtitle">Monthly report, export, and summaries</p>

          <div className="card">
            <div className="form-grid">
              <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
            </div>
            <div style={{ height: 14 }} />
            <div className="actions">
              <button className="btn btn-outline" onClick={() => exportRowsToCSV("monthly-report.csv", filtered)}>Export CSV</button>
            </div>
          </div>

          <div className="grid3">
            <div className="stat blue"><h3>Total 100%</h3><strong>{totals.total.toLocaleString()}</strong></div>
            <div className="stat purple"><h3>Teacher 80%</h3><strong>{totals.teacher.toLocaleString()}</strong></div>
            <div className="stat green"><h3>School 20%</h3><strong>{totals.school.toLocaleString()}</strong></div>
          </div>

          <div className="card table-wrap" style={{ marginTop: 16 }}>
            <table>
              <thead><tr><th>Student</th><th>Teacher</th><th>100%</th><th>80%</th><th>20%</th><th>Date</th></tr></thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id}>
                    <td>{row.student_name}</td>
                    <td>{row.teacher_name}</td>
                    <td>{Number(row.total_amount || 0).toLocaleString()}</td>
                    <td>{Number(row.teacher_share || 0).toLocaleString()}</td>
                    <td>{Number(row.school_share || 0).toLocaleString()}</td>
                    <td>{row.payment_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AppShell>
      )}
    </AuthGuard>
  )
}
