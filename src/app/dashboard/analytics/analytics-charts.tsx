"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#2563eb", "#22c55e", "#94a3b8", "#f59e0b", "#8b5cf6"];

export function AnalyticsCharts({
  trendData,
  statusData,
  breedData,
  trainerData,
  problemData,
}: {
  trendData: { month: string; revenue: number }[];
  statusData: { status: string; count: number }[];
  breedData: { breed: string; count: number }[];
  trainerData: { name: string; sessions_completed: number }[];
  problemData: { problem: string; count: number }[];
}) {
  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Revenue trend</h2>
          <div className="mt-4 h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => [
                    new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(v)),
                    "Revenue",
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Sessions by status</h2>
          <div className="mt-4 h-64 min-w-0">
            {statusData.length === 0 ? (
              <p className="text-sm text-muted">No sessions yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Common breeds</h2>
          <div className="mt-4 h-64 min-w-0">
            {breedData.length === 0 ? (
              <p className="text-sm text-muted">Add breeds on dog profiles.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breedData} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="breed" width={100} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Trainer performance</h2>
          <div className="mt-4 h-64 min-w-0">
            {trainerData.length === 0 ? (
              <p className="text-sm text-muted">Complete sessions to populate.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trainerData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-20}
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="sessions_completed" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">
          Behavioral themes (from free-text, split by comma)
        </h2>
        <div className="mt-4 h-64 min-w-0">
          {problemData.length === 0 ? (
            <p className="text-sm text-muted">Add behavioral notes on dogs.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={problemData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="problem"
                  tick={{ fontSize: 9 }}
                  interval={0}
                  angle={-25}
                  height={70}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </>
  );
}
