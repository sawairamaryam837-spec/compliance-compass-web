import React, { useState } from 'react';
import {
  BarChart3,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  AlertOctagon,
  Download,
  FileSpreadsheet,
  FileText,
  User,
  Sparkles,
  Filter
} from 'lucide-react';
import { Audit, AuditStatus } from '../../types';

interface AuditAnalyticsModuleProps {
  audits: Audit[];
  onOpenCreateAudit: () => void;
  onUpdateAudit: (id: string, updates: Partial<Audit>) => void;
}

export const AuditAnalyticsModule: React.FC<AuditAnalyticsModuleProps> = ({
  audits,
  onOpenCreateAudit,
  onUpdateAudit,
}) => {
  const [selectedFramework, setSelectedFramework] = useState('All');

  const frameworks = ['All', 'ISO 27001', 'SOC 2', 'GDPR', 'NIST CSF', 'PCI-DSS'];

  const filteredAudits = audits.filter(
    (a) => selectedFramework === 'All' || a.framework === selectedFramework
  );

  const completedCount = audits.filter((a) => a.status === 'Completed').length;
  const inProgressCount = audits.filter((a) => a.status === 'In Progress').length;
  const overdueCount = audits.filter((a) => a.status === 'Overdue').length;

  const exportCSV = () => {
    const headers = ['Audit ID', 'Title', 'Framework', 'Lead Auditor', 'Status', 'Due Date', 'Progress %', 'Findings'];
    const rows = filteredAudits.map(a => [
      a.id,
      `"${a.title}"`,
      a.framework,
      `"${a.leadAuditor}"`,
      a.status,
      a.dueDate,
      `${a.progress}%`,
      a.findingsCount
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Compliance_Compass_Audits_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#170e2b] via-[#101424] to-[#0c101d] border border-purple-500/30">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold mb-1">
            <Sparkles size={14} />
            <span>Third-Party & Internal Trust Services Reviews</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Audit Analytics & Conformance Tracking
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Schedule recurring certification surveillance, assign lead auditors, track findings, and export audit packages.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#141b2e] hover:bg-[#1a233b] border border-slate-700/80 text-slate-200 text-xs font-semibold transition"
          >
            <Download size={15} className="text-purple-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenCreateAudit}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          >
            <Plus size={16} />
            <span>Schedule New Audit</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="saas-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Completed Audits</span>
            <span className="text-2xl font-bold text-white mt-1 block">{completedCount}</span>
            <span className="text-[11px] text-emerald-400 font-medium">100% regulatory acceptance</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="saas-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">In Progress Reviews</span>
            <span className="text-2xl font-bold text-white mt-1 block">{inProgressCount}</span>
            <span className="text-[11px] text-purple-400 font-medium">Active fieldwork & testing</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Clock size={20} />
          </div>
        </div>

        <div className="saas-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Overdue / Action Needed</span>
            <span className="text-2xl font-bold text-white mt-1 block">{overdueCount}</span>
            <span className="text-[11px] text-rose-400 font-medium">Escalated to lead auditor</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <AlertOctagon size={20} />
          </div>
        </div>
      </div>

      {/* Filter by Framework */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {frameworks.map((fw) => (
          <button
            key={fw}
            onClick={() => setSelectedFramework(fw)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              selectedFramework === fw
                ? 'bg-purple-950/70 text-purple-200 border-purple-500/80 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-[#101423] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {fw}
          </button>
        ))}
      </div>

      {/* Audits List & Progress */}
      <div className="space-y-4">
        {filteredAudits.map((audit) => (
          <div
            key={audit.id}
            className="saas-card rounded-2xl p-6 border border-slate-800 hover:border-purple-500/40 transition group"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                    {audit.framework}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      audit.status === 'Completed'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                        : audit.status === 'Overdue'
                        ? 'bg-rose-950/60 text-rose-400 border-rose-500/40'
                        : 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                    }`}
                  >
                    {audit.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  {audit.title}
                </h3>
                <p className="text-xs text-slate-400">{audit.scope}</p>
              </div>

              {/* Progress Bar & Stats */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-48">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-mono font-bold text-white">{audit.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${audit.progress}%` }}
                      className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                <div className="text-xs text-slate-300 border-l border-slate-800 pl-4 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <User size={13} className="text-purple-400" />
                    <span>{audit.leadAuditor}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar size={13} />
                    <span>Due: {audit.dueDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const newStatus: AuditStatus = audit.status === 'Completed' ? 'In Progress' : 'Completed';
                      const newProgress = newStatus === 'Completed' ? 100 : 75;
                      onUpdateAudit(audit.id, { status: newStatus, progress: newProgress });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#141b2c] hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition"
                  >
                    {audit.status === 'Completed' ? 'Reopen' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
