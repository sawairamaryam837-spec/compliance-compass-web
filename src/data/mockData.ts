import {
  Risk,
  Incident,
  Audit,
  ComplianceControl,
  TeamMember,
  Organization,
  UserProfile,
  NotificationItem
} from '../types';

export const CURRENT_USER: UserProfile = {
  id: 'usr_1',
  name: 'Sawera',
  title: 'Compliance Director & System Admin',
  email: 'isfatimasawera274@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  organizationId: 'org_1',
  role: 'Admin'
};

export const INITIAL_ORGANIZATION: Organization = {
  id: 'org_1',
  name: 'Apex Global Financials',
  industry: 'FinTech / Enterprise Banking',
  size: '500-1000 employees',
  complianceFrameworks: ['ISO 27001', 'SOC 2', 'GDPR', 'NIST CSF']
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'New Critical Incident Flagged',
    message: 'Incident #1001 (Data Privacy Breach) was escalated to High severity.',
    time: '15m ago',
    type: 'alert',
    read: false,
  },
  {
    id: 'n2',
    title: 'ISO 27001 Surveillance Audit Completed',
    message: 'Audit #AUD-2024-03 achieved 98% conformance with zero critical findings.',
    time: '2h ago',
    type: 'audit',
    read: false,
  },
  {
    id: 'n3',
    title: 'SOC 2 Evidence Review Overdue',
    message: 'Access Control CC6.1 periodic review is awaiting Sarah Jenkins sign-off.',
    time: 'Yesterday',
    type: 'task',
    read: true,
  },
  {
    id: 'n4',
    title: 'Compliance Score Increased',
    message: 'Overall organization compliance score raised to 92%.',
    time: '3 days ago',
    type: 'success',
    read: true,
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
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
      },
      {
        id: 'c2',
        author: 'Airah Jenkno',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        content: 'Tokens rotated. Egress rule blocked IP range 185.220.101.0/24.',
        createdAt: '12/7/2024 11:30 AM'
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
    comments: [
      {
        id: 'c3',
        author: 'Airah Jenkno',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        content: 'Employee interview conducted. Device was encrypted at firmware level, no leak occurred.',
        createdAt: '08/7/2024 09:20 AM'
      }
    ]
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
    mitigationNotes: 'Recall message broadcasted within 60 seconds. Only 4 internal addresses were visible.',
    attachmentsCount: 2,
    comments: [
      {
        id: 'c4',
        author: 'Sarah Luan',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
        content: 'Issue resolved. Email blast tool BCC enforcement turned to immutable policy.',
        createdAt: '17/7/2024 02:45 PM'
      }
    ]
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
    mitigationNotes: 'Endpoint restricted to localhost proxy. Mock data replaced with synthetic hashes.',
    attachmentsCount: 1,
    comments: []
  },
  {
    id: 'inc-5',
    code: '1005',
    title: 'Unauthorized Privilege Escalation',
    category: 'Access Control',
    severity: 'Critical',
    status: 'Under Review',
    assignedTo: 'Airah Jenkno',
    assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    date: '24/7/2024',
    description: 'Service account used to alter IAM permissions in production cluster without an approved Jira change ticket.',
    reportedBy: 'CloudTrail Audit',
    mitigationNotes: 'Service account disabled, rolled back changes.',
    attachmentsCount: 4,
    comments: []
  },
  {
    id: 'inc-6',
    code: '1006',
    title: 'Disaster Recovery Cold Site Failure',
    category: 'System Outage',
    severity: 'High',
    status: 'Open',
    assignedTo: 'Sarah Jenkins',
    assignedAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    date: '02/8/2024',
    description: 'Quarterly failover drill showed secondary replica lag exceeded RPO of 15 minutes by 42 minutes.',
    reportedBy: 'Site Reliability Engineering',
    mitigationNotes: 'Investigating replication bandwidth choking.',
    attachmentsCount: 2,
    comments: []
  }
];

