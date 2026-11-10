import React, { useState } from 'react';
import { X, Check, FolderLock } from 'lucide-react';
import { ComplianceControl, ControlFramework } from '../../types';

interface CreateControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (controlData: Partial<ComplianceControl>) => void;
}

export const CreateControlModal: React.FC<CreateControlModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [controlId, setControlId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [framework, setFramework] = useState<ControlFramework>('ISO 27001');
  const [owner, setOwner] = useState('Sarah Jenkins');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      controlId: controlId.trim() || `CTL-${Math.floor(100 + Math.random() * 900)}`,
      name,
      description,
      framework,
      owner,
      status: 'Implemented',
      complianceRate: 100,
      reviewDate: new Date().toISOString().split('T')[0],
      evidenceCount: 1,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111726] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-950/70 border border-purple-500/50 flex items-center justify-center text-purple-400">
              <FolderLock size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add Compliance Control</h3>
              <p className="text-xs text-slate-400">Define verifiable trust safeguard</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Control Reference ID
              </label>
              <input
                type="text"
                placeholder="e.g. A.12.3.1 or CC7.1"
                value={controlId}
                onChange={(e) => setControlId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Framework
              </label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value as ControlFramework)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="ISO 27001">ISO 27001</option>
                <option value="SOC 2">SOC 2</option>
                <option value="GDPR">GDPR</option>
                <option value="NIST CSF">NIST CSF</option>
                <option value="HIPAA">HIPAA</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Control Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Cryptographic Key Management & Rotation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Control Owner
            </label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description & Verification Method
            </label>
            <textarea
              rows={3}
              placeholder="State policy requirements, automated checks, frequency of testing..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              <Check size={14} /> Add Control
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
