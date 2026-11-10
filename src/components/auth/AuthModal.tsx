import React, { useState } from 'react';
import {
  X,
  Compass,
  Lock,
  Mail,
  User,
  Building2,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onOpenOnboarding: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenOnboarding,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('isfatimasawera274@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: name || 'Sawera',
        email: email,
        title: 'Compliance Director & System Admin',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        organizationId: `org_${Date.now()}`,
        role: 'Admin',
      };
      onLoginSuccess(newUser);
      onClose();
      onOpenOnboarding();
    } else {
      const user: UserProfile = {
        id: 'usr_1',
        name: email.includes('alex') ? 'Alex Mercer' : 'Sawera',
        email: email,
        title: email.includes('alex') ? 'Lead Auditor' : 'Compliance Director & System Admin',
        avatar: email.includes('alex')
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
          : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        organizationId: 'org_1',
        role: 'Admin',
      };
      onLoginSuccess(user);
      onClose();
    }
  };

  const handleQuickDemoLogin = (role: 'director' | 'auditor') => {
    if (role === 'director') {
      onLoginSuccess({
        id: 'usr_1',
        name: 'Sawera',
        email: 'isfatimasawera274@gmail.com',
        title: 'Compliance Director & System Admin',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        organizationId: 'org_1',
        role: 'Admin',
      });
    } else {
      onLoginSuccess({
        id: 'usr_2',
        name: 'Alex Mercer',
        email: 'alex.mercer@compliancecompass.io',
        title: 'Lead Auditor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        organizationId: 'org_1',
        role: 'Lead Auditor',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111726] border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-[#0c101d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-900 to-fuchsia-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Compliance Compass</h3>
              <p className="text-[11px] text-purple-300">Enterprise GRC Cloud Platform</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-slate-800 text-xs font-semibold text-center">
          <button
            onClick={() => setMode('signin')}
            className={`py-3 transition ${
              mode === 'signin'
                ? 'border-b-2 border-purple-500 text-white bg-purple-950/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In to Workspace
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`py-3 transition ${
              mode === 'signup'
                ? 'border-b-2 border-purple-500 text-white bg-purple-950/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register Organization
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Company / Organization Name
                </label>
                <div className="relative">
                  <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Apex Global Financials"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Work Email
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 mt-2"
          >
            <span>{mode === 'signin' ? 'Sign In' : 'Create Organization Account'}</span>
            <ArrowRight size={14} />
          </button>

          {/* Quick Demo Accounts Switcher */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
              Fast Demo One-Click Sign-in
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('director')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#141b2c] hover:bg-[#1b243b] border border-slate-700/80 text-[11px] text-purple-300 font-semibold transition"
              >
                Sawera (Admin)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('auditor')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#141b2c] hover:bg-[#1b243b] border border-slate-700/80 text-[11px] text-purple-300 font-semibold transition"
              >
                Alex Mercer (Lead Auditor)
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
