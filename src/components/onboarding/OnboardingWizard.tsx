import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Users,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react';
import { Organization, ControlFramework } from '../../types';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (orgData: Partial<Organization>) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Org info
  const [companyName, setCompanyName] = useState('Apex Global Financials');
  const [industry, setIndustry] = useState('FinTech / Enterprise Banking');
  const [size, setSize] = useState('500-1000 employees');

  // Step 2: Frameworks
  const [selectedFrameworks, setSelectedFrameworks] = useState<ControlFramework[]>([
    'ISO 27001',
    'SOC 2',
    'GDPR',
  ]);

  // Step 3: Team
  const [inviteEmails, setInviteEmails] = useState('airah.jenkno@compliancecompass.io, sarah.luan@compliancecompass.io');

  if (!isOpen) return null;

  const toggleFramework = (fw: ControlFramework) => {
    if (selectedFrameworks.includes(fw)) {
      setSelectedFrameworks(selectedFrameworks.filter((f) => f !== fw));
    } else {
      setSelectedFrameworks([...selectedFrameworks, fw]);
    }
  };

  const handleFinish = () => {
    onComplete({
      name: companyName,
      industry,
      size,
      complianceFrameworks: selectedFrameworks,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#111726] border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Progress Indicator */}
        <div className="p-6 border-b border-slate-800 bg-[#0c101d] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
              Workspace Setup Wizard • Step {step} of 4
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              {step === 1 && '1. Organization Details'}
              {step === 2 && '2. Compliance & Trust Frameworks'}
              {step === 3 && '3. Invite Compliance Teammates'}
              {step === 4 && '4. Continuous Audit Engine Ready!'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className="bg-purple-500 h-1 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Step Body */}
        <div className="p-6 space-y-4">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Company / Organization Legal Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Industry Vertical
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="FinTech / Enterprise Banking">FinTech / Enterprise Banking</option>
                  <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                  <option value="B2B SaaS & Cloud Software">B2B SaaS & Cloud Software</option>
                  <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                  <option value="Government & Defense">Government & Defense</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Employee Headcount
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="1-50 employees">1-50 employees</option>
                  <option value="50-250 employees">50-250 employees</option>
                  <option value="250-1000 employees">250-1000 employees</option>
                  <option value="1000+ employees">1000+ employees</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 animate-in fade-in">
              <p className="text-xs text-slate-300">
                Select the regulatory standards your company must maintain. We will pre-populate the controls and audit templates:
              </p>
              {[
                { id: 'ISO 27001', title: 'ISO/IEC 27001:2022', desc: 'Information Security Management System' },
                { id: 'SOC 2', title: 'SOC 2 Type II', desc: 'Security, Availability, Confidentiality Trust Criteria' },
                { id: 'GDPR', title: 'EU GDPR Privacy', desc: 'Data Subject Protection & Breach Handling' },
                { id: 'NIST CSF', title: 'NIST CSF 2.0', desc: 'Identify, Protect, Detect, Respond, Recover' },
                { id: 'HIPAA', title: 'HIPAA Security Rule', desc: 'Protected Health Information (ePHI)' },
              ].map((fw) => {
                const isSelected = selectedFrameworks.includes(fw.id as any);
                return (
                  <div
                    key={fw.id}
                    onClick={() => toggleFramework(fw.id as any)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                        : 'bg-[#0c101d] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{fw.title}</p>
                      <p className="text-[11px] text-slate-400">{fw.desc}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isSelected
                          ? 'bg-purple-600 border-purple-400 text-white'
                          : 'border-slate-700'
                      }`}
                    >
                      {isSelected && <Check size={13} />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <p className="text-xs text-slate-300">
                Invite compliance officers, internal auditors, and risk engineers to collaborate on this workspace:
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Teammate Work Emails (comma separated)
                </label>
                <textarea
                  rows={3}
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500 resize-none font-mono"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-6 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-purple-950/80 border-2 border-purple-500/80 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                <Sparkles className="w-8 h-8 text-purple-300" />
              </div>
              <h4 className="text-lg font-bold text-white">Your GRC Command Center is Configured!</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Initial control catalog generated with {selectedFrameworks.length} active frameworks. Your dashboard is primed with continuous compliance tracking.
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-800 bg-[#0c101d] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((step - 1) as any)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
            >
              <ArrowLeft size={13} /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep((step + 1) as any)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-[0_0_12px_rgba(168,85,247,0.3)] ml-auto"
            >
              <span>Next Step</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-[0_0_15px_rgba(168,85,247,0.4)] ml-auto"
            >
              <span>Launch Dashboard</span>
              <CheckCircle2 size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
