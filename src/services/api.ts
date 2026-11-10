import {
  Risk,
  Incident,
  Audit,
  ComplianceControl,
  TeamMember,
  UserProfile,
  NotificationItem
} from '../types';
import {
  CURRENT_USER,
  INITIAL_INCIDENTS,
  INITIAL_RISKS,
  INITIAL_AUDITS,
  INITIAL_CONTROLS,
  INITIAL_TEAM,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

// Local storage keys for resilient persistence
const STORAGE_KEYS = {
  RISKS: 'cc_risks_v1',
  INCIDENTS: 'cc_incidents_v1',
  AUDITS: 'cc_audits_v1',
  CONTROLS: 'cc_controls_v1',
  TEAM: 'cc_team_v1',
  USER: 'cc_user_v1',
  NOTIFICATIONS: 'cc_notifications_v1',
};

// Helper for local caching fallback
function getLocal<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error('Storage write error', err);
  }
}

export const ApiService = {
  // Current user & auth
  async getCurrentUser(): Promise<UserProfile> {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setLocal(STORAGE_KEYS.USER, data.user);
          return data.user;
        }
      }
    } catch {}
    const cached = getLocal(STORAGE_KEYS.USER, CURRENT_USER);
    if (cached.email?.includes('jenkins')) {
      setLocal(STORAGE_KEYS.USER, CURRENT_USER);
      return CURRENT_USER;
    }
    return cached;
  },

  async login(email: string): Promise<UserProfile> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.USER, data.user);
        return data.user;
      }
    } catch {}
    const user = { ...CURRENT_USER, email };
    setLocal(STORAGE_KEYS.USER, user);
    return user;
  },

  async register(name: string, email: string, companyName: string): Promise<{ user: UserProfile }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, companyName })
      });
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.USER, data.user);
        return data;
      }
    } catch {}
    const user: UserProfile = {
      id: `usr_${Date.now()}`,
      name,
      email,
      title: 'Compliance Specialist',
      role: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      organizationId: 'org_custom'
    };
    setLocal(STORAGE_KEYS.USER, user);
    return { user };
  },

  // KPIs
  async getKPIs() {
    try {
      const res = await fetch('/api/kpis');
      if (res.ok) return await res.json();
    } catch {}
    return {
      totalRisks: 145,
      totalRisksTrend: '+8%',
      activeIncidents: 32,
      activeIncidentsTrend: '-12%',
      auditCompletion: 88,
      complianceScore: 92
    };
  },

  // Risks
  async getRisks(): Promise<Risk[]> {
    try {
      const res = await fetch('/api/risks');
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.RISKS, data);
        return data;
      }
    } catch {}
    return getLocal(STORAGE_KEYS.RISKS, INITIAL_RISKS);
  },

  async createRisk(payload: Partial<Risk>): Promise<Risk> {
    try {
      const res = await fetch('/api/risks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const created = await res.json();
        const current = getLocal<Risk[]>(STORAGE_KEYS.RISKS, INITIAL_RISKS);
        setLocal(STORAGE_KEYS.RISKS, [created, ...current]);
        return created;
      }
    } catch {}
    const likelihood = payload.likelihood || 3;
    const impact = payload.impact || 3;
    const score = likelihood * impact;
    let priority: Risk['priority'] = 'Medium';
    if (score >= 16) priority = 'Critical';
    else if (score >= 10) priority = 'High';
    else if (score >= 5) priority = 'Medium';
    else priority = 'Low';

    const fallback: Risk = {
      id: `rsk-${Date.now()}`,
      code: `RSK-${Math.floor(100 + Math.random() * 900)}`,
      title: payload.title || 'New Risk',
      description: payload.description || '',
      category: payload.category || 'Operational',
      likelihood,
      impact,
      score,
      priority,
      status: payload.status || 'Identified',
      assignedTo: payload.assignedTo || 'Sarah Jenkins',
      mitigationPlan: payload.mitigationPlan || '',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    const current = getLocal<Risk[]>(STORAGE_KEYS.RISKS, INITIAL_RISKS);
    setLocal(STORAGE_KEYS.RISKS, [fallback, ...current]);
    return fallback;
  },

  async updateRisk(id: string, payload: Partial<Risk>): Promise<Risk> {
    try {
      const res = await fetch(`/api/risks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updated = await res.json();
        const current = getLocal<Risk[]>(STORAGE_KEYS.RISKS, INITIAL_RISKS);
        setLocal(STORAGE_KEYS.RISKS, current.map(r => r.id === id ? updated : r));
        return updated;
      }
    } catch {}
    const current = getLocal<Risk[]>(STORAGE_KEYS.RISKS, INITIAL_RISKS);
    const updated = current.map(r => {
      if (r.id === id) {
        const l = payload.likelihood ?? r.likelihood;
        const i = payload.impact ?? r.impact;
        const score = l * i;
        let priority: Risk['priority'] = 'Medium';
        if (score >= 16) priority = 'Critical';
        else if (score >= 10) priority = 'High';
        else if (score >= 5) priority = 'Medium';
        else priority = 'Low';
        return { ...r, ...payload, score, priority, updatedAt: new Date().toISOString().split('T')[0] };
      }
      return r;
    });
    setLocal(STORAGE_KEYS.RISKS, updated);
    return updated.find(r => r.id === id)!;
  },

  async deleteRisk(id: string): Promise<boolean> {
    try {
      await fetch(`/api/risks/${id}`, { method: 'DELETE' });
    } catch {}
    const current = getLocal<Risk[]>(STORAGE_KEYS.RISKS, INITIAL_RISKS);
    setLocal(STORAGE_KEYS.RISKS, current.filter(r => r.id !== id));
    return true;
  },

  // Incidents
  async getIncidents(): Promise<Incident[]> {
    try {
      const res = await fetch('/api/incidents');
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.INCIDENTS, data);
        return data;
      }
    } catch {}
    return getLocal(STORAGE_KEYS.INCIDENTS, INITIAL_INCIDENTS);
  },

  async createIncident(payload: Partial<Incident>): Promise<Incident> {
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const created = await res.json();
        const current = getLocal<Incident[]>(STORAGE_KEYS.INCIDENTS, INITIAL_INCIDENTS);
        setLocal(STORAGE_KEYS.INCIDENTS, [created, ...current]);
        return created;
      }
    } catch {}
    const current = getLocal<Incident[]>(STORAGE_KEYS.INCIDENTS, INITIAL_INCIDENTS);
    const nextCode = (1000 + current.length + 1).toString();
    const fallback: Incident = {
      id: `inc-${Date.now()}`,
      code: nextCode,
      title: payload.title || 'Security Incident',
      category: payload.category || 'Security Breach',
      severity: payload.severity || 'Medium',
      status: payload.status || 'Open',
      assignedTo: payload.assignedTo || 'Sarah Jenkins',
      assignedAvatar: payload.assignedAvatar || '',
      date: new Date().toLocaleDateString('en-GB'),
      description: payload.description || '',
      reportedBy: payload.reportedBy || 'Internal Compliance Audit',
      mitigationNotes: payload.mitigationNotes || '',
      attachmentsCount: payload.attachmentsCount || 0,
      comments: []
    };
    setLocal(STORAGE_KEYS.INCIDENTS, [fallback, ...current]);
    return fallback;
  },

  async updateIncident(id: string, payload: Partial<Incident>): Promise<Incident> {
    try {
      const res = await fetch(`/api/incidents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updated = await res.json();
        const current = getLocal<Incident[]>(STORAGE_KEYS.INCIDENTS, INITIAL_INCIDENTS);
        setLocal(STORAGE_KEYS.INCIDENTS, current.map(i => i.id === id ? updated : i));
        return updated;
      }
    } catch {}
    const current = getLocal<Incident[]>(STORAGE_KEYS.INCIDENTS, INITIAL_INCIDENTS);
    const updated = current.map(i => i.id === id ? { ...i, ...payload } : i);
    setLocal(STORAGE_KEYS.INCIDENTS, updated);
    return updated.find(i => i.id === id)!;
  },

  async addIncidentComment(incidentId: string, content: string, author = 'Sarah Jenkins'): Promise<Incident> {
    try {
      const res = await fetch(`/api/incidents/${incidentId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, author })
      });
      if (res.ok) {
        const comment = await res.json();
        const current = getLocal<Incident[]>(STORAGE_KEYS.INCIDENTS, INITIAL_INCIDENTS);
        const updated = current.map(i => {
          if (i.id === incidentId) {
            return { ...i, comments: [...(i.comments || []), comment] };
          }
          return i;
        });
        setLocal(STORAGE_KEYS.INCIDENTS, updated);
        return updated.find(i => i.id === incidentId)!;
      }
    } catch {}
    const current = getLocal<Incident[]>(STORAGE_KEYS.INCIDENTS, INITIAL_INCIDENTS);
    const updated = current.map(i => {
      if (i.id === incidentId) {
        const newC = {
          id: `c_${Date.now()}`,
          author,
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
          content,
          createdAt: 'Just now'
        };
        return { ...i, comments: [...(i.comments || []), newC] };
      }
      return i;
    });
    setLocal(STORAGE_KEYS.INCIDENTS, updated);
    return updated.find(i => i.id === incidentId)!;
  },

  async deleteIncident(id: string): Promise<boolean> {
    try {
      await fetch(`/api/incidents/${id}`, { method: 'DELETE' });
    } catch {}
    const current = getLocal<Incident[]>(STORAGE_KEYS.INCIDENTS, INITIAL_INCIDENTS);
    setLocal(STORAGE_KEYS.INCIDENTS, current.filter(i => i.id !== id));
    return true;
  },

  // Audits
  async getAudits(): Promise<Audit[]> {
    try {
      const res = await fetch('/api/audits');
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.AUDITS, data);
        return data;
      }
    } catch {}
    return getLocal(STORAGE_KEYS.AUDITS, INITIAL_AUDITS);
  },

  async createAudit(payload: Partial<Audit>): Promise<Audit> {
    try {
      const res = await fetch('/api/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const created = await res.json();
        const current = getLocal<Audit[]>(STORAGE_KEYS.AUDITS, INITIAL_AUDITS);
        setLocal(STORAGE_KEYS.AUDITS, [created, ...current]);
        return created;
      }
    } catch {}
    const current = getLocal<Audit[]>(STORAGE_KEYS.AUDITS, INITIAL_AUDITS);
    const fallback: Audit = {
      id: `aud-${Date.now()}`,
      title: payload.title || 'Compliance Assessment',
      framework: payload.framework || 'ISO 27001',
      scope: payload.scope || 'Cloud and IT infrastructure',
      leadAuditor: payload.leadAuditor || 'Sarah Jenkins',
      status: payload.status || 'Pending',
      dueDate: payload.dueDate || '2024-10-15',
      progress: payload.progress || 0,
      findingsCount: payload.findingsCount || 0
    };
    setLocal(STORAGE_KEYS.AUDITS, [fallback, ...current]);
    return fallback;
  },

  async updateAudit(id: string, payload: Partial<Audit>): Promise<Audit> {
    try {
      const res = await fetch(`/api/audits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updated = await res.json();
        const current = getLocal<Audit[]>(STORAGE_KEYS.AUDITS, INITIAL_AUDITS);
        setLocal(STORAGE_KEYS.AUDITS, current.map(a => a.id === id ? updated : a));
        return updated;
      }
    } catch {}
    const current = getLocal<Audit[]>(STORAGE_KEYS.AUDITS, INITIAL_AUDITS);
    const updated = current.map(a => a.id === id ? { ...a, ...payload } : a);
    setLocal(STORAGE_KEYS.AUDITS, updated);
    return updated.find(a => a.id === id)!;
  },

  // Controls
  async getControls(): Promise<ComplianceControl[]> {
    try {
      const res = await fetch('/api/controls');
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.CONTROLS, data);
        return data;
      }
    } catch {}
    return getLocal(STORAGE_KEYS.CONTROLS, INITIAL_CONTROLS);
  },

  async createControl(payload: Partial<ComplianceControl>): Promise<ComplianceControl> {
    try {
      const res = await fetch('/api/controls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const created = await res.json();
        const current = getLocal<ComplianceControl[]>(STORAGE_KEYS.CONTROLS, INITIAL_CONTROLS);
        setLocal(STORAGE_KEYS.CONTROLS, [created, ...current]);
        return created;
      }
    } catch {}
    const current = getLocal<ComplianceControl[]>(STORAGE_KEYS.CONTROLS, INITIAL_CONTROLS);
    const fallback: ComplianceControl = {
      id: `ctl-${Date.now()}`,
      controlId: payload.controlId || `CTL-${Math.floor(10 + Math.random() * 90)}`,
      name: payload.name || 'New Security Control',
      description: payload.description || '',
      framework: payload.framework || 'ISO 27001',
      owner: payload.owner || 'Sarah Jenkins',
      status: payload.status || 'In Progress',
      complianceRate: payload.complianceRate || 80,
      reviewDate: payload.reviewDate || '2024-09-01',
      evidenceCount: payload.evidenceCount || 1
    };
    setLocal(STORAGE_KEYS.CONTROLS, [fallback, ...current]);
    return fallback;
  },

  async updateControl(id: string, payload: Partial<ComplianceControl>): Promise<ComplianceControl> {
    try {
      const res = await fetch(`/api/controls/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updated = await res.json();
        const current = getLocal<ComplianceControl[]>(STORAGE_KEYS.CONTROLS, INITIAL_CONTROLS);
        setLocal(STORAGE_KEYS.CONTROLS, current.map(c => c.id === id ? updated : c));
        return updated;
      }
    } catch {}
    const current = getLocal<ComplianceControl[]>(STORAGE_KEYS.CONTROLS, INITIAL_CONTROLS);
    const updated = current.map(c => c.id === id ? { ...c, ...payload } : c);
    setLocal(STORAGE_KEYS.CONTROLS, updated);
    return updated.find(c => c.id === id)!;
  },

  // Team
  async getTeam(): Promise<TeamMember[]> {
    try {
      const res = await fetch('/api/team');
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.TEAM, data);
        return data;
      }
    } catch {}
    return getLocal(STORAGE_KEYS.TEAM, INITIAL_TEAM);
  },

  async inviteTeamMember(name: string, email: string, role: TeamMember['role']): Promise<TeamMember> {
    try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role })
      });
      if (res.ok) {
        const created = await res.json();
        const current = getLocal<TeamMember[]>(STORAGE_KEYS.TEAM, INITIAL_TEAM);
        setLocal(STORAGE_KEYS.TEAM, [...current, created]);
        return created;
      }
    } catch {}
    const current = getLocal<TeamMember[]>(STORAGE_KEYS.TEAM, INITIAL_TEAM);
    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name,
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      status: 'Invited'
    };
    setLocal(STORAGE_KEYS.TEAM, [...current, newMember]);
    return newMember;
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.NOTIFICATIONS, data);
        return data;
      }
    } catch {}
    return getLocal(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },

  async markNotificationRead(id: string): Promise<void> {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
    } catch {}
    const current = getLocal<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    setLocal(STORAGE_KEYS.NOTIFICATIONS, current.map(n => n.id === id ? { ...n, read: true } : n));
  }
};
