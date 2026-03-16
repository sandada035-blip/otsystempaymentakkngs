"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { exportRowsToCSV } from "@/lib/exporters"
import AuthGuard from "@/components/AuthGuard"
import AppShell from "@/components/AppShell"

export default function PaymentsPage() {
  const [rows, setRows] = useState([])
  const [students, setStudents] = useState([])
  const [form, setForm] = useState({ student_id: "", total_amount: "", payment_date: "" })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const [{ data: payments }, { data: studentsData }] = await Promise.all([
      supabase.from("payments").select("*").order("created_at", { ascending: false }),
      supabase.from("students").select("*").order("name")
    ])
    setRows(payments || [])
    setStudents(studentsData || [])
  }

  async function save() {
    const selected = students.find((s) => s.id === form.student_id)
    const total = Number(form.total_amount || 0)
    const payload = {
      student_id: form.student_id,
      student_name: selected?.name || "",
      teacher_name: selected?.teacher || "",
      total_amount: total,
      teacher_share: total * 0.8,
      school_share: total * 0.2,
      payment_date: form.payment_date
    }

    if (editingId) {
      await supabase.from("payments").update(payload).eq("id", editingId)
    } else {
      await supabase.from("payments").insert([payload])
    }

    setForm({ student_id: "", total_amount: "", payment_date: "" })
    setEditingId(null)
    loadData()
  }

  function edit(row) {
    setEditingId(row.id)
    setForm({ student_id: row.student_id || "", total_amount: row.total_amount || "", payment_date: row.payment_date || "" })
  }

  async function remove(id) {
    await supabase.from("payments").delete().eq("id", id)
    loadData()
  }

  function printReceipt(row) {
    const html = `
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial; padding: 24px; }
            .box { max-width: 520px; margin: auto; border: 1px solid #ccc; border-radius: 16px; padding: 24px; }
            h2 { margin-top: 0; }
            .item { margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="box">
            <h2>Payment Receipt</h2>
            <div class="item"><strong>Student:</strong> ${row.student_name || ""}</div>
            <div class="item"><strong>Teacher:</strong> ${row.teacher_name || ""}</div>
            <div class="item"><strong>Total:</strong> ${Number(row.total_amount || 0).toLocaleString()}</div>
            <div class="item"><strong>Teacher 80%:</strong> ${Number(row.teacher_share || 0).toLocaleString()}</div>
            <div class="item"><strong>School 20%:</strong> ${Number(row.school_share || 0).toLocaleString()}</div>
            <div class="item"><strong>Date:</strong> ${row.payment_date || ""}</div>
          </div>
        </body>
      </html>
    `
    const w = window.open("", "_blank")
    w.document.write(html)
    w.document.close()
    w.print()
  }

  return (
    <AuthGuard>
      {(user) => (
        <AppShell user={user}>
          <h1 className="title">Payments</h1>
          <p className="subtitle">Auto calculate 80% teacher / 20% school</p>
          {user.role !== "admin" ? <div className="notice">User role is view only. Print and export are allowed.</div> : null}

          <div className="card">
            <div className="form-grid">
              <select value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })}>
                <option value="">Select student</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.name} - {s.teacher}</option>)}
              </select>
              <input type="number" placeholder="Total amount" value={form.total_amount} onChange={(e) => setForm({ ...form, total_amount: e.target.value })} />
              <input type="date" value={form.payment_date} onChange={(e) => setForm({ ...form, payment_date: e.target.value })} />
            </div>
            <div style={{ height: 14 }} />
            <div className="actions">
              <button className="btn btn-primary" onClick={save} disabled={user.role !== "admin"}>Save</button>
              <button className="btn btn-outline" onClick={() => { setForm({ student_id: "", total_amount: "", payment_date: "" }); setEditingId(null) }}>Clear</button>
              <button className="btn btn-outline" onClick={() => exportRowsToCSV("payments-report.csv", rows)}>Export CSV</button>
            </div>
          </div>

          <div className="card table-wrap">
            <table>
              <thead><tr><th>Student</th><th>Teacher</th><th>100%</th><th>80%</th><th>20%</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.student_name}</td>
                    <td><span className="badge">{row.teacher_name}</span></td>
                    <td>{Number(row.total_amount || 0).toLocaleString()}</td>
                    <td>{Number(row.teacher_share || 0).toLocaleString()}</td>
                    <td>{Number(row.school_share || 0).toLocaleString()}</td>
                    <td>{row.payment_date}</td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-outline" onClick={() => printReceipt(row)}>Print</button>
                        <button className="btn btn-outline" onClick={() => edit(row)} disabled={user.role !== "admin"}>Edit</button>
                        <button className="btn btn-danger" onClick={() => remove(row.id)} disabled={user.role !== "admin"}>Delete</button>
                      </div>
                    </td>
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
