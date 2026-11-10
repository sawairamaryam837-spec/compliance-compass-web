import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { Risk, Incident, Audit, ComplianceControl } from '../../types';

interface ReportsModuleProps {
  risks: Risk[];
  incidents: Incident[];
  audits: Audit[];
  controls: ComplianceControl[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  risks,
  incidents,
  audits,
  controls,
}) => {
  const [reportType, setReportType] = useState<
    'risk' | 'incident' | 'audit' | 'compliance' | 'control'
  >('compliance');
  const [dateRange, setDateRange] = useState('May 2024');

  const reportTitles = {
    risk: 'Comprehensive Risk Assessment & Threat Vector Analysis',
    incident: 'Security Incident Complaints & Breach Remediation Log',
    audit: 'External & Internal Certification Audit Surveillance Ledger',
    compliance: 'Executive Enterprise Compliance & Board Governance Brief',
    control: 'Trust Services & ISO/IEC 27001 Control Effectiveness Attestation',
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let rows: any[][] = [];
    let headers: string[] = [];

    if (reportType === 'risk') {
      headers = ['Code', 'Title', 'Category', 'Score', 'Priority', 'Status', 'Assignee'];
      rows = risks.map((r) => [r.code, `"${r.title}"`, r.category, r.score, r.priority, r.status, r.assignedTo]);
    } else if (reportType === 'incident') {
      headers = ['ID', 'Title', 'Severity', 'Status', 'Assigned To', 'Date', 'Reported By'];
      rows = incidents.map((i) => [i.code, `"${i.title}"`, i.severity, i.status, i.assignedTo, i.date, i.reportedBy || '']);
    } else if (reportType === 'audit') {
      headers = ['ID', 'Title', 'Framework', 'Lead Auditor', 'Status', 'Progress', 'Due Date'];
      rows = audits.map((a) => [a.id, `"${a.title}"`, a.framework, a.leadAuditor, a.status, `${a.progress}%`, a.dueDate]);
    } else {
      headers = ['Control ID', 'Name', 'Framework', 'Status', 'Compliance %', 'Owner'];
      rows = controls.map((c) => [c.controlId, `"${c.name}"`, c.framework, c.status, `${c.complianceRate}%`, c.owner]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Compliance_Compass_${reportType}_Report_${new Date().toISOString().split('T')[0]}.csv`);
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
            <span>Auditor-Ready GRC Documentation</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Governance & Attestation Reports
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate formal compliance disclosures, board-level summaries, and export verifiable audit packs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#141b2e] hover:bg-[#1a233b] border border-slate-700/80 text-slate-200 text-xs font-semibold transition"
          >
            <Download size={15} className="text-purple-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          >
            <Printer size={15} />
            <span>Printable PDF</span>
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'compliance', label: 'Compliance Overview Report' },
          { id: 'risk', label: 'Risk Assessment Report' },
          { id: 'incident', label: 'Incident Complaints Report' },
          { id: 'audit', label: 'Audit Trail Report' },
          { id: 'control', label: 'Controls Effectiveness Report' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              reportType === tab.id
                ? 'bg-purple-950/70 text-purple-200 border-purple-500/80 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-[#101423] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Preview Document Canvas */}
      <div className="saas-card rounded-2xl p-8 border border-slate-800 space-y-6 bg-[#0f1422]">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
              <span>Apex Global Financials • Confidential GRC Record</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {reportTitles[reportType]}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Period: {dateRange} • Generated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/40">
              Verified & Conforming
            </span>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">Sign-off: Sawera (Director & Admin)</p>
          </div>
        </div>

        {/* Executive Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#0b0f19] border border-slate-800/80">
          <div>
            <span className="text-[11px] text-slate-400 block">Total Cataloged Risks</span>
            <span className="text-xl font-bold text-white mt-0.5 block">{risks.length}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Active Incidents</span>
            <span className="text-xl font-bold text-white mt-0.5 block">{incidents.length}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Audit Conformance</span>
            <span className="text-xl font-bold text-purple-400 mt-0.5 block">88%</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Overall Score</span>
            <span className="text-xl font-bold text-emerald-400 mt-0.5 block">92%</span>
          </div>
        </div>

        {/* Dynamic Table based on Report Type */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Attestation Registry Items
          </h4>

          <div className="rounded-xl border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#121829] text-slate-400 border-b border-slate-800">
                  <th className="py-2.5 px-4">Item ID</th>
                  <th className="py-2.5 px-4">Title / Scope</th>
                  <th className="py-2.5 px-4">Category / Framework</th>
                  <th className="py-2.5 px-4">Status / Severity</th>
                  <th className="py-2.5 px-4 text-right">Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {reportType === 'risk' &&
                  risks.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-mono font-bold text-purple-400">{r.code}</td>
                      <td className="py-2.5 px-4 text-slate-200 font-medium">{r.title}</td>
                      <td className="py-2.5 px-4 text-slate-400">{r.category}</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300">
                          {r.priority} ({r.score}/25)
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-300">{r.assignedTo}</td>
                    </tr>
                  ))}

                {reportType === 'incident' &&
                  incidents.map((i) => (
                    <tr key={i.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-mono font-bold text-purple-400">#{i.code}</td>
                      <td className="py-2.5 px-4 text-slate-200 font-medium">{i.title}</td>
                      <td className="py-2.5 px-4 text-slate-400">{i.category}</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300">
                          {i.severity} • {i.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-300">{i.assignedTo}</td>
                    </tr>
                  ))}

                {(reportType === 'compliance' || reportType === 'control' || reportType === 'audit') &&
                  controls.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-mono font-bold text-purple-400">{c.controlId}</td>
                      <td className="py-2.5 px-4 text-slate-200 font-medium">{c.name}</td>
                      <td className="py-2.5 px-4 text-slate-400">{c.framework}</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300">
                          {c.status} ({c.complianceRate}%)
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-300">{c.owner}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
