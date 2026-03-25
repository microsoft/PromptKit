"use client";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Note: For this to work, ensure parseProfileData just runs JSON.parse(text)
import { parseProfileData } from "../lib/parser"; 

export default function Home() {
  const [profile, setProfile] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const text = await file.text();
    setProfile(parseProfileData(text));
  };

  // Helper function to color-code severity badges
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical": return "bg-red-900/50 text-red-400 border-red-800";
      case "high": return "bg-orange-900/50 text-orange-400 border-orange-800";
      case "medium": return "bg-amber-900/50 text-amber-400 border-amber-800";
      case "low": return "bg-blue-900/50 text-blue-400 border-blue-800";
      default: return "bg-slate-800 text-slate-300 border-slate-700";
    }
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
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-900/50 file:text-blue-400 hover:file:bg-blue-900/70 cursor-pointer"
          />
        </div>

        {profile && (
          <div className="space-y-8">
            
            {/* 1. Executive Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 col-span-2">
                <h3 className="text-slate-400 text-sm mb-2 uppercase font-semibold">Executive Narrative</h3>
                <p className="text-slate-200 text-lg leading-relaxed">
                  {profile.executiveSummary.narrative}
                </p>
              </div>
              <div className="grid grid-rows-2 gap-4">
                <div className="bg-slate-900 p-6 rounded-xl border border-red-900/30 flex flex-col justify-center">
                  <h3 className="text-slate-400 text-xs uppercase mb-1">Wasteful Tokens</h3>
                  <p className="text-4xl font-bold text-red-400">
                    {profile.executiveSummary.wastefulTokens.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {profile.executiveSummary.wastePercentage}% of total session
                  </p>
                </div>
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col justify-center">
                  <h3 className="text-slate-400 text-xs uppercase mb-1">Total Session Tokens</h3>
                  <p className="text-3xl font-bold text-slate-200">
                    {profile.executiveSummary.totalTokens.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Token Waste Chart (Aggregated from Findings) */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h2 className="text-xl font-semibold mb-6 text-blue-400">
                Waste Attribution by Component
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profile.findings}>
                    <XAxis 
                      dataKey="component" 
                      stroke="#64748b" 
                      fontSize={10} 
                      tickFormatter={(val) => val.split('/').pop().substring(0, 15) + '...'} 
                    />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                      itemStyle={{ color: "#f8fafc" }}
                    />
                    <Bar dataKey="tokenCost" fill="#f87171" radius={[4, 4, 0, 0]} name="Wasted Tokens" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3. Inefficiency Findings Table */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800">
                <h2 className="text-lg font-semibold text-slate-200">
                  Detected Inefficiencies
                </h2>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="p-4 font-medium w-24">ID</th>
                    <th className="p-4 font-medium w-32">Severity</th>
                    <th className="p-4 font-medium">Description</th>
                    <th className="p-4 font-medium w-32 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {profile.findings.map((finding) => (
                    <tr key={finding.id} className="text-sm hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 text-slate-400 font-mono">{finding.id}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md border text-xs font-medium uppercase tracking-wider ${getSeverityColor(finding.severity)}`}>
                          {finding.severity}
                        </span>
                      </td>
                      <td className="p-4 text-slate-200">
                        <p className="mb-1">{finding.description}</p>
                        <p className="text-xs text-slate-500 font-mono">{finding.component}</p>
                      </td>
                      <td className="p-4 text-red-400 font-mono text-right">
                        {finding.tokenCost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 4. Remediation Plan Table */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800">
                <h2 className="text-lg font-semibold text-emerald-400">
                  Remediation Plan
                </h2>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="p-4 font-medium w-1/4">Component</th>
                    <th className="p-4 font-medium w-1/2">Proposed Change</th>
                    <th className="p-4 font-medium w-1/4">Risk Factor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {profile.remediationPlan.map((rec, i) => (
                    <tr key={i} className="text-sm hover:bg-slate-800/30">
                      <td className="p-4 text-slate-400 font-mono text-xs align-top">
                        {rec.component}
                      </td>
                      <td className="p-4 text-emerald-100 align-top">
                        <p className="mb-2">{rec.change}</p>
                        <p className="text-xs text-emerald-500 font-mono">Est. Savings: {rec.expectedSavings} tokens</p>
                      </td>
                      <td className="p-4 text-amber-500/80 text-xs align-top">
                        {rec.risk}
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