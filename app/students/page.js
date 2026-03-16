"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import AuthGuard from "@/components/AuthGuard"
import AppShell from "@/components/AppShell"

export default function StudentsPage() {
  const [rows, setRows] = useState([])
  const [teachers, setTeachers] = useState([])
  const [form, setForm] = useState({ name: "", gender: "", grade: "", teacher: "" })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const [{ data: studentsData }, { data: teachersData }] = await Promise.all([
      supabase.from("students").select("*").order("created_at", { ascending: false }),
      supabase.from("teachers").select("*").order("name")
    ])
    setRows(studentsData || [])
    setTeachers(teachersData || [])
  }

  async function save() {
    if (editingId) await supabase.from("students").update(form).eq("id", editingId)
    else await supabase.from("students").insert([form])
    setForm({ name: "", gender: "", grade: "", teacher: "" })
    setEditingId(null)
    loadData()
  }

  function edit(row) {
    setEditingId(row.id)
    setForm({ name: row.name || "", gender: row.gender || "", grade: row.grade || "", teacher: row.teacher || "" })
  }

  async function remove(id) {
    await supabase.from("students").delete().eq("id", id)
    loadData()
  }

  return (
    <AuthGuard>
      {(user) => (
        <AppShell user={user}>
          <h1 className="title">Students</h1>
          <p className="subtitle">Admin can create/update/delete. User can view only.</p>
          {user.role !== "admin" ? <div className="notice">User role is view only.</div> : null}

          <div className="card">
            <div className="form-grid">
              <input placeholder="Student Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input placeholder="Grade" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
              <select value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })}>
                <option value="">Select Teacher</option>
                {teachers.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </div>
            <div style={{ height: 14 }} />
            <div className="actions">
              <button className="btn btn-primary" onClick={save} disabled={user.role !== "admin"}>Save</button>
              <button className="btn btn-outline" onClick={() => { setForm({ name: "", gender: "", grade: "", teacher: "" }); setEditingId(null) }}>Clear</button>
            </div>
          </div>

          <div className="card table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Gender</th><th>Grade</th><th>Teacher</th><th>Actions</th></tr></thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.gender}</td>
                    <td>{row.grade}</td>
                    <td><span className="badge">{row.teacher}</span></td>
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
