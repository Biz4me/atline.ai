"use client"

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Lun", score: 6.5 },
  { name: "Mar", score: 7.2 },
  { name: "Mer", score: 7.8 },
  { name: "Jeu", score: 7.4 },
  { name: "Ven", score: 8.2 },
]

export function HistoryChart() {
  return (
    <div className="rounded-[8px] border border-border bg-card p-4">
      <h3 className="mb-3 text-[13px] font-medium text-foreground">Dernières simulations</h3>
      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717A", fontSize: 10 }}
            />
            <YAxis
              domain={[0, 10]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717A", fontSize: 10 }}
              ticks={[0, 5, 10]}
            />
            <Tooltip
              contentStyle={{
                background: "#18181B",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "6px",
                fontSize: "11px",
              }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#7C6FE8" }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#7C6FE8"
              strokeWidth={2}
              dot={{ fill: "#7C6FE8", r: 3 }}
              activeDot={{ r: 5, fill: "#7C6FE8" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
