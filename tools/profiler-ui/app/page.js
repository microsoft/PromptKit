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
import { parseProfileData } from "../lib/parser"; // Note the updated function name

export default function Home() {
  const [profile, setProfile] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const text = await file.text();
    // Ensure you updated your parser.js to export parseProfileData
    setProfile(parseProfileData(text));
  };

  return (
    <main className="p-10 bg-slate-950 text-white min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">PromptKit Profiler v1</h1>
        <p className="text-slate-400 mb-8">
          AI-Driven Token & Structural Analysis (Issue #44)
        </p>

        {/* Upload Section */}
        <div className="mb-10 p-6 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50">
          <input
            type="file"
            onChange={handleFileUpload}
            className="block w-full text-sm text-slate-400"
          />
        </div>

        {profile && (
          <div className="space-y-8">
            {/* 1. Executive Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 p-6 rounded-xl border border-emerald-500/30">
                <h3 className="text-slate-400 text-sm mb-1">
                  Efficiency Score
                </h3>
                <p className="text-5xl font-bold text-emerald-400">
                  {profile.summary.efficiency_score}/100
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Rating: {profile.summary.efficiency_rating}
                </p>
              </div>
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 col-span-2">
                <h3 className="text-slate-400 text-sm mb-2">Key Insights</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
                  {profile.summary.key_findings.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 2. Token Weight Chart */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h2 className="text-xl font-semibold mb-6 text-blue-400">
                Token Weight per Component
              </h2>
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={profile.components}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "none",
                      }}
                    />
                    <Bar
                      dataKey="tokens"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3. Optimization Recommendations Table */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800">
                <h2 className="text-lg font-semibold text-orange-400">
                  Optimization Recommendations
                </h2>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="p-4 font-medium">Proposed Action</th>
                    <th className="p-4 font-medium">Est. Savings</th>
                    <th className="p-4 font-medium">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {profile.recommendations.map((rec, i) => (
                    <tr key={i} className="text-sm hover:bg-slate-800/30">
                      {/* Fallback to 'issue' if 'action' is missing */}
                      <td className="p-4 text-slate-200">
                        {rec.action || rec.issue || "N/A"}
                      </td>
                      <td className="p-4 text-emerald-400">
                        {rec.expected_savings ||
                          rec.estimated_savings ||
                          "0 tokens"}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs">
                          P{rec.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
