export function getStoredUser() {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem("school_user")
  return raw ? JSON.parse(raw) : null
}

export function setStoredUser(user) {
  if (typeof window === "undefined") return
  localStorage.setItem("school_user", JSON.stringify(user))
}

export function clearStoredUser() {
  if (typeof window === "undefined") return
  localStorage.removeItem("school_user")
}
