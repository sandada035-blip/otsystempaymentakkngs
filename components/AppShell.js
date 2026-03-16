"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { clearStoredUser } from "@/lib/auth"

function NavItem({ href, label }) {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link href={href} className={active ? "active" : ""}>
      {label}
    </Link>
  )
}

export default function AppShell({ children, user }) {
  const router = useRouter()

  function logout() {
    clearStoredUser()
    router.replace("/login")
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">System Pro MAX</div>
        <div className="brand-sub">School Dashboard</div>

        <div className="nav">
          <NavItem href="/dashboard" label="Dashboard" />
          <NavItem href="/students" label="Students" />
          <NavItem href="/teachers" label="Teachers" />
          <NavItem href="/payments" label="Payments" />
          <NavItem href="/reports" label="Reports" />
        </div>

        <div className="card sidebar-card">
          <div><strong>Role:</strong> {user.role}</div>
          <div className="muted" style={{ marginTop: 8 }}>{user.email}</div>
          <button className="btn btn-danger" style={{ width: "100%", marginTop: 16 }} onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  )
}
