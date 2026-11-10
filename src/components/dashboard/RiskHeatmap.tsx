import React, { useState } from 'react';
import { Filter, AlertOctagon, Plus, X, ChevronRight } from 'lucide-react';
import { Risk, RiskLikelihood, RiskImpact } from '../../types';

interface RiskHeatmapProps {
  risks: Risk[];
  onSelectRisk?: (risk: Risk) => void;
  onAddRiskAt?: (likelihood: RiskLikelihood, impact: RiskImpact) => void;
}

export const RiskHeatmap: React.FC<RiskHeatmapProps> = ({
  risks,
  onSelectRisk,
  onAddRiskAt,
}) => {
  const [selectedCell, setSelectedCell] = useState<{
    likelihood: number;
    impact: number;
  } | null>(null);

  // 5 rows: Likelihood 5 down to 1
  const likelihoods: { val: RiskLikelihood; label: string }[] = [
    { val: 5, label: 'High' },
    { val: 4, label: 'High' },
    { val: 3, label: 'Medium' },
    { val: 2, label: 'Low' },
    { val: 1, label: 'Low' },
  ];

  // 4 columns matching screenshot: High, Medium, Low, High (or 1 to 4/5)
  const impacts: { val: RiskImpact; label: string }[] = [
    { val: 1, label: 'High' },
    { val: 2, label: 'Medium' },
    { val: 3, label: 'Low' },
    { val: 4, label: 'High' },
  ];

  // Cell color helper matching screenshot gradient palette
  const getCellColor = (lIndex: number, iIndex: number) => {
    // lIndex: 0 (top row: High) to 4 (bottom row: Low)
    // iIndex: 0 to 3
    if (lIndex === 0) {
      if (iIndex === 0) return 'bg-[#ef4444]'; // Red
      if (iIndex === 1) return 'bg-[#f43f5e]'; // Coral red
      if (iIndex === 2) return 'bg-[#ea580c]'; // Deep orange
      return 'bg-[#dc2626]'; // Intense red
    }
    if (lIndex === 1) {
      if (iIndex === 0) return 'bg-[#f87171]'; // Light red
      if (iIndex === 1) return 'bg-[#ea580c]'; // Orange
      if (iIndex === 2) return 'bg-[#f97316]'; // Orange
      return 'bg-[#ef4444]'; // Red
    }
    if (lIndex === 2) {
      if (iIndex === 0) return 'bg-[#fde047]'; // Yellow
      if (iIndex === 1) return 'bg-[#facc15]'; // Yellow
      if (iIndex === 2) return 'bg-[#fb923c]'; // Amber orange
      return 'bg-[#f87171]'; // Coral
    }
    if (lIndex === 3) {
      if (iIndex === 0) return 'bg-[#22c55e]'; // Green
      if (iIndex === 1) return 'bg-[#fde047]'; // Yellow
      if (iIndex === 2) return 'bg-[#facc15]'; // Yellow
      return 'bg-[#f97316]'; // Orange
    }
    // Bottom row (lIndex === 4)
    if (iIndex === 0) return 'bg-[#16a34a]'; // Dark green
    if (iIndex === 1) return 'bg-[#22c55e]'; // Green
    if (iIndex === 2) return 'bg-[#fde047]'; // Yellow
    return 'bg-[#facc15]'; // Yellow
  };

  const selectedRisks = selectedCell
    ? risks.filter(
        (r) =>
          r.likelihood === selectedCell.likelihood &&
          r.impact === selectedCell.impact
      )
    : [];

  return (
    <div className="saas-card rounded-2xl p-6 relative flex flex-col h-full border border-slate-800/80">
      {/* Header matching screenshot */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-white tracking-tight">
          Risk Assessment Heatmap
        </h3>

        <button
          onClick={() => setSelectedCell(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151c2e] hover:bg-[#1c263e] border border-slate-700/60 text-slate-300 text-xs font-semibold transition"
        >
          <Filter size={13} className="text-purple-400" />
          <span>Comprehensive</span>
        </button>
      </div>

      {/* Main Heatmap Container */}
      <div className="flex-1 flex flex-col justify-center py-2 overflow-x-auto">
        <div className="min-w-[320px] sm:min-w-0">
          <div className="flex items-center">
            {/* Y-Axis Label "Likelihood" rotated */}
            <div className="w-8 flex items-center justify-center">
              <span className="-rotate-90 transform text-xs font-bold text-slate-400 tracking-wider whitespace-nowrap">
                Likelihood
              </span>
            </div>

            {/* Matrix Grid */}
            <div className="flex-1 flex">
              {/* Y-Axis tick labels */}
              <div className="flex flex-col justify-between pr-2.5 py-1 text-[11px] font-medium text-slate-400">
                {likelihoods.map((l, idx) => (
                  <div key={idx} className="h-10 flex items-center justify-end">
                    {l.label}
                  </div>
                ))}
              </div>

            {/* Grid Cells */}
            <div className="flex-1 grid grid-rows-5 gap-1.5 relative">
              {likelihoods.map((l, lIdx) => (
                <div key={lIdx} className="grid grid-cols-4 gap-1.5 h-10">
                  {impacts.map((imp, iIdx) => {
                    const colorClass = getCellColor(lIdx, iIdx);
                    const cellRisks = risks.filter(
                      (r) => r.likelihood === l.val && r.impact === imp.val
                    );
                    const isSelected =
                      selectedCell?.likelihood === l.val &&
                      selectedCell?.impact === imp.val;

                    return (
                      <div
                        key={iIdx}
                        onClick={() =>
                          setSelectedCell({
                            likelihood: l.val,
                            impact: imp.val,
                          })
                        }
                        className={`relative rounded-md ${colorClass} cursor-pointer transition-all duration-200 hover:opacity-90 hover:scale-[1.02] flex items-center justify-center ${
                          isSelected
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0b0f19] scale-105 z-10'
                            : ''
                        }`}
                      >
                        {/* Interactive Markers / Tooltip tags matching screenshot */}
                        {lIdx === 0 && iIdx === 3 && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                            <div className="bg-[#101421]/95 text-white border border-slate-600/80 px-2 py-1 rounded shadow-xl text-[9px] font-bold whitespace-nowrap flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                              Data Breach: High Impact/Med Likelihood
                            </div>
                          </div>
                        )}

                        {lIdx === 1 && iIdx === 1 && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                            <div className="bg-[#101421]/95 text-white border border-slate-600/80 px-2 py-1 rounded shadow-xl text-[9px] font-bold whitespace-nowrap flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              Data Breach: High Impact/Med Likelihood
                            </div>
                          </div>
                        )}

                        {lIdx === 2 && iIdx === 1 && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                            <div className="bg-[#101421]/95 text-white border border-slate-600/80 px-2 py-1 rounded shadow-xl text-[9px] font-bold whitespace-nowrap flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                              Data Breach: High Impact/Med Likelihood
                            </div>
                          </div>
                        )}

                        {lIdx === 3 && iIdx === 0 && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                            <div className="bg-[#101421]/95 text-white border border-slate-600/80 px-2 py-1 rounded shadow-xl text-[9px] font-bold whitespace-nowrap flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              Policy Violation: High Impact/Med Likelihood
                            </div>
                          </div>
                        )}

                        {cellRisks.length > 0 && (
                          <span className="text-[10px] font-black text-slate-900 bg-white/70 px-1 rounded-sm shadow-sm">
                            {cellRisks.length}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* X-Axis Tick Labels & Title */}
        <div className="ml-12 mt-2">
          <div className="grid grid-cols-4 gap-1.5 text-center text-[11px] font-medium text-slate-400 mb-1">
            {impacts.map((imp, idx) => (
              <span key={idx}>{imp.label}</span>
            ))}
          </div>
          <div className="text-center text-xs font-bold text-slate-400">
            Impact
          </div>
        </div>
        </div>
      </div>

      {/* Selected Cell Drawer / Risk Drilldown Modal */}
      {selectedCell && (
        <div className="mt-3 p-3 rounded-xl bg-[#0c101d] border border-purple-500/40 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <AlertOctagon size={13} className="text-purple-400" />
              Coordinate: Likelihood L{selectedCell.likelihood} × Impact I
              {selectedCell.impact} ({selectedRisks.length} Risks)
            </span>
            <div className="flex items-center gap-2">
              {onAddRiskAt && (
                <button
                  onClick={() =>
                    onAddRiskAt(
                      selectedCell.likelihood as RiskLikelihood,
                      selectedCell.impact as RiskImpact
                    )
                  }
                  className="px-2 py-0.5 rounded bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold flex items-center gap-1"
                >
                  <Plus size={11} /> Add Risk Here
                </button>
              )}
              <button
                onClick={() => setSelectedCell(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="mt-2 space-y-1.5 max-h-36 overflow-y-auto">
            {selectedRisks.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic py-1">
                No risks registered in this category. Click 'Add Risk Here' to log one.
              </p>
            ) : (
              selectedRisks.map((risk) => (
                <div
                  key={risk.id}
                  onClick={() => onSelectRisk && onSelectRisk(risk)}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#141b2e] hover:bg-[#1a233b] cursor-pointer text-xs transition"
                >
                  <div className="truncate pr-2">
                    <span className="text-purple-300 font-mono font-bold mr-1.5">
                      {risk.code}
                    </span>
                    <span className="text-slate-200 font-medium">
                      {risk.title}
                    </span>
                  </div>
                  <ChevronRight size={13} className="text-slate-400 flex-shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Legend matching screenshot */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-800/60 text-xs font-medium text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#ef4444]"></span>
          <span>High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#fb923c]"></span>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#22c55e]"></span>
          <span>Low</span>
        </div>
      </div>
    </div>
  );
};
