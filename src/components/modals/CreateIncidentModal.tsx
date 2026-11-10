import React, { useState } from 'react';
import { X, AlertTriangle, Check } from 'lucide-react';
import { Incident, IncidentSeverity, IncidentCategory } from '../../types';

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Incident>) => void;
}

export const CreateIncidentModal: React.FC<CreateIncidentModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('Data Privacy');
  const [severity, setSeverity] = useState<IncidentSeverity>('Medium');
  const [assignedTo, setAssignedTo] = useState('Sarah Jenkins');
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('Internal Audit');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title,
      category,
      severity,
      assignedTo,
      description,
      reportedBy,
      status: 'Open',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111726] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-950/70 border border-rose-500/50 flex items-center justify-center text-rose-400">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Log Security Incident</h3>
              <p className="text-xs text-slate-400">Report an infraction or security anomaly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Incident Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Unauthenticated Endpoint Query Spike"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700/80 text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700/80 text-slate-200 text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="Data Privacy">Data Privacy</option>
                <option value="Policy Violation">Policy Violation</option>
                <option value="Security Breach">Security Breach</option>
                <option value="System Outage">System Outage</option>
                <option value="Access Control">Access Control</option>
                <option value="Compliance Failure">Compliance Failure</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700/80 text-slate-200 text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Assigned To
              </label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700/80 text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Reported By
              </label>
              <input
                type="text"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700/80 text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description & Evidence
            </label>
            <textarea
              rows={3}
              placeholder="What happened? Include endpoints, timestamps, affected accounts..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0c101d] border border-slate-700/80 text-white text-xs focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#141b2d] hover:bg-slate-800 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(168,85,247,0.4)] transition flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>Submit Incident</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
