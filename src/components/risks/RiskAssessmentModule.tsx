import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  ChevronRight,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Risk, RiskPriority, RiskCategory, RiskStatus } from '../../types';

interface RiskAssessmentModuleProps {
  risks: Risk[];
  onOpenCreateModal: () => void;
  onEditRisk: (risk: Risk) => void;
  onDeleteRisk: (id: string) => void;
}

export const RiskAssessmentModule: React.FC<RiskAssessmentModuleProps> = ({
  risks,
  onOpenCreateModal,
  onEditRisk,
  onDeleteRisk,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const categories = ['All', 'Cybersecurity', 'Data Privacy', 'Regulatory', 'Operational', 'Financial', 'Third-Party'];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];
  const statuses = ['All', 'Identified', 'Assessing', 'Mitigating', 'Monitored', 'Closed'];

  const filteredRisks = risks.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.assignedTo.toLowerCase().includes(search.toLowerCase());

    const matchCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const matchPriority = selectedPriority === 'All' || r.priority === selectedPriority;
    const matchStatus = selectedStatus === 'All' || r.status === selectedStatus;

    return matchSearch && matchCategory && matchPriority && matchStatus;
  });

  const getPriorityBadge = (p: RiskPriority) => {
    switch (p) {
      case 'Critical':
        return 'bg-rose-950/60 text-rose-400 border-rose-500/50';
      case 'High':
        return 'bg-amber-950/60 text-amber-400 border-amber-500/50';
      case 'Medium':
        return 'bg-yellow-950/60 text-yellow-400 border-yellow-500/50';
      case 'Low':
      default:
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-500/50';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#141029] via-[#101424] to-[#0c101d] border border-purple-500/30">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold mb-1">
            <Sparkles size={14} />
            <span>Continuous Enterprise Risk Governance</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Risk Assessments Register
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Maintain, score, and remediate cybersecurity, privacy, and regulatory risks across the enterprise.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-[0_0_15px_rgba(168,85,247,0.4)] self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Risk Assessment</span>
        </button>
      </div>

      {/* Filter and View Controls Bar */}
      <div className="saas-card rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search risk code, vector, title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0c101d] border border-slate-700/80 text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0c101d] border border-slate-700/80 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>

          {/* Priority */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0c101d] border border-slate-700/80 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
          >
            {priorities.map((p) => (
              <option key={p} value={p}>{p === 'All' ? 'All Priorities' : `${p} Priority`}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0c101d] border border-slate-700/80 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl bg-[#0c101d] border border-slate-700/80 p-0.5 ml-auto md:ml-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="List View"
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Rendering: List or Grid */}
      {viewMode === 'list' ? (
        <div className="saas-card rounded-2xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0f1422] text-slate-400 font-semibold border-b border-slate-800">
                  <th className="py-3 px-4 w-24">Risk ID</th>
                  <th className="py-3 px-4">Title & Context</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-center">Score (L×I)</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Assignee</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRisks.map((risk) => (
                  <tr key={risk.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-400">
                      {risk.code}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-slate-200">{risk.title}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{risk.description}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {risk.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold">
                      <span className="text-white bg-slate-900 border border-slate-700 px-2 py-0.5 rounded">
                        {risk.score} / 25
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(risk.priority)}`}>
                        {risk.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-slate-300 font-medium">
                        {risk.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">
                      {risk.assignedTo}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-slate-400">
                        <button
                          onClick={() => onEditRisk(risk)}
                          className="p-1 hover:text-purple-400 hover:bg-slate-800 rounded transition"
                          title="Edit Risk"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(risk.id)}
                          className="p-1 hover:text-rose-400 hover:bg-slate-800 rounded transition"
                          title="Delete Risk"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRisks.map((risk) => (
            <div
              key={risk.id}
              className="saas-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-purple-500/40 transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono font-bold text-xs text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                    {risk.code}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(risk.priority)}`}>
                    {risk.priority}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                  {risk.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {risk.description}
                </p>

                {risk.mitigationPlan && (
                  <div className="mt-3 p-2.5 rounded-xl bg-[#0c101d] border border-slate-800 text-[11px] text-slate-300">
                    <span className="font-semibold text-purple-400 block mb-0.5">Mitigation Plan:</span>
                    <span className="line-clamp-2">{risk.mitigationPlan}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div>
                  <span className="block text-[10px] text-slate-500">Owner</span>
                  <span className="text-slate-200 font-medium">{risk.assignedTo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditRisk(risk)}
                    className="p-1.5 hover:text-purple-400 hover:bg-slate-800 rounded-lg transition"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(risk.id)}
                    className="p-1.5 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111726] border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-950/60 border border-rose-500/50 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle size={20} />
            </div>
            <div className="text-center">
              <h4 className="text-sm font-bold text-white">Permanently Delete Risk?</h4>
              <p className="text-xs text-slate-400 mt-1">
                This will remove the risk assessment record and historical telemetry.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteRisk(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition shadow-[0_0_12px_rgba(244,63,94,0.4)]"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
