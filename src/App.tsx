import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  AlertTriangle,
  BarChart3,
  Settings
} from 'lucide-react';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { RiskAssessmentModule } from './components/risks/RiskAssessmentModule';
import { IncidentManagementModule } from './components/incidents/IncidentManagementModule';
import { AuditAnalyticsModule } from './components/audits/AuditAnalyticsModule';
import { ControlsModule } from './components/controls/ControlsModule';
import { ReportsModule } from './components/reports/ReportsModule';
import { SettingsModule } from './components/settings/SettingsModule';

// Modals
import { RiskModal } from './components/modals/RiskModal';
import { IncidentDetailDrawer } from './components/modals/IncidentDetailDrawer';
import { CreateIncidentModal } from './components/modals/CreateIncidentModal';
import { CreateAuditModal } from './components/modals/CreateAuditModal';
import { CreateControlModal } from './components/modals/CreateControlModal';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';

import { ApiService } from './services/api';
import {
  Risk,
  Incident,
  Audit,
  ComplianceControl,
  TeamMember,
  UserProfile,
  Organization,
  NotificationItem,
  RiskLikelihood,
  RiskImpact,
  IncidentStatus
} from './types';
import { CURRENT_USER, INITIAL_ORGANIZATION } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Core Data State
  const [user, setUser] = useState<UserProfile>(CURRENT_USER);
  const [organization, setOrganization] = useState<Organization>(INITIAL_ORGANIZATION);
  const [kpis, setKpis] = useState({
    totalRisks: 145,
    totalRisksTrend: '+8%',
    activeIncidents: 32,
    activeIncidentsTrend: '-12%',
    auditCompletion: 88,
    complianceScore: 92,
  });
  const [risks, setRisks] = useState<Risk[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [controls, setControls] = useState<ComplianceControl[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Modals & Drawers State
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const [heatMapCellPreset, setHeatMapCellPreset] = useState<{
    likelihood: RiskLikelihood;
    impact: RiskImpact;
  }>({ likelihood: 3, impact: 3 });

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isCreateIncidentOpen, setIsCreateIncidentOpen] = useState(false);
  const [isCreateAuditOpen, setIsCreateAuditOpen] = useState(false);
  const [isCreateControlOpen, setIsCreateControlOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Load Data on mount
  useEffect(() => {
    async function loadAll() {
      const [u, k, r, i, a, c, t, n] = await Promise.all([
        ApiService.getCurrentUser(),
        ApiService.getKPIs(),
        ApiService.getRisks(),
        ApiService.getIncidents(),
        ApiService.getAudits(),
        ApiService.getControls(),
        ApiService.getTeam(),
        ApiService.getNotifications(),
      ]);
      setUser(u);
      setKpis(k);
      setRisks(r);
      setIncidents(i);
      setAudits(a);
      setControls(c);
      setTeam(t);
      setNotifications(n);
    }
    loadAll();
  }, []);

  // Update dynamic KPIs when risks/incidents change
  const refreshKPIs = (newRisks: Risk[], newIncidents: Incident[], newAudits: Audit[]) => {
    const activeIncidentsCount = newIncidents.filter(
      (i) => i.status !== 'Resolved' && i.status !== 'Closed'
    ).length;
    const completedAudits = newAudits.filter((a) => a.status === 'Completed').length;
    const auditCompletionPct =
      newAudits.length > 0
        ? Math.round((completedAudits / newAudits.length) * 100)
        : 88;

    setKpis((prev) => ({
      ...prev,
      totalRisks: Math.max(145, newRisks.length),
      activeIncidents: Math.max(activeIncidentsCount, 32),
      auditCompletion: auditCompletionPct,
    }));
  };

  // Risk Handlers
  const handleOpenCreateRisk = (likelihood?: RiskLikelihood, impact?: RiskImpact) => {
    setEditingRisk(null);
    if (likelihood && impact) {
      setHeatMapCellPreset({ likelihood, impact });
    } else {
      setHeatMapCellPreset({ likelihood: 3, impact: 3 });
    }
    setIsRiskModalOpen(true);
  };

  const handleEditRisk = (risk: Risk) => {
    setEditingRisk(risk);
    setIsRiskModalOpen(true);
  };

  const handleSaveRisk = async (data: Partial<Risk>) => {
    if (editingRisk) {
      const updated = await ApiService.updateRisk(editingRisk.id, data);
      const nextRisks = risks.map((r) => (r.id === updated.id ? updated : r));
      setRisks(nextRisks);
      refreshKPIs(nextRisks, incidents, audits);
    } else {
      const created = await ApiService.createRisk(data);
      const nextRisks = [created, ...risks];
      setRisks(nextRisks);
      refreshKPIs(nextRisks, incidents, audits);
    }
  };

  const handleDeleteRisk = async (id: string) => {
    await ApiService.deleteRisk(id);
    const nextRisks = risks.filter((r) => r.id !== id);
    setRisks(nextRisks);
    refreshKPIs(nextRisks, incidents, audits);
  };

  // Incident Handlers
  const handleSaveIncident = async (data: Partial<Incident>) => {
    const created = await ApiService.createIncident(data);
    const nextIncidents = [created, ...incidents];
    setIncidents(nextIncidents);
    refreshKPIs(risks, nextIncidents, audits);
  };

  const handleUpdateIncident = async (id: string, updates: Partial<Incident>) => {
    const updated = await ApiService.updateIncident(id, updates);
    const nextIncidents = incidents.map((i) => (i.id === id ? updated : i));
    setIncidents(nextIncidents);
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident(updated);
    }
    refreshKPIs(risks, nextIncidents, audits);
  };

  const handleAddIncidentComment = async (incidentId: string, content: string) => {
    const updated = await ApiService.addIncidentComment(incidentId, content, user.name);
    setIncidents(incidents.map((i) => (i.id === incidentId ? updated : i)));
    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(updated);
    }
  };

  const handleDeleteIncident = async (id: string) => {
    await ApiService.deleteIncident(id);
    const nextIncidents = incidents.filter((i) => i.id !== id);
    setIncidents(nextIncidents);
    refreshKPIs(risks, nextIncidents, audits);
  };

  // Audit Handlers
  const handleSaveAudit = async (data: Partial<Audit>) => {
    const created = await ApiService.createAudit(data);
    const nextAudits = [created, ...audits];
    setAudits(nextAudits);
    refreshKPIs(risks, incidents, nextAudits);
  };

  const handleUpdateAudit = async (id: string, updates: Partial<Audit>) => {
    const updated = await ApiService.updateAudit(id, updates);
    const nextAudits = audits.map((a) => (a.id === id ? updated : a));
    setAudits(nextAudits);
    refreshKPIs(risks, incidents, nextAudits);
  };

  // Control Handlers
  const handleSaveControl = async (data: Partial<ComplianceControl>) => {
    const created = await ApiService.createControl(data);
    setControls([created, ...controls]);
  };

  const handleUpdateControl = async (id: string, updates: Partial<ComplianceControl>) => {
    const updated = await ApiService.updateControl(id, updates);
    setControls(controls.map((c) => (c.id === id ? updated : c)));
  };

  // Team Handlers
  const handleInviteMember = async (name: string, email: string, role: TeamMember['role']) => {
    const created = await ApiService.inviteTeamMember(name, email, role);
    setTeam([...team, created]);
  };

  // Notification read
  const handleMarkNotificationRead = async (id: string) => {
    await ApiService.markNotificationRead(id);
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Compliance Overview';
      case 'risks':
        return 'Risk Assessments';
      case 'incidents':
        return 'Incident Management';
      case 'audits':
        return 'Audit Analytics';
      case 'controls':
        return 'Controls & Frameworks';
      case 'reports':
        return 'Compliance Reports';
      case 'settings':
        return 'Workspace Settings';
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col lg:flex-row">
      {/* Sidebar Navigation (Desktop fixed + Mobile slide-over drawer) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area: ml-0 on mobile/tablet, responsive margin on desktop */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 w-full ml-0 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* Top Navbar */}
        <TopNavbar
          pageTitle={getPageTitle()}
          subTitle={activeTab === 'dashboard' ? 'May 2024' : undefined}
          user={user}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          onSelectTab={setActiveTab}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Page Content Router with mobile bottom padding */}
        <main className="flex-1 p-3.5 sm:p-5 md:p-6 lg:p-8 max-w-[1600px] w-full mx-auto pb-24 lg:pb-8">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              kpis={kpis}
              risks={risks}
              incidents={incidents}
              onSelectRisk={handleEditRisk}
              onSelectIncident={setSelectedIncident}
              onOpenCreateRisk={handleOpenCreateRisk}
              onOpenCreateIncident={() => setIsCreateIncidentOpen(true)}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'risks' && (
            <RiskAssessmentModule
              risks={risks}
              onOpenCreateModal={() => handleOpenCreateRisk()}
              onEditRisk={handleEditRisk}
              onDeleteRisk={handleDeleteRisk}
            />
          )}

          {activeTab === 'incidents' && (
            <IncidentManagementModule
              incidents={incidents}
              onSelectIncident={setSelectedIncident}
              onOpenCreateModal={() => setIsCreateIncidentOpen(true)}
              onDeleteIncident={handleDeleteIncident}
              onUpdateStatus={(id, status) => handleUpdateIncident(id, { status })}
            />
          )}

          {activeTab === 'audits' && (
            <AuditAnalyticsModule
              audits={audits}
              onOpenCreateAudit={() => setIsCreateAuditOpen(true)}
              onUpdateAudit={handleUpdateAudit}
            />
          )}

          {activeTab === 'controls' && (
            <ControlsModule
              controls={controls}
              onOpenCreateControl={() => setIsCreateControlOpen(true)}
              onUpdateControl={handleUpdateControl}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsModule
              risks={risks}
              incidents={incidents}
              audits={audits}
              controls={controls}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsModule
              user={user}
              organization={organization}
              team={team}
              onUpdateUser={(updated) => setUser({ ...user, ...updated })}
              onInviteMember={handleInviteMember}
            />
          )}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <RiskModal
        isOpen={isRiskModalOpen}
        onClose={() => setIsRiskModalOpen(false)}
        onSave={handleSaveRisk}
        initialRisk={editingRisk}
        defaultLikelihood={heatMapCellPreset.likelihood}
        defaultImpact={heatMapCellPreset.impact}
      />

      <IncidentDetailDrawer
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onUpdateIncident={handleUpdateIncident}
        onAddComment={handleAddIncidentComment}
      />

      <CreateIncidentModal
        isOpen={isCreateIncidentOpen}
        onClose={() => setIsCreateIncidentOpen(false)}
        onSave={handleSaveIncident}
      />

      <CreateAuditModal
        isOpen={isCreateAuditOpen}
        onClose={() => setIsCreateAuditOpen(false)}
        onSave={handleSaveAudit}
      />

      <CreateControlModal
        isOpen={isCreateControlOpen}
        onClose={() => setIsCreateControlOpen(false)}
        onSave={handleSaveControl}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      <OnboardingWizard
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={(orgData) => setOrganization({ ...organization, ...orgData })}
      />

      {/* Mobile Bottom Navigation Bar (Phone & Tablet Thumb Navigation) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0a0e17]/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition ${
            activeTab === 'dashboard' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard size={18} />
          <span className="text-[10px]">Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('risks')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition ${
            activeTab === 'risks' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck size={18} />
          <span className="text-[10px]">Risks</span>
        </button>

        <button
          onClick={() => setActiveTab('incidents')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition ${
            activeTab === 'incidents' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle size={18} />
          <span className="text-[10px]">Incidents</span>
        </button>

        <button
          onClick={() => setActiveTab('audits')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition ${
            activeTab === 'audits' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 size={18} />
          <span className="text-[10px]">Audits</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition ${
            activeTab === 'settings' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings size={18} />
          <span className="text-[10px]">Settings</span>
        </button>
      </nav>
    </div>
  );
}