export const INITIAL_RISKS: Risk[] = [
  {
    id: 'rsk-1',
    code: 'RSK-101',
    title: 'Data Breach: Customer PII Exfiltration',
    description: 'High impact incident where malicious adversary targets primary customer relational databases via supply chain compromised dependencies.',
    category: 'Cybersecurity',
    likelihood: 4, // High
    impact: 5,     // Critical / High
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
    likelihood: 3, // Medium
    impact: 4,     // High
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
    likelihood: 2, // Low
    impact: 5,     // High
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
    likelihood: 2, // Low
    impact: 2,     // Minor
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
  },
  {
    id: 'rsk-6',
    code: 'RSK-106',
    title: 'Subprocessor Insolvency & Service Disruption',
    description: 'Critical cloud hosting partner experiencing financial distress impacting SLA availability.',
    category: 'Operational',
    likelihood: 1,
    impact: 5,
    score: 5,
    priority: 'Medium',
    status: 'Assessing',
    assignedTo: 'Sarah Jenkins',
    mitigationPlan: 'Establish multi-region and secondary cloud provider warm disaster recovery environment.',
    createdAt: '2024-04-02',
    updatedAt: '2024-05-01'
  },
  {
    id: 'rsk-7',
    code: 'RSK-107',
    title: 'Insider Threat Data Tampering',
    description: 'Disgruntled privileged administrator modifying transaction logs.',
    category: 'Operational',
    likelihood: 2,
    impact: 4,
    score: 8,
    priority: 'Medium',
    status: 'Mitigating',
    assignedTo: 'Sarah Jenkins',
    mitigationPlan: 'WORM (Write Once Read Many) compliant immutable storage for all system audit trails.',
    createdAt: '2024-04-18',
    updatedAt: '2024-05-24'
  }
];

export const INITIAL_AUDITS: Audit[] = [
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
    title: 'NIST CSF 2.0 Maturity Benchmark Review',
    framework: 'NIST CSF',
    scope: 'Identify, Protect, Detect, Respond, Recover, Govern functions',
    leadAuditor: 'Sarah Jenkins',
    status: 'In Progress',
    dueDate: '2024-08-01',
    progress: 62,
    findingsCount: 0
  },
  {
    id: 'aud-5',
    title: 'PCI-DSS v4.0 Scope Validation',
    framework: 'PCI-DSS',
    scope: 'Cardholder Data Environment (CDE) Tokenization Engine',
    leadAuditor: 'Qualified Security Assessor (QSA)',
    status: 'Overdue',
    dueDate: '2024-04-30',
    progress: 75,
    findingsCount: 4
  }
];

export const INITIAL_CONTROLS: ComplianceControl[] = [
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
  },
  {
    id: 'ctl-5',
    controlId: 'CC7.2',
    name: 'Intrusion Detection & Autonomous Threat Hunting',
    description: 'Continuous monitoring of network anomalies, unauthorized container executions, and API key anomalies.',
    framework: 'SOC 2',
    owner: 'Airah Jenkno',
    status: 'In Progress',
    complianceRate: 84,
    reviewDate: '2024-06-01',
    evidenceCount: 7
  },
  {
    id: 'ctl-6',
    controlId: 'A.9.4.2',
    name: 'Privileged Access Just-In-Time Escalation',
    description: 'Zero standing privileges. Elevating to production database requires dual approval and auto-expires after 2 hours.',
    framework: 'ISO 27001',
    owner: 'Sarah Jenkins',
    status: 'Needs Review',
    complianceRate: 72,
    reviewDate: '2024-05-25',
    evidenceCount: 3
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Sawera',
    email: 'isfatimasawera274@gmail.com',
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
  },
  {
    id: 'tm-4',
    name: 'David Vance',
    email: 'david.vance@compliancecompass.io',
    role: 'Risk Analyst',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    status: 'Active'
  }
];
