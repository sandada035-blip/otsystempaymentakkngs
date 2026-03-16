"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import bcrypt from "bcryptjs"
import { supabase } from "@/lib/supabase"
import { setStoredUser } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function login() {
    setError("")

    const { data, error } = await supabase
      .from("users")
      .select("id,school_id,email,role,password,password_hash")
      .eq("email", email)
      .single()

    if (error || !data) {
      setError("Invalid login")
      return
    }

    let valid = false

    if (data.password_hash) {
      valid = await bcrypt.compare(password, data.password_hash)
    } else {
      valid = data.password === password
    }

    if (!valid) {
      setError("Invalid login")
      return
    }

    setStoredUser({
      id: data.id,
      school_id: data.school_id,
      email: data.email,
      role: data.role
    })

    router.push("/dashboard")
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>Login Form</h1>
        <p className="muted">Admin = full access, User = view only</p>

        {error ? <div className="error">{error}</div> : null}

        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div style={{ height: 12 }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div style={{ height: 16 }} />
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={login}>Login</button>

        <div style={{ marginTop: 16 }} className="muted">
          Admin: admin@school.com / 123456<br />
          User: user@school.com / 123456
        </div>
      </div>
    </div>
  )
}
