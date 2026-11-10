import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { Risk, RiskLikelihood, RiskImpact, RiskCategory, RiskStatus, RiskPriority } from '../../types';

interface RiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (riskData: Partial<Risk>) => void;
  initialRisk?: Risk | null;
  defaultLikelihood?: RiskLikelihood;
  defaultImpact?: RiskImpact;
}

export const RiskModal: React.FC<RiskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRisk,
  defaultLikelihood = 3,
  defaultImpact = 3,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<RiskCategory>('Cybersecurity');
  const [likelihood, setLikelihood] = useState<RiskLikelihood>(defaultLikelihood);
  const [impact, setImpact] = useState<RiskImpact>(defaultImpact);
  const [status, setStatus] = useState<RiskStatus>('Identified');
  const [assignedTo, setAssignedTo] = useState('Sarah Jenkins');
  const [mitigationPlan, setMitigationPlan] = useState('');

  useEffect(() => {
    if (initialRisk) {
      setTitle(initialRisk.title);
      setDescription(initialRisk.description);
      setCategory(initialRisk.category);
      setLikelihood(initialRisk.likelihood);
      setImpact(initialRisk.impact);
      setStatus(initialRisk.status);
      setAssignedTo(initialRisk.assignedTo);
      setMitigationPlan(initialRisk.mitigationPlan || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('Cybersecurity');
      setLikelihood(defaultLikelihood);
      setImpact(defaultImpact);
      setStatus('Identified');
      setAssignedTo('Sarah Jenkins');
      setMitigationPlan('');
    }
  }, [initialRisk, defaultLikelihood, defaultImpact, isOpen]);

  if (!isOpen) return null;

  const score = likelihood * impact;
  let priority: RiskPriority = 'Medium';
  if (score >= 16) priority = 'Critical';
  else if (score >= 10) priority = 'High';
  else if (score >= 5) priority = 'Medium';
  else priority = 'Low';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title,
      description,
      category,
      likelihood,
      impact,
      score,
      priority,
      status,
      assignedTo,
      mitigationPlan,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111726] border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-950/70 border border-purple-500/50 flex items-center justify-center text-purple-400">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {initialRisk ? `Edit Risk ${initialRisk.code}` : 'Log New Enterprise Risk'}
              </h3>
              <p className="text-xs text-slate-400">
                Calculates automatic 5x5 impact matrix score & priority
              </p>
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Risk Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Data Breach: Customer Database Exfiltration"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700/80 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RiskCategory)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700/80 text-slate-200 text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Data Privacy">Data Privacy</option>
                <option value="Regulatory">Regulatory</option>
                <option value="Operational">Operational</option>
                <option value="Financial">Financial</option>
                <option value="Third-Party">Third-Party</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RiskStatus)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700/80 text-slate-200 text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="Identified">Identified</option>
                <option value="Assessing">Assessing</option>
                <option value="Mitigating">Mitigating</option>
                <option value="Monitored">Monitored</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Matrix Controls: Likelihood & Impact */}
          <div className="p-4 rounded-xl bg-[#0b0f19] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                5x5 Risk Matrix Assessment
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Score:</span>
                <span className="font-mono font-bold text-white bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/40">
                  {score} / 25
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    priority === 'Critical'
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/50'
                      : priority === 'High'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                      : priority === 'Medium'
                      ? 'bg-yellow-950 text-yellow-300 border border-yellow-500/50'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                  }`}
                >
                  {priority} Risk
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Likelihood (1: Rare → 5: Almost Certain)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={likelihood}
                  onChange={(e) => setLikelihood(parseInt(e.target.value) as RiskLikelihood)}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>1 (Low)</span>
                  <span>3 (Med)</span>
                  <span>5 (High)</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Impact (1: Negligible → 5: Catastrophic)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={impact}
                  onChange={(e) => setImpact(parseInt(e.target.value) as RiskImpact)}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>1 (Low)</span>
                  <span>3 (Med)</span>
                  <span>5 (High)</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Assigned Owner
            </label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700/80 text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description & Threat Vector
            </label>
            <textarea
              rows={2}
              placeholder="Detailed description of vulnerability, scenario and impact..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0c101d] border border-slate-700/80 text-white text-xs focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Mitigation Plan & Controls
            </label>
            <textarea
              rows={2}
              placeholder="Action items, compensating controls, or automated safeguards..."
              value={mitigationPlan}
              onChange={(e) => setMitigationPlan(e.target.value)}
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
              <span>{initialRisk ? 'Save Changes' : 'Create Risk'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
