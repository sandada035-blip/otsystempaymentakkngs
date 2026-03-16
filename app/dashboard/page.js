"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import AuthGuard from "@/components/AuthGuard"
import AppShell from "@/components/AppShell"
import IncomeChart from "@/components/IncomeChart"

export default function DashboardPage() {
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [payments, setPayments] = useState([])

  useEffect(() => {
    async function load() {
      const [{ data: s }, { data: t }, { data: p }] = await Promise.all([
        supabase.from("students").select("*"),
        supabase.from("teachers").select("*"),
        supabase.from("payments").select("*").order("payment_date", { ascending: true })
      ])
      setStudents(s || [])
      setTeachers(t || [])
      setPayments(p || [])
    }
    load()
  }, [])

  const summary = useMemo(() => {
    const total = payments.reduce((a, b) => a + Number(b.total_amount || 0), 0)
    const teacher = payments.reduce((a, b) => a + Number(b.teacher_share || 0), 0)
    const school = payments.reduce((a, b) => a + Number(b.school_share || 0), 0)
    return { total, teacher, school }
  }, [payments])

  const chartData = useMemo(() => {
    const map = {}
    payments.forEach((p) => {
      const key = String(p.payment_date || "").slice(0, 7) || "Unknown"
      map[key] = (map[key] || 0) + Number(p.total_amount || 0)
    })
    return {
      labels: Object.keys(map),
      values: Object.values(map)
    }
  }, [payments])

  return (
    <AuthGuard>
      {(user) => (
        <AppShell user={user}>
          <div className="topbar">
            <div>
              <h1 className="title">Dashboard</h1>
              <p className="subtitle">Overview, statistics, and charts</p>
            </div>
          </div>

          <div className="grid4">
            <div className="stat blue"><h3>Students</h3><strong>{students.length}</strong></div>
            <div className="stat purple"><h3>Teachers</h3><strong>{teachers.length}</strong></div>
            <div className="stat green"><h3>Payments</h3><strong>{payments.length}</strong></div>
            <div className="stat orange"><h3>Total 100%</h3><strong>{summary.total.toLocaleString()}</strong></div>
          </div>

          <div className="grid3" style={{ marginTop: 16 }}>
            <div className="stat dark"><h3>Teacher 80%</h3><strong>{summary.teacher.toLocaleString()}</strong></div>
            <div className="stat teal"><h3>School 20%</h3><strong>{summary.school.toLocaleString()}</strong></div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h2 style={{ marginTop: 0 }}>Income Chart</h2>
            <IncomeChart labels={chartData.labels} values={chartData.values} />
          </div>
        </AppShell>
      )}
    </AuthGuard>
  )
}
