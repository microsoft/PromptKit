import React from 'react';

export default function ExecutiveSummary({ summaryData }) {
  const { narrative, totalTokens, wastefulTokens, wastePercentage, topOptimizations } = summaryData;

  return (
    <div className="p-6 mb-8 border rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
      
      <p className="text-gray-700 mb-6 text-lg">
        {narrative}
      </p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded border border-blue-100">
          <p className="text-sm text-blue-600 font-semibold uppercase">Total Tokens</p>
          <p className="text-3xl font-bold">{totalTokens.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-red-50 rounded border border-red-100">
          <p className="text-sm text-red-600 font-semibold uppercase">Wasteful Tokens</p>
          <p className="text-3xl font-bold">{wastefulTokens.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-orange-50 rounded border border-orange-100">
          <p className="text-sm text-orange-600 font-semibold uppercase">Waste Percentage</p>
          <p className="text-3xl font-bold">{wastePercentage}%</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">Top Optimizations</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          {topOptimizations.map((opt, index) => (
            <li key={index}>
              {opt.description} <span className="font-mono text-sm text-green-600">(~{opt.savings} tokens)</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}