import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-Memory Database store with seed data
let database = {
  users: [
    {
      id: 'usr_1',
      name: 'Sawera',
      email: 'isfatimasawera274@gmail.com',
      title: 'Compliance Director & System Admin',
      role: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      organizationId: 'org_1'
    }
  ],
  organizations: [
    {
      id: 'org_1',
      name: 'Apex Global Financials',
      industry: 'FinTech / Enterprise Banking',
      size: '500-1000 employees',
      complianceFrameworks: ['ISO 27001', 'SOC 2', 'GDPR', 'NIST CSF']
    }
  ],
  risks: [
    {
      id: 'rsk-1',
      code: 'RSK-101',
      title: 'Data Breach: Customer PII Exfiltration',
      description: 'High impact incident where malicious adversary targets primary customer relational databases via supply chain compromised dependencies.',
      category: 'Cybersecurity',
      likelihood: 4,
      impact: 5,
      score: 20,
      priority: 'Critical',
      status: 'Mitigating',
      assignedTo: 'Sarah Jenkins',
      mitigationPlan: 'Implement zero-trust network segmentation, field-level encryption with AWS KMS, and automated dependency scanning with Snyk.',
      createdAt: '2024-04-10',
      updatedAt: '2024-05-18'
    },
    {
      id: 'rsk-2',
      code: 'RSK-102',
      title: 'Policy Violation: Unapproved AI Tools in Engineering',
      description: 'Engineers pasting proprietary algorithm IP and customer telemetry into unvetted public LLM playground tools.',
      category: 'Data Privacy',
      likelihood: 3,
      impact: 4,
      score: 12,
      priority: 'High',
      status: 'Assessing',
      assignedTo: 'Airah Jenkno',
      mitigationPlan: 'Deploy corporate proxy DLP filtering and enterprise provisioned Google Gemini API instances with privacy guardrails.',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-20'
    },
    {
      id: 'rsk-3',
      code: 'RSK-103',
      title: 'Data Breach: Third-Party Vendor API Token Leak',
      description: 'Payment gateway API webhook secret accidentally committed to internal Git repository.',
      category: 'Third-Party',
      likelihood: 2,
      impact: 5,
      score: 10,
      priority: 'High',
      status: 'Mitigating',
      assignedTo: 'Sarah Luan',
      mitigationPlan: 'Implement pre-commit Git Guardian secrets detection and short-lived ephemeral secret tokens.',
      createdAt: '2024-04-14',
      updatedAt: '2024-05-22'
    },
    {
      id: 'rsk-4',
      code: 'RSK-104',
      title: 'Policy Violation: Retention Policy Non-Compliance',
      description: 'Historical audit logs stored beyond 7-year regulatory period in unindexed S3 buckets violates EU GDPR right-to-be-forgotten.',
      category: 'Regulatory',
      likelihood: 2,
      impact: 2,
      score: 4,
      priority: 'Low',
      status: 'Identified',
      assignedTo: 'Sarah Luan',
      mitigationPlan: 'Configure automated lifecycle expiration policies on audit log buckets.',
      createdAt: '2024-05-10',
      updatedAt: '2024-05-15'
    },
    {
      id: 'rsk-5',
      code: 'RSK-105',
      title: 'Ransomware Infection in Staging Cluster',
      description: 'Lateral movement through container vulnerability in non-production environments.',
      category: 'Cybersecurity',
      likelihood: 3,
      impact: 4,
      score: 12,
      priority: 'High',
      status: 'Monitored',
      assignedTo: 'Airah Jenkno',
      mitigationPlan: 'Enforce non-root Docker containers, read-only root filesystems, and continuous Falco runtime monitoring.',
      createdAt: '2024-03-25',
      updatedAt: '2024-05-10'
    }
  ],
  incidents: [
    {
      id: 'inc-1',
      code: '1001',
      title: 'Data Privacy Breach',
      category: 'Data Privacy',
      severity: 'High',
      status: 'Under Review',
      assignedTo: 'Assigned To',
      assignedAvatar: '',
      date: '12/7/2024',
      description: 'Suspicious exfiltration attempt identified on database shard eu-west-1. Customer telemetry export packet size exceeded standard threshold.',
      reportedBy: 'SIEM Autonomous Bot',
      mitigationNotes: 'Shard isolated, token revocation initiated. Reviewing firewall egress logs.',
      attachmentsCount: 3,
      comments: [
        {
          id: 'c1',
          author: 'Sarah Jenkins',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
          content: 'I have engaged the external forensic incident response team. Please verify all API secret rotations.',
          createdAt: '12/7/2024 10:14 AM'
        }
      ]
    },
    {
      id: 'inc-2',
      code: '1002',
      title: 'Policy Violation',
      category: 'Policy Violation',
      severity: 'Medium',
      status: 'Assigned',
      assignedTo: 'Airah Jenkno',
      assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      date: '07/7/2024',
      description: 'Unencrypted backup drive connected to staging workstation without secondary clearance.',
      reportedBy: 'Compliance Watchdog',
      mitigationNotes: 'Drive confiscated and sanitized. Mandatory retraining scheduled.',
      attachmentsCount: 1,
      comments: []
    },
    {
      id: 'inc-3',
      code: '1003',
      title: 'Data Privacy Breach',
      category: 'Data Privacy',
      severity: 'Low',
      status: 'Resolved',
      assignedTo: 'Sarah Luan',
      assignedAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      date: '17/7/2024',
      description: 'Marketing email sent with internal preview recipient list visible in header cc line.',
      reportedBy: 'Sarah Luan',
      mitigationNotes: 'Recall message broadcasted within 60 seconds.',
      attachmentsCount: 2,
      comments: []
    },
    {
      id: 'inc-4',
      code: '1004',
      title: 'Data Privacy Breach',
      category: 'Data Privacy',
      severity: 'Low',
      status: 'Resolved',
      assignedTo: 'Sarah Luan',
      assignedAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      date: '12/7/2024',
      description: 'Test sandbox endpoint temporarily exposed mocked PII data to developer portal.',
      reportedBy: 'DevSecOps Pipeline',
      mitigationNotes: 'Endpoint restricted to localhost proxy.',
      attachmentsCount: 1,
      comments: []
    }
  ],
  audits: [
    {
      id: 'aud-1',
      title: 'ISO/IEC 27001:2022 Surveillance Audit',
      framework: 'ISO 27001',
      scope: 'Enterprise Cloud Infrastructure & Information Security Management System',
      leadAuditor: 'BSI External Registrar / Sarah Jenkins',
      status: 'Completed',
      dueDate: '2024-05-15',
      progress: 100,
      findingsCount: 1
    },
    {
      id: 'aud-2',
      title: 'SOC 2 Type II Annual Trust Services Criteria',
      framework: 'SOC 2',
      scope: 'Security, Confidentiality & Availability Criteria for SaaS Platform',
      leadAuditor: 'Ernst & Young LLP / Sarah Luan',
      status: 'In Progress',
      dueDate: '2024-06-30',
      progress: 88,
      findingsCount: 3
    },
    {
      id: 'aud-3',
      title: 'GDPR Article 32 Technical Measures Assessment',
      framework: 'GDPR',
      scope: 'Customer Data Processing, Cross-border Transfers & Consent Ledger',
      leadAuditor: 'Airah Jenkno',
      status: 'Pending',
      dueDate: '2024-07-15',
      progress: 45,
      findingsCount: 2
    },
    {
      id: 'aud-4',
      title: 'PCI-DSS v4.0 Scope Validation',
      framework: 'PCI-DSS',
      scope: 'Cardholder Data Environment (CDE) Tokenization Engine',
      leadAuditor: 'Qualified Security Assessor (QSA)',
      status: 'Overdue',
      dueDate: '2024-04-30',
      progress: 75,
      findingsCount: 4
    }
  ],
  controls: [
    {
      id: 'ctl-1',
      controlId: 'A.12.1.2',
      name: 'Change Management & Peer Review',
      description: 'All production code and infrastructure changes must require peer review approval, automated CI security checks, and audit logging.',
      framework: 'ISO 27001',
      owner: 'Sarah Jenkins',
      status: 'Implemented',
      complianceRate: 100,
      reviewDate: '2024-05-01',
      evidenceCount: 12
    },
    {
      id: 'ctl-2',
      controlId: 'CC6.1',
      name: 'Logical Access Control & Multi-Factor Auth',
      description: 'Enforce hardware-bound 2FA and role-based access control (RBAC) across all administrative cloud portals.',
      framework: 'SOC 2',
      owner: 'Airah Jenkno',
      status: 'Implemented',
      complianceRate: 98,
      reviewDate: '2024-05-12',
      evidenceCount: 8
    },
    {
      id: 'ctl-3',
      controlId: 'Art. 33',
      name: '72-Hour Data Breach Notification Protocol',
      description: 'Formalized breach investigation procedures ensuring supervisory authority notification within 72 hours of awareness.',
      framework: 'GDPR',
      owner: 'Sarah Jenkins',
      status: 'Implemented',
      complianceRate: 95,
      reviewDate: '2024-04-20',
      evidenceCount: 5
    },
    {
      id: 'ctl-4',
      controlId: 'PR.DS-1',
      name: 'Data-at-Rest & In-Transit Cryptography',
      description: 'AES-256 GCM encryption for stored volumes and TLS 1.3 encryption with strict cipher suites for external transport.',
      framework: 'NIST CSF',
      owner: 'Sarah Luan',
      status: 'Implemented',
      complianceRate: 100,
      reviewDate: '2024-05-18',
      evidenceCount: 14
    }
  ],
  team: [
    {
      id: 'tm-1',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@compliancecompass.io',
      role: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      status: 'Active'
    },
    {
      id: 'tm-2',
      name: 'Airah Jenkno',
      email: 'airah.jenkno@compliancecompass.io',
      role: 'Compliance Officer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      status: 'Active'
    },
    {
      id: 'tm-3',
      name: 'Sarah Luan',
      email: 'sarah.luan@compliancecompass.io',
      role: 'Lead Auditor',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      status: 'Active'
    }
  ],
  notifications: [
    {
      id: 'n1',
      title: 'New Critical Incident Flagged',
      message: 'Incident #1001 (Data Privacy Breach) was escalated to High severity.',
      time: '15m ago',
      type: 'alert',
      read: false
    },
    {
      id: 'n2',
      title: 'ISO 27001 Surveillance Audit Completed',
      message: 'Audit #AUD-2024-03 achieved 98% conformance with zero critical findings.',
      time: '2h ago',
      type: 'audit',
      read: false
    }
  ]
};

