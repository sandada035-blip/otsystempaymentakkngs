"use client"

import { useEffect, useRef } from "react"
import { Chart } from "chart.js/auto"

export default function IncomeChart({ labels = [], values = [] }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const chart = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Monthly Income",
            data: values
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    })

    return () => chart.destroy()
  }, [labels, values])

  return (
    <div style={{ height: 320 }}>
      <canvas ref={canvasRef} />
    </div>
  )
}
