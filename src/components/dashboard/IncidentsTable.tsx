import React, { useState } from 'react';
import {
  Settings,
  MoreHorizontal,
  Search,
  Plus,
  CheckSquare,
  Square,
  Filter
} from 'lucide-react';
import { Incident } from '../../types';

interface IncidentsTableProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onOpenCreateModal: () => void;
  onUpdateStatus?: (id: string, status: Incident['status']) => void;
}

export const IncidentsTable: React.FC<IncidentsTableProps> = ({
  incidents,
  onSelectIncident,
  onOpenCreateModal,
  onUpdateStatus,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['inc-1']);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.code.includes(searchTerm) ||
      inc.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === 'active') {
      return matchesSearch && inc.status !== 'Resolved' && inc.status !== 'Closed';
    }
    return matchesSearch;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredIncidents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredIncidents.map((i) => i.id));
    }
  };

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Severity Badge matching screenshot
  const renderSeverityBadge = (severity: Incident['severity']) => {
    switch (severity) {
      case 'High':
      case 'Critical':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-rose-950/60 text-rose-400 border border-rose-500/50 shadow-[0_0_8px_rgba(244,63,94,0.2)]">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-950/60 text-amber-400 border border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
            Low
          </span>
        );
    }
  };

  // Status Pill matching screenshot
  const renderStatusPill = (status: Incident['status']) => {
    switch (status) {
      case 'Under Review':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/50">
            Under Review
          </span>
        );
      case 'Assigned':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-950/60 text-blue-400 border border-blue-500/50">
            Assigned
          </span>
        );
      case 'Resolved':
      case 'Closed':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/50">
            Resolved
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="saas-card rounded-2xl p-6 border border-slate-800/80 flex flex-col">
      {/* Header matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Incident Complaints Management
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time compliance infractions, privacy reports & security anomalies
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Cases filter pill */}
          <button
            onClick={() =>
              setActiveFilter(activeFilter === 'active' ? 'all' : 'active')
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              activeFilter === 'active'
                ? 'bg-purple-950/70 border-purple-500 text-purple-200'
                : 'bg-[#151c2e] border-slate-700/60 text-slate-300 hover:bg-[#1a233b]'
            }`}
          >
            Active Cases
          </button>

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition shadow-[0_0_12px_rgba(168,85,247,0.3)]"
          >
            <Plus size={14} />
            <span>New Incident</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/70">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0f1422] text-slate-400 font-semibold border-b border-slate-800/80">
              <th className="py-3 px-3.5 w-10">
                <button
                  onClick={toggleSelectAll}
                  className="text-slate-400 hover:text-white transition"
                >
                  {selectedIds.length === filteredIncidents.length &&
                  filteredIncidents.length > 0 ? (
                    <CheckSquare size={15} className="text-purple-400" />
                  ) : (
                    <Square size={15} />
                  )}
                </button>
              </th>
              <th className="py-3 px-3 w-16">ID</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Assigned To</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredIncidents.map((inc) => {
              const isSelected = selectedIds.includes(inc.id);

              return (
                <tr
                  key={inc.id}
                  onClick={() => onSelectIncident(inc)}
                  className={`cursor-pointer transition-colors hover:bg-slate-800/40 ${
                    isSelected ? 'bg-purple-950/15' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3.5 px-3.5">
                    <button
                      onClick={(e) => toggleSelectRow(inc.id, e)}
                      className="text-slate-400 hover:text-white transition"
                    >
                      {isSelected ? (
                        <CheckSquare size={15} className="text-purple-400" />
                      ) : (
                        <Square size={15} />
                      )}
                    </button>
                  </td>

                  {/* ID */}
                  <td className="py-3.5 px-3 font-mono font-medium text-slate-400">
                    {inc.code}
                  </td>

                  {/* Title */}
                  <td className="py-3.5 px-4 font-medium text-slate-100 max-w-[200px] truncate">
                    {inc.title}
                  </td>

                  {/* Severity */}
                  <td className="py-3.5 px-4">
                    {renderSeverityBadge(inc.severity)}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {renderStatusPill(inc.status)}
                  </td>

                  {/* Assigned To */}
                  <td className="py-3.5 px-4 text-slate-300 font-medium">
                    <div className="flex items-center gap-2">
                      {inc.assignedAvatar ? (
                        <img
                          src={inc.assignedAvatar}
                          alt={inc.assignedTo}
                          className="w-5 h-5 rounded-full object-cover border border-slate-700"
                        />
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[9px] text-slate-400">
                          {inc.assignedTo.charAt(0)}
                        </span>
                      )}
                      <span className="truncate">{inc.assignedTo}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {inc.date}
                  </td>

                  {/* Actions matching screenshot (gear & dots) */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-slate-400">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectIncident(inc);
                        }}
                        className="p-1 rounded hover:bg-slate-800 hover:text-white transition"
                        title="Configure Incident"
                      >
                        <Settings size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectIncident(inc);
                        }}
                        className="p-1 rounded hover:bg-slate-800 hover:text-white transition"
                        title="More actions"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