// ================= API ROUTES =================

// Auth
app.get('/api/auth/me', (req: Request, res: Response) => {
  res.json({ success: true, user: database.users[0] });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = database.users.find(u => u.email.toLowerCase() === email?.toLowerCase()) || database.users[0];
  res.json({ success: true, user });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, companyName } = req.body;
  const newUser = {
    id: `usr_${Date.now()}`,
    name: name || 'Compliance Professional',
    email: email || 'user@example.com',
    title: 'Compliance Specialist',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    organizationId: `org_${Date.now()}`
  };
  const newOrg = {
    id: newUser.organizationId,
    name: companyName || 'My Enterprise Corp',
    industry: 'Enterprise Software & SaaS',
    size: '100-500 employees',
    complianceFrameworks: ['ISO 27001', 'SOC 2']
  };
  database.users.push(newUser);
  database.organizations.push(newOrg);
  res.status(201).json({ success: true, user: newUser, organization: newOrg });
});

// KPIs summary
app.get('/api/kpis', (req: Request, res: Response) => {
  // Matches screenshot values precisely
  res.json({
    totalRisks: 145,
    totalRisksTrend: '+8%',
    activeIncidents: 32,
    activeIncidentsTrend: '-12%',
    auditCompletion: 88,
    complianceScore: 92
  });
});

