import React, { useState } from 'react';
import { X, Check, BarChart3 } from 'lucide-react';
import { Audit } from '../../types';

interface CreateAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (auditData: Partial<Audit>) => void;
}

export const CreateAuditModal: React.FC<CreateAuditModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [framework, setFramework] = useState('ISO 27001');
  const [scope, setScope] = useState('');
  const [leadAuditor, setLeadAuditor] = useState('Sarah Jenkins');
  const [dueDate, setDueDate] = useState('2024-10-31');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title,
      framework,
      scope: scope || 'Enterprise Cloud Infrastructure & Information Security Management System',
      leadAuditor,
      dueDate,
      status: 'Pending',
      progress: 0,
      findingsCount: 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111726] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-950/70 border border-purple-500/50 flex items-center justify-center text-purple-400">
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Schedule Compliance Audit</h3>
              <p className="text-xs text-slate-400">Plan internal or external certification review</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Audit Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ISO 27001:2022 Stage 2 External Assessment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Framework
              </label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="ISO 27001">ISO 27001</option>
                <option value="SOC 2">SOC 2 Type II</option>
                <option value="GDPR">GDPR Privacy</option>
                <option value="NIST CSF">NIST CSF 2.0</option>
                <option value="PCI-DSS">PCI-DSS v4.0</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Lead Auditor / External Body
            </label>
            <input
              type="text"
              value={leadAuditor}
              onChange={(e) => setLeadAuditor(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Audit Scope & Systems
            </label>
            <textarea
              rows={3}
              placeholder="Target production VPCs, access control mechanisms, policy documents..."
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center gap-1.5"
            >
              <Check size={14} /> Schedule Audit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
