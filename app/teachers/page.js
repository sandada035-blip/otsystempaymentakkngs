"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import AuthGuard from "@/components/AuthGuard"
import AppShell from "@/components/AppShell"

export default function TeachersPage() {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({ name: "", gender: "", class_name: "", phone: "" })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const { data } = await supabase.from("teachers").select("*").order("created_at", { ascending: false })
    setRows(data || [])
  }

  async function save() {
    if (editingId) await supabase.from("teachers").update(form).eq("id", editingId)
    else await supabase.from("teachers").insert([form])
    setForm({ name: "", gender: "", class_name: "", phone: "" })
    setEditingId(null)
    loadData()
  }

  function edit(row) {
    setEditingId(row.id)
    setForm({ name: row.name || "", gender: row.gender || "", class_name: row.class_name || "", phone: row.phone || "" })
  }

  async function remove(id) {
    await supabase.from("teachers").delete().eq("id", id)
    loadData()
  }

  return (
    <AuthGuard>
      {(user) => (
        <AppShell user={user}>
          <h1 className="title">Teachers</h1>
          <p className="subtitle">Admin can create/update/delete. User can view only.</p>
          {user.role !== "admin" ? <div className="notice">User role is view only.</div> : null}

          <div className="card">
            <div className="form-grid">
              <input placeholder="Teacher Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input placeholder="Class / Subject" value={form.class_name} onChange={(e) => setForm({ ...form, class_name: e.target.value })} />
              <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div style={{ height: 14 }} />
            <div className="actions">
              <button className="btn btn-primary" onClick={save} disabled={user.role !== "admin"}>Save</button>
              <button className="btn btn-outline" onClick={() => { setForm({ name: "", gender: "", class_name: "", phone: "" }); setEditingId(null) }}>Clear</button>
            </div>
          </div>

          <div className="card table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Gender</th><th>Class</th><th>Phone</th><th>Actions</th></tr></thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.gender}</td>
                    <td><span className="badge">{row.class_name}</span></td>
                    <td>{row.phone}</td>
                    <td>
                      <div className="actions">
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