// Risks CRUD
app.get('/api/risks', (req: Request, res: Response) => {
  const { query, category, priority } = req.query;
  let items = [...database.risks];
  if (query && typeof query === 'string') {
    const q = query.toLowerCase();
    items = items.filter(r => r.title.toLowerCase().includes(q) || r.code.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
  }
  if (category && typeof category === 'string' && category !== 'All') {
    items = items.filter(r => r.category === category);
  }
  if (priority && typeof priority === 'string' && priority !== 'All') {
    items = items.filter(r => r.priority === priority);
  }
  res.json(items);
});

app.post('/api/risks', (req: Request, res: Response) => {
  const payload = req.body;
  const score = (payload.likelihood || 3) * (payload.impact || 3);
  let priority = 'Medium';
  if (score >= 16) priority = 'Critical';
  else if (score >= 10) priority = 'High';
  else if (score >= 5) priority = 'Medium';
  else priority = 'Low';

  const newRisk = {
    id: `rsk-${Date.now()}`,
    code: `RSK-${Math.floor(100 + Math.random() * 900)}`,
    title: payload.title || 'Untitled Risk Assessment',
    description: payload.description || '',
    category: payload.category || 'Operational',
    likelihood: payload.likelihood || 3,
    impact: payload.impact || 3,
    score,
    priority,
    status: payload.status || 'Identified',
    assignedTo: payload.assignedTo || 'Sarah Jenkins',
    mitigationPlan: payload.mitigationPlan || '',
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };
  database.risks.unshift(newRisk);
  res.status(201).json(newRisk);
});

app.put('/api/risks/:id', (req: Request, res: Response) => {
  const index = database.risks.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Risk not found' });
  const payload = req.body;
  const likelihood = payload.likelihood ?? database.risks[index].likelihood;
  const impact = payload.impact ?? database.risks[index].impact;
  const score = likelihood * impact;
  let priority = database.risks[index].priority;
  if (score >= 16) priority = 'Critical';
  else if (score >= 10) priority = 'High';
  else if (score >= 5) priority = 'Medium';
  else priority = 'Low';

  database.risks[index] = {
    ...database.risks[index],
    ...payload,
    score,
    priority,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  res.json(database.risks[index]);
});

app.delete('/api/risks/:id', (req: Request, res: Response) => {
  const index = database.risks.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Risk not found' });
  const deleted = database.risks.splice(index, 1);
  res.json({ success: true, deleted: deleted[0] });
});

// Incidents CRUD
app.get('/api/incidents', (req: Request, res: Response) => {
  const { query, severity, status } = req.query;
  let items = [...database.incidents];
  if (query && typeof query === 'string') {
    const q = query.toLowerCase();
    items = items.filter(i => i.title.toLowerCase().includes(q) || i.code.includes(q) || (i.description && i.description.toLowerCase().includes(q)));
  }
  if (severity && typeof severity === 'string' && severity !== 'All') {
    items = items.filter(i => i.severity === severity);
  }
  if (status && typeof status === 'string' && status !== 'All') {
    items = items.filter(i => i.status === status);
  }
  res.json(items);
});

app.post('/api/incidents', (req: Request, res: Response) => {
  const payload = req.body;
  const nextNum = 1000 + database.incidents.length + 1;
  const newIncident = {
    id: `inc-${Date.now()}`,
    code: String(nextNum),
    title: payload.title || 'Security Incident Event',
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
  database.incidents.unshift(newIncident);
  res.status(201).json(newIncident);
});

app.put('/api/incidents/:id', (req: Request, res: Response) => {
  const index = database.incidents.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Incident not found' });
  database.incidents[index] = {
    ...database.incidents[index],
    ...req.body
  };
  res.json(database.incidents[index]);
});

app.delete('/api/incidents/:id', (req: Request, res: Response) => {
  const index = database.incidents.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Incident not found' });
  const deleted = database.incidents.splice(index, 1);
  res.json({ success: true, deleted: deleted[0] });
});

app.post('/api/incidents/:id/comments', (req: Request, res: Response) => {
  const incident = database.incidents.find(i => i.id === req.params.id);
  if (!incident) return res.status(404).json({ error: 'Incident not found' });
  const comment = {
    id: `c_${Date.now()}`,
    author: req.body.author || 'Sarah Jenkins',
    avatar: req.body.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    content: req.body.content || '',
    createdAt: new Date().toLocaleString()
  };
  if (!incident.comments) incident.comments = [];
  incident.comments.push(comment);
  res.status(201).json(comment);
});

// Audits CRUD
app.get('/api/audits', (req: Request, res: Response) => {
  res.json(database.audits);
});

app.post('/api/audits', (req: Request, res: Response) => {
  const payload = req.body;
  const newAudit = {
    id: `aud-${Date.now()}`,
    title: payload.title || 'New Compliance Audit',
    framework: payload.framework || 'ISO 27001',
    scope: payload.scope || 'General IT Controls & Information Security',
    leadAuditor: payload.leadAuditor || 'Sarah Jenkins',
    status: payload.status || 'Pending',
    dueDate: payload.dueDate || '2024-09-30',
    progress: payload.progress || 0,
    findingsCount: payload.findingsCount || 0
  };
  database.audits.unshift(newAudit);
  res.status(201).json(newAudit);
});

app.put('/api/audits/:id', (req: Request, res: Response) => {
  const index = database.audits.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Audit not found' });
  database.audits[index] = { ...database.audits[index], ...req.body };
  res.json(database.audits[index]);
});

app.delete('/api/audits/:id', (req: Request, res: Response) => {
  const index = database.audits.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Audit not found' });
  const deleted = database.audits.splice(index, 1);
  res.json({ success: true, deleted: deleted[0] });
});

// Controls CRUD
app.get('/api/controls', (req: Request, res: Response) => {
  res.json(database.controls);
});

app.post('/api/controls', (req: Request, res: Response) => {
  const payload = req.body;
  const newControl = {
    id: `ctl-${Date.now()}`,
    controlId: payload.controlId || 'A.10.1',
    name: payload.name || 'New Security Control',
    description: payload.description || '',
    framework: payload.framework || 'ISO 27001',
    owner: payload.owner || 'Sarah Jenkins',
    status: payload.status || 'In Progress',
    complianceRate: payload.complianceRate || 80,
    reviewDate: payload.reviewDate || '2024-08-01',
    evidenceCount: payload.evidenceCount || 1
  };
  database.controls.unshift(newControl);
  res.status(201).json(newControl);
});

app.put('/api/controls/:id', (req: Request, res: Response) => {
  const index = database.controls.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Control not found' });
  database.controls[index] = { ...database.controls[index], ...req.body };
  res.json(database.controls[index]);
});

app.delete('/api/controls/:id', (req: Request, res: Response) => {
  const index = database.controls.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Control not found' });
  const deleted = database.controls.splice(index, 1);
  res.json({ success: true, deleted: deleted[0] });
});

// Team Members
app.get('/api/team', (req: Request, res: Response) => {
  res.json(database.team);
});

app.post('/api/team/invite', (req: Request, res: Response) => {
  const { name, email, role } = req.body;
  const newMember = {
    id: `tm-${Date.now()}`,
    name: name || 'Invited User',
    email: email || 'user@example.com',
    role: role || 'Compliance Officer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    status: 'Invited'
  };
  database.team.push(newMember);
  res.status(201).json(newMember);
});

// Notifications
app.get('/api/notifications', (req: Request, res: Response) => {
  res.json(database.notifications);
});

app.put('/api/notifications/:id/read', (req: Request, res: Response) => {
  const notif = database.notifications.find(n => n.id === req.params.id);
  if (notif) notif.read = true;
  res.json({ success: true, notification: notif });
});

// Start Server with Vite Middleware
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Compliance Compass Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
