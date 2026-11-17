// app/admin/analytics/page.tsx
"use client";

import React from "react";
import { mockAnalyticsData } from "@/lib/mock-admin-analytics";
import { BarChart3, Clock, ShieldAlert } from "lucide-react";

export default function AdminAnalyticsPage() {
  const { metrics, emotionsBreakdown, weeklyTrend } = mockAnalyticsData;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-6 md:p-10 space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-[#991b1b]" />
            Stress Heatmap & Emotional Analytics
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time sentiment tracking, cluster-based emotional breakdown, and platform-wide venting traffic.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#991b1b]/10 text-[#991b1b] border border-[#991b1b]/20">
            <span className="w-2 h-2 rounded-full bg-[#991b1b] animate-pulse"></span>
            Telemetry Active
          </span>
        </div>
      </div>

      {/* Top Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div 
            key={idx}
            className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 shadow-sm hover:border-[#991b1b]/40 transition-all duration-200"
          >
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{metric.title}</p>
            <div className="flex items-baseline justify-between mt-3">
              <h3 className="text-2xl font-bold text-white">{metric.value}</h3>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Heatmap Matrix & Emotion Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Stress Heatmap Matrix (2 Columns) */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Venting Frequency Heatmap</h3>
              <p className="text-xs text-zinc-400">Daily stress index and post volume across active hours</p>
            </div>
            <Clock className="w-5 h-5 text-zinc-500" />
          </div>

          <div className="bg-[#0a0a0a] border border-zinc-900/80 rounded-lg p-5 space-y-3">
            <div className="text-xs text-zinc-500 font-mono mb-2">WEEKLY STRESS INTENSITY MATRIX</div>
            <div className="grid grid-cols-7 gap-2 sm:gap-3">
              {weeklyTrend.map((item, index) => (
                <div key={index} className="space-y-2 text-center">
                  <div className="text-xs text-zinc-400 font-medium">{item.day}</div>
                  <div 
                    className={`h-36 rounded-md flex flex-col justify-end p-2 transition-all hover:ring-1 hover:ring-[#991b1b] ${
                      item.stressLevel > 80 
                        ? 'bg-[#991b1b] text-white shadow-lg shadow-[#991b1b]/20' 
                        : item.stressLevel > 70 
                        ? 'bg-[#991b1b]/50 text-zinc-200' 
                        : 'bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold">{item.stressLevel}%</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">{item.vents} vents</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
            <span>Low Stress (Normal)</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-zinc-900 rounded"></span>
              <span className="w-3 h-3 bg-[#991b1b]/50 rounded"></span>
              <span className="w-3 h-3 bg-[#991b1b] rounded"></span>
            </div>
            <span>Critical Burnout Spike</span>
          </div>
        </div>

        {/* Emotion Distribution Breakdown */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Semantic Cluster Share</h3>
            <p className="text-xs text-zinc-400">Primary emotional drivers across platform posts</p>
          </div>

          <div className="space-y-4 my-auto">
            {emotionsBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 font-medium">{item.emotion}</span>
                  <span className="text-zinc-400 font-mono">{item.percentage}%</span>
                </div>
                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#991b1b]/10 border border-[#991b1b]/20 rounded-lg p-3 text-xs text-zinc-300 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#991b1b] shrink-0 mt-0.5" />
            <span>High burnout concentration in corporate & tech clusters during weekend transitions.</span>
          </div>
        </div>

      </div>

    </div>
  );
}