import "./globals.css"

export const metadata = {
  title: "School System PRO MAX FULL",
  description: "School management system"
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
