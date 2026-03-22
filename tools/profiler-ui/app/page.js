"use client";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { parseLogData } from "../lib/parser";

export default function Home() {
  const [chartData, setChartData] = useState(null); // Changed to null for initial state

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const text = await file.text();
    setChartData(parseLogData(text));
  };

  return (
    <main className="p-10 bg-slate-950 text-white min-h-screen font-sans">
      <h1 className="text-3xl font-bold mb-2">PromptKit Profiler</h1>
      <p className="text-slate-400 mb-8">
        Visualizing LLM Reasoning & Risk for Issue #44
      </p>

      <div className="mb-10 p-6 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50">
        <input
          type="file"
          onChange={handleFileUpload}
          className="block w-full text-sm text-slate-400"
        />
      </div>

      {chartData && (
        <div className="space-y-12">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h2 className="text-xl font-semibold mb-6 text-emerald-400">
                Reasoning Grounding
              </h2>
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={chartData.grounding}>
                    <XAxis dataKey="category" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "none",
                      }}
                    />
                    <Bar dataKey="count">
                      {chartData.grounding.map((e, i) => (
                        <Cell key={i} fill={e.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h2 className="text-xl font-semibold mb-6 text-rose-400">
                Risk Hotspots
              </h2>
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={chartData.hotspots}>
                    <XAxis dataKey="category" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "none",
                      }}
                    />
                    <Bar dataKey="count">
                      {chartData.hotspots.map((e, i) => (
                        <Cell key={i} fill={e.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Findings Table */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h2 className="text-xl font-semibold mb-4">Detected Finding IDs</h2>
            <div className="flex flex-wrap gap-3">
              {chartData.findings.map((id) => (
                <span
                  key={id}
                  className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-sm font-mono text-cyan-400"
                >
                  {id.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
