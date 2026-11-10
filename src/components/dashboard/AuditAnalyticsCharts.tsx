import React, { useState } from 'react';
import { MoreHorizontal, ChevronDown } from 'lucide-react';

interface AuditAnalyticsChartsProps {
  onOpenAuditModule?: () => void;
}

export const AuditAnalyticsCharts: React.FC<AuditAnalyticsChartsProps> = ({
  onOpenAuditModule,
}) => {
  const [timeRange, setTimeRange] = useState('6 months');
  const [hoveredPoint, setHoveredPoint] = useState<{
    month: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  // Line chart data points matching screenshot curve
  // Jan (~40), Feb (~65), May (~135), Apr (~110), Sep (~170), Nov (~130)
  const lineData = [
    { month: 'Jan', val: 40, x: 25, y: 130 },
    { month: 'Feb', val: 65, x: 75, y: 110 },
    { month: 'May', val: 135, x: 125, y: 55 },
    { month: 'Apr', val: 110, x: 175, y: 75 },
    { month: 'Sep', val: 170, x: 225, y: 25 },
    { month: 'Nov', val: 130, x: 275, y: 60 },
  ];

  // SVG smooth bezier path
  const splinePath =
    'M 25 130 C 50 130, 55 110, 75 110 C 95 110, 105 55, 125 55 C 145 55, 155 80, 175 75 C 195 70, 205 25, 225 25 C 245 25, 255 60, 275 60';
  const areaPath = `${splinePath} L 275 160 L 25 160 Z`;

  // Stacked bar chart data matching screenshot
  // 5 bars with Completed (purple), Pending (yellow), Overdue (coral)
  const barData = [
    { completed: 48, pending: 18, overdue: 12 }, // ~78 total
    { completed: 35, pending: 12, overdue: 8 },  // ~55 total
    { completed: 38, pending: 22, overdue: 10 }, // ~70 total
    { completed: 55, pending: 25, overdue: 12 }, // ~92 total
    { completed: 28, pending: 14, overdue: 10 }, // ~52 total
  ];

  return (
    <div className="saas-card rounded-2xl p-6 border border-slate-800/80 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-white tracking-tight">
          Audit Analytics
        </h3>
        <button
          onClick={onOpenAuditModule}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition"
          title="More Audit Options"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Two columns: Trail Activity + Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 items-stretch">
        {/* Left: Audit Trail Activity */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300">
              Audit Trail Activity
            </span>
            <div className="flex items-center gap-1 bg-[#141b2c] border border-slate-700/60 text-slate-300 text-[11px] px-2.5 py-1 rounded-lg cursor-pointer hover:bg-slate-800 transition">
              <span>{timeRange}</span>
              <ChevronDown size={12} className="text-slate-400" />
            </div>
          </div>

          <div className="flex-1 relative flex items-center">
            {/* Y-Axis numbers: 200, 150, 100, 50, 0 */}
            <div className="flex flex-col justify-between h-36 text-[10px] text-slate-500 pr-2 font-mono">
              <span>200</span>
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>

            {/* SVG Glowing Line Chart */}
            <div className="flex-1 relative h-36">
              <svg
                viewBox="0 0 300 170"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient
                    id="auditPurpleGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                  </linearGradient>

                  <filter
                    id="glowFilter"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="0"
                      stdDeviation="3"
                      floodColor="#c084fc"
                      floodOpacity="0.8"
                    />
                  </filter>
                </defs>

                {/* Horizontal reference lines */}
                <line
                  x1="10"
                  y1="25"
                  x2="290"
                  y2="25"
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                />
                <line
                  x1="10"
                  y1="60"
                  x2="290"
                  y2="60"
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                />
                <line
                  x1="10"
                  y1="100"
                  x2="290"
                  y2="100"
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                />
                <line
                  x1="10"
                  y1="140"
                  x2="290"
                  y2="140"
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                />

                {/* Gradient area */}
                <path d={areaPath} fill="url(#auditPurpleGradient)" />

                {/* Glowing neon spline line matching screenshot */}
                <path
                  d={splinePath}
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="url(#glowFilter)"
                />

                {/* Interactive Points */}
                {lineData.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#ffffff"
                    stroke="#a855f7"
                    strokeWidth="2.5"
                    className="cursor-pointer hover:r-6 transition-all"
                    onMouseEnter={() =>
                      setHoveredPoint({
                        month: pt.month,
                        value: pt.val,
                        x: pt.x,
                        y: pt.y,
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </svg>

              {/* Tooltip */}
              {hoveredPoint && (
                <div
                  className="absolute -top-3 px-2 py-1 rounded bg-slate-900 border border-purple-500/70 text-white text-[10px] font-bold shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full"
                  style={{ left: `${(hoveredPoint.x / 300) * 100}%` }}
                >
                  {hoveredPoint.month}: {hoveredPoint.value} Actions
                </div>
              )}

              {/* X-Axis Month labels */}
              <div className="flex justify-between px-2 pt-1 text-[10px] text-slate-400 font-medium">
                {lineData.map((d, i) => (
                  <span key={i}>{d.month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Audit Status Breakdown */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300">
              Audit Status Breakdown
            </span>
          </div>

          <div className="flex-1 flex items-center">
            {/* Y-Axis numbers: 100, 75, 50, 25, 0 */}
            <div className="flex flex-col justify-between h-36 text-[10px] text-slate-500 pr-2 font-mono">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>

            {/* Stacked Bars Container */}
            <div className="flex-1 h-36 flex items-end justify-between px-3 gap-3 border-b border-slate-800 pb-1">
              {barData.map((bar, idx) => {
                const total = bar.completed + bar.pending + bar.overdue;
                return (
                  <div
                    key={idx}
                    className="flex-1 max-w-[28px] h-full flex flex-col justify-end group cursor-pointer relative"
                  >
                    {/* Hover summary */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-slate-900 border border-slate-700 text-white text-[9px] px-1.5 py-0.5 rounded shadow-xl whitespace-nowrap z-20 pointer-events-none">
                      Total: {total}
                    </div>

                    <div className="w-full flex flex-col rounded-t-md overflow-hidden shadow-md">
                      {/* Overdue (top, coral red) */}
                      <div
                        style={{ height: `${(bar.overdue / 100) * 140}px` }}
                        className="w-full bg-[#f43f5e] hover:brightness-110 transition"
                        title={`Overdue: ${bar.overdue}`}
                      />
                      {/* Pending (middle, yellow) */}
                      <div
                        style={{ height: `${(bar.pending / 100) * 140}px` }}
                        className="w-full bg-[#fbbf24] hover:brightness-110 transition"
                        title={`Pending: ${bar.pending}`}
                      />
                      {/* Completed (bottom, violet purple) */}
                      <div
                        style={{ height: `${(bar.completed / 100) * 140}px` }}
                        className="w-full bg-[#9333ea] hover:brightness-110 transition"
                        title={`Completed: ${bar.completed}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend matching screenshot */}
          <div className="flex items-center justify-center gap-4 mt-3 text-[11px] font-medium text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#9333ea]"></span>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#fbbf24]"></span>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#f43f5e]"></span>
              <span>Overdue</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
