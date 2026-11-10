import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Send,
  Paperclip,
  CheckCircle2,
  Clock,
  User,
  Shield,
  FileText,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Incident } from '../../types';

interface IncidentDetailDrawerProps {
  incident: Incident | null;
  onClose: () => void;
  onUpdateIncident: (id: string, updates: Partial<Incident>) => void;
  onAddComment: (incidentId: string, comment: string) => void;
}

export const IncidentDetailDrawer: React.FC<IncidentDetailDrawerProps> = ({
  incident,
  onClose,
  onUpdateIncident,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'evidence'>('details');

  if (!incident) return null;

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(incident.id, newComment);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0e1322] border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-[#111728]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-purple-500/50 flex items-center justify-center text-purple-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-purple-400 text-sm">
                  #{incident.code}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    incident.severity === 'High' || incident.severity === 'Critical'
                      ? 'bg-rose-950/60 text-rose-400 border-rose-500/50'
                      : incident.severity === 'Medium'
                      ? 'bg-amber-950/60 text-amber-400 border-amber-500/50'
                      : 'bg-emerald-950/60 text-emerald-400 border-emerald-500/50'
                  }`}
                >
                  {incident.severity} Severity
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {incident.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 px-6 bg-[#0c101d] text-xs">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-3 font-semibold border-b-2 transition ${
              activeTab === 'details'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Remediation
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-3 font-semibold border-b-2 transition ${
              activeTab === 'timeline'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Investigation Timeline & Discussion ({incident.comments?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`py-3 px-3 font-semibold border-b-2 transition ${
              activeTab === 'evidence'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Evidence & Attachments ({incident.attachmentsCount || 0})
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'details' && (
            <>
              {/* Quick Status Bar */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#111728] border border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">
                    Current Status
                  </span>
                  <select
                    value={incident.status}
                    onChange={(e) =>
                      onUpdateIncident(incident.id, {
                        status: e.target.value as Incident['status'],
                      })
                    }
                    className="w-full bg-[#0a0e1a] border border-slate-700 rounded-lg text-xs font-semibold text-white px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Open">Open</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">
                    Assigned Lead
                  </span>
                  <input
                    type="text"
                    value={incident.assignedTo}
                    onChange={(e) =>
                      onUpdateIncident(incident.id, { assignedTo: e.target.value })
                    }
                    className="w-full bg-[#0a0e1a] border border-slate-700 rounded-lg text-xs font-semibold text-white px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">
                    Date Reported
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono py-1.5">
                    <Calendar size={13} className="text-purple-400" />
                    <span>{incident.date}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Incident Narrative & Analysis
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#111728] p-4 rounded-xl border border-slate-800/80">
                  {incident.description ||
                    'Detailed anomaly telemetry captured from SIEM engine. Ongoing forensic review of database logs and network socket connections.'}
                </p>
              </div>

              {/* Mitigation Notes */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Mitigation & Corrective Actions
                </h4>
                <textarea
                  rows={3}
                  value={incident.mitigationNotes || ''}
                  onChange={(e) =>
                    onUpdateIncident(incident.id, {
                      mitigationNotes: e.target.value,
                    })
                  }
                  placeholder="Record immediate containment steps, root cause fix, and post-mortem links..."
                  className="w-full bg-[#111728] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
            </>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {/* Activity Timeline */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                <div className="relative">
                  <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-purple-500 ring-4 ring-[#0e1322]" />
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {incident.date} 09:30 AM
                  </span>
                  <p className="text-xs font-semibold text-slate-200 mt-0.5">
                    Incident created & auto-escalated by Autonomous SIEM
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-[#0e1322]" />
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {incident.date} 10:15 AM
                  </span>
                  <p className="text-xs font-semibold text-slate-200 mt-0.5">
                    Assigned to {incident.assignedTo} for forensic review
                  </p>
                </div>

                {incident.comments?.map((c) => (
                  <div key={c.id} className="relative">
                    <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-purple-400 ring-4 ring-[#0e1322]" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-purple-300">
                        {c.author}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {c.createdAt}
                      </span>
                    </div>
                    <div className="mt-1 p-3 rounded-xl bg-[#141b2c] border border-slate-800 text-xs text-slate-200 leading-relaxed">
                      {c.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment Box */}
              <form onSubmit={handlePostComment} className="flex gap-2 pt-4 border-t border-slate-800">
                <input
                  type="text"
                  placeholder="Post investigation note or update..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-[#111728] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                >
                  <Send size={13} /> Send
                </button>
              </form>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#111728] border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="text-purple-400" size={20} />
                  <div>
                    <p className="text-xs font-bold text-white">siem_packet_trace_shard_01.pcap</p>
                    <p className="text-[10px] text-slate-400">Captured packet buffer • 4.2 MB • MD5 Verified</p>
                  </div>
                </div>
                <button className="px-2.5 py-1 text-xs text-purple-300 bg-purple-950/60 border border-purple-500/30 rounded-lg hover:bg-purple-900/60 transition">
                  Download
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#111728] border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="text-purple-400" size={20} />
                  <div>
                    <p className="text-xs font-bold text-white">iam_role_audit_diff.json</p>
                    <p className="text-[10px] text-slate-400">CloudTrail configuration snapshot • 140 KB</p>
                  </div>
                </div>
                <button className="px-2.5 py-1 text-xs text-purple-300 bg-purple-950/60 border border-purple-500/30 rounded-lg hover:bg-purple-900/60 transition">
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
