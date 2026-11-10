import React, { useState } from 'react';
import {
  FolderLock,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Paperclip,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { ComplianceControl, ControlFramework, ControlStatus } from '../../types';

interface ControlsModuleProps {
  controls: ComplianceControl[];
  onOpenCreateControl: () => void;
  onUpdateControl: (id: string, updates: Partial<ComplianceControl>) => void;
}

export const ControlsModule: React.FC<ControlsModuleProps> = ({
  controls,
  onOpenCreateControl,
  onUpdateControl,
}) => {
  const [selectedFramework, setSelectedFramework] = useState<string>('All');
  const [search, setSearch] = useState('');

  const frameworks: (ControlFramework | 'All')[] = ['All', 'ISO 27001', 'SOC 2', 'GDPR', 'NIST CSF'];

  const filteredControls = controls.filter((c) => {
    const matchFw = selectedFramework === 'All' || c.framework === selectedFramework;
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.controlId.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.owner.toLowerCase().includes(search.toLowerCase());
    return matchFw && matchSearch;
  });

  const getStatusBadge = (status: ControlStatus) => {
    switch (status) {
      case 'Implemented':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40';
      case 'In Progress':
        return 'bg-purple-950/60 text-purple-300 border-purple-500/40';
      case 'Needs Review':
        return 'bg-amber-950/60 text-amber-400 border-amber-500/40';
      case 'Failed':
      default:
        return 'bg-rose-950/60 text-rose-400 border-rose-500/40';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#170e2b] via-[#101424] to-[#0c101d] border border-purple-500/30">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold mb-1">
            <Sparkles size={14} />
            <span>Master Governance & Trust Library</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Security Controls & Framework Compliance
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Continuous audit evidence collection across ISO 27001:2022, SOC 2 Type II, GDPR, and NIST CSF 2.0.
          </p>
        </div>

        <button
          onClick={onOpenCreateControl}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-[0_0_15px_rgba(168,85,247,0.4)] self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Custom Control</span>
        </button>
      </div>

      {/* Framework Readiness Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'ISO 27001:2022', score: 94, controls: '18 / 18 Controls' },
          { name: 'SOC 2 Type II', score: 91, controls: '24 / 26 Controls' },
          { name: 'GDPR Privacy', score: 96, controls: '14 / 14 Controls' },
          { name: 'NIST CSF 2.0', score: 88, controls: '21 / 24 Controls' },
        ].map((f, idx) => (
          <div key={idx} className="saas-card rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{f.name}</span>
              <span className="text-xs font-mono font-bold text-purple-400">{f.score}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                style={{ width: `${f.score}%` }}
                className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full"
              />
            </div>
            <span className="text-[10px] text-slate-400 block">{f.controls}</span>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="saas-card rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search control ID, framework, owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0c101d] border border-slate-700/80 text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {frameworks.map((fw) => (
            <button
              key={fw}
              onClick={() => setSelectedFramework(fw)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                selectedFramework === fw
                  ? 'bg-purple-950/70 text-purple-200 border-purple-500/80'
                  : 'bg-[#101423] text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {fw}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Catalog Table */}
      <div className="saas-card rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0f1422] text-slate-400 font-semibold border-b border-slate-800">
                <th className="py-3 px-4 w-28">Control ID</th>
                <th className="py-3 px-4">Name & Description</th>
                <th className="py-3 px-3">Framework</th>
                <th className="py-3 px-3">Owner</th>
                <th className="py-3 px-3">Compliance Rate</th>
                <th className="py-3 px-3">Evidence</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredControls.map((ctl) => (
                <tr key={ctl.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-purple-400">
                    {ctl.controlId}
                  </td>
                  <td className="py-3.5 px-4 max-w-sm">
                    <p className="font-semibold text-slate-200">{ctl.name}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{ctl.description}</p>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {ctl.framework}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 font-medium">
                    {ctl.owner}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          style={{ width: `${ctl.complianceRate}%` }}
                          className="h-full bg-purple-500 rounded-full"
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-300">{ctl.complianceRate}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Paperclip size={13} className="text-purple-400" />
                      {ctl.evidenceCount} docs
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(ctl.status)}`}>
                      {ctl.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        const nextStatus: ControlStatus =
                          ctl.status === 'Implemented' ? 'Needs Review' : 'Implemented';
                        onUpdateControl(ctl.id, {
                          status: nextStatus,
                          complianceRate: nextStatus === 'Implemented' ? 100 : 70,
                        });
                      }}
                      className="px-2.5 py-1 rounded bg-[#141b2c] hover:bg-slate-800 border border-slate-700/80 text-[11px] font-semibold text-slate-200 transition"
                    >
                      {ctl.status === 'Implemented' ? 'Review' : 'Validate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
