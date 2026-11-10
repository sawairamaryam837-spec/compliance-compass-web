import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Search,
  LayoutGrid,
  List,
  Filter,
  CheckCircle2,
  Clock,
  MessageSquare,
  Paperclip,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { Incident, IncidentSeverity, IncidentStatus } from '../../types';

interface IncidentManagementModuleProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onOpenCreateModal: () => void;
  onDeleteIncident: (id: string) => void;
  onUpdateStatus: (id: string, status: IncidentStatus) => void;
}

export const IncidentManagementModule: React.FC<IncidentManagementModuleProps> = ({
  incidents,
  onSelectIncident,
  onOpenCreateModal,
  onDeleteIncident,
  onUpdateStatus,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [search, setSearch] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filteredIncidents = incidents.filter((i) => {
    const matchSearch =
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.code.includes(search) ||
      i.assignedTo.toLowerCase().includes(search.toLowerCase()) ||
      (i.description && i.description.toLowerCase().includes(search.toLowerCase()));

    const matchSeverity = selectedSeverity === 'All' || i.severity === selectedSeverity;
    const matchStatus = selectedStatus === 'All' || i.status === selectedStatus;

    return matchSearch && matchSeverity && matchStatus;
  });

  const kanbanColumns: IncidentStatus[] = ['Open', 'Under Review', 'Assigned', 'Resolved'];

  const getSeverityBadge = (s: IncidentSeverity) => {
    switch (s) {
      case 'Critical':
      case 'High':
        return 'bg-rose-950/60 text-rose-400 border-rose-500/50';
      case 'Medium':
        return 'bg-amber-950/60 text-amber-400 border-amber-500/50';
      case 'Low':
      default:
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-500/50';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#170e2b] via-[#101424] to-[#0c101d] border border-purple-500/30">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold mb-1">
            <AlertTriangle size={14} />
            <span>SIEM & Autonomous Telemetry Response</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Incident Complaints & Breach Register
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track, investigate, assign, and remediate enterprise compliance failures and security anomalies.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-[0_0_15px_rgba(168,85,247,0.4)] self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Log New Incident</span>
        </button>
      </div>

      {/* Filter and View Bar */}
      <div className="saas-card rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search incident ID, title, assignee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0c101d] border border-slate-700/80 text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0c101d] border border-slate-700/80 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0c101d] border border-slate-700/80 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <div className="flex items-center rounded-xl bg-[#0c101d] border border-slate-700/80 p-0.5 ml-auto md:ml-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'table' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Table View"
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'kanban' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Kanban Board View"
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Main View: Table or Kanban */}
      {viewMode === 'table' ? (
        <div className="saas-card rounded-2xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0f1422] text-slate-400 font-semibold border-b border-slate-800">
                  <th className="py-3 px-4 w-20">ID</th>
                  <th className="py-3 px-4">Title & Narrative</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Severity</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Assignee</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    onClick={() => onSelectIncident(inc)}
                    className="hover:bg-slate-800/40 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-400">
                      {inc.code}
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-semibold text-slate-200">{inc.title}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {inc.description || 'Forensic investigation underway.'}
                      </p>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {inc.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getSeverityBadge(inc.severity)}`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950/50 text-purple-300 border border-purple-500/30">
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">
                      {inc.assignedTo}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400">
                      {inc.date}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-slate-400">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteIncident(inc.id);
                          }}
                          className="p-1 hover:text-rose-400 rounded transition"
                          title="Delete record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Board */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {kanbanColumns.map((colStatus) => {
            const colItems = filteredIncidents.filter((i) => i.status === colStatus);

            return (
              <div
                key={colStatus}
                className="saas-card rounded-2xl p-4 border border-slate-800 flex flex-col space-y-3 min-h-[450px]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    {colStatus}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {colItems.length}
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
                  {colItems.map((inc) => (
                    <div
                      key={inc.id}
                      onClick={() => onSelectIncident(inc)}
                      className="p-3.5 rounded-xl bg-[#0e1322] border border-slate-700/70 hover:border-purple-500/50 cursor-pointer transition shadow-md group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-purple-400">
                          #{inc.code}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getSeverityBadge(inc.severity)}`}>
                          {inc.severity}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                        {inc.title}
                      </h4>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{inc.assignedTo}</span>
                        <div className="flex items-center gap-2">
                          {inc.comments && inc.comments.length > 0 && (
                            <span className="flex items-center gap-1 text-[10px]">
                              <MessageSquare size={11} /> {inc.comments.length}
                            </span>
                          )}
                          {inc.attachmentsCount && inc.attachmentsCount > 0 && (
                            <span className="flex items-center gap-1 text-[10px]">
                              <Paperclip size={11} /> {inc.attachmentsCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
