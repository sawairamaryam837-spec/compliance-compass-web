import React, { useState } from 'react';
import {
  User,
  Building2,
  Users,
  Bell,
  Shield,
  Palette,
  Mail,
  Plus,
  Check,
  Lock,
  Sparkles,
  KeyRound,
  Trash2
} from 'lucide-react';
import { UserProfile, TeamMember, Organization } from '../../types';

interface SettingsModuleProps {
  user: UserProfile;
  organization: Organization;
  team: TeamMember[];
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onInviteMember: (name: string, email: string, role: TeamMember['role']) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  user,
  organization,
  team,
  onUpdateUser,
  onInviteMember,
}) => {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'org' | 'team' | 'notifications' | 'security' | 'theme'
  >('profile');

  // Profile form state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [title, setTitle] = useState(user.title);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Invite member state
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('Compliance Officer');
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Security & Toggles
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('15 mins');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [incidentEscalation, setIncidentEscalation] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name, email, title });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    onInviteMember(inviteName, inviteEmail, inviteRole);
    setInviteName('');
    setInviteEmail('');
    setShowInviteModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#170e2b] via-[#101424] to-[#0c101d] border border-purple-500/30">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold mb-1">
            <Sparkles size={14} />
            <span>Enterprise Workspace Administration</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Settings & Governance Configurations
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal profile, organization boundaries, team RBAC permissions, and security policies.
          </p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'profile', label: 'Personal Profile', icon: User },
          { id: 'org', label: 'Organization', icon: Building2 },
          { id: 'team', label: 'Team & RBAC Roles', icon: Users },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'security', label: 'Security & 2FA', icon: Shield },
          { id: 'theme', label: 'Theme Appearance', icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                activeTab === tab.id
                  ? 'bg-purple-950/70 text-purple-200 border-purple-500/80 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : 'bg-[#101423] text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Personal Profile */}
      {activeTab === 'profile' && (
        <div className="saas-card rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            />
            <div>
              <h3 className="text-base font-bold text-white">{user.name}</h3>
              <p className="text-xs text-purple-300 font-medium">{user.title}</p>
              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-purple-950 border border-purple-500/30 text-purple-400 font-bold">
                {user.role} Permissions
              </span>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Legal Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700/80 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700/80 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Professional Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700/80 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Check size={14} /> Profile updated successfully!
                </span>
              ) : <div />}
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Organization Settings */}
      {activeTab === 'org' && (
        <div className="saas-card rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-6">
          <h3 className="text-base font-bold text-white">Enterprise Organization Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Company Name</label>
              <input
                type="text"
                defaultValue={organization.name}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700/80 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Industry Vertical</label>
              <input
                type="text"
                defaultValue={organization.industry}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700/80 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Active Compliance Frameworks</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {organization.complianceFrameworks.map((fw) => (
                  <span
                    key={fw}
                    className="px-3 py-1 rounded-lg bg-purple-950/70 border border-purple-500/40 text-purple-300 text-xs font-semibold"
                  >
                    ✓ {fw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Team & RBAC */}
      {activeTab === 'team' && (
        <div className="saas-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Authorized Team Members</h3>
              <p className="text-xs text-slate-400">Manage role-based access control and invitations.</p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-[0_0_12px_rgba(168,85,247,0.3)]"
            >
              <Plus size={15} />
              <span>Invite Colleague</span>
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0f1422] text-slate-400 border-b border-slate-800">
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Work Email</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {team.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-7 h-7 rounded-full object-cover border border-purple-500/40"
                        />
                        <span className="font-semibold text-white">{m.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">{m.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-950/60 text-purple-300 border border-purple-500/40">
                        {m.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-emerald-400 font-semibold">{m.status}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-slate-400 hover:text-rose-400 p-1 rounded transition">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === 'notifications' && (
        <div className="saas-card rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-4">
          <h3 className="text-base font-bold text-white">Alerts & Dispatch Rules</h3>
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0c101d] border border-slate-800">
              <div>
                <p className="text-xs font-bold text-white">Critical Incident Escalations</p>
                <p className="text-[11px] text-slate-400">Immediate SMS and high-priority webhook trigger on High/Critical incident creation.</p>
              </div>
              <input
                type="checkbox"
                checked={incidentEscalation}
                onChange={() => setIncidentEscalation(!incidentEscalation)}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0c101d] border border-slate-800">
              <div>
                <p className="text-xs font-bold text-white">Surveillance Audit Reminders</p>
                <p className="text-[11px] text-slate-400">Daily digests when controls or external certifications are within 14 days of due date.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={() => setEmailAlerts(!emailAlerts)}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Security & 2FA */}
      {activeTab === 'security' && (
        <div className="saas-card rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-4">
          <h3 className="text-base font-bold text-white">Enterprise Authentication & Cryptography</h3>
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0c101d] border border-slate-800">
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <KeyRound size={14} className="text-purple-400" />
                  Hardware-bound WebAuthn & TOTP 2FA
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Enforce two-factor token on every administrative login.</p>
              </div>
              <button
                onClick={() => setTwoFactor(!twoFactor)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                  twoFactor
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {twoFactor ? 'Active' : 'Disabled'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0c101d] border border-slate-800">
              <div>
                <p className="text-xs font-bold text-white">Inactivity Session Timeout</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Automatically terminates idle browser sessions to satisfy SOC 2 CC6.1.</p>
              </div>
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950 px-2 py-1 rounded border border-purple-500/30">
                15 Minutes
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Theme Appearance */}
      {activeTab === 'theme' && (
        <div className="saas-card rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-4">
          <h3 className="text-base font-bold text-white">Interface Styling & Theme</h3>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#0b0f19] border-2 border-purple-500/90 shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer">
              <div className="w-full h-12 rounded bg-[#0b0f19] border border-slate-800 mb-2 flex items-center px-3 gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="w-12 h-1.5 rounded bg-slate-700" />
              </div>
              <p className="text-xs font-bold text-white">Dark Navy (Active)</p>
              <p className="text-[10px] text-purple-300">Signature Compliance Compass palette</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0c101d] border border-slate-800 opacity-60 hover:opacity-100 transition cursor-pointer">
              <div className="w-full h-12 rounded bg-[#13131c] border border-slate-800 mb-2 flex items-center px-3 gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="w-12 h-1.5 rounded bg-slate-700" />
              </div>
              <p className="text-xs font-bold text-white">Midnight Charcoal</p>
              <p className="text-[10px] text-slate-400">Deep obsidian with indigo accent</p>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111726] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Invite Team Colleague</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSendInvite} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Colleague Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Vance"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. david.vance@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role & Permissions</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Compliance Officer">Compliance Officer</option>
                  <option value="Lead Auditor">Lead Auditor</option>
                  <option value="Risk Analyst">Risk Analyst</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
