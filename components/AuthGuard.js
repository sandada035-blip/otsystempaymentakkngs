"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getStoredUser } from "@/lib/auth"

export default function AuthGuard({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = getStoredUser()
    if (!stored) {
      router.replace("/login")
      return
    }
    setUser(stored)
  }, [router])

  if (!user) {
    return (
      <div className="login-wrap">
        <div className="login-card">Loading...</div>
      </div>
    )
  }

  return children(user)
}
