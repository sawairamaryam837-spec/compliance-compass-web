export type RiskLikelihood = 1 | 2 | 3 | 4 | 5; // 1: Very Low, 2: Low, 3: Medium, 4: High, 5: Very High
export type RiskImpact = 1 | 2 | 3 | 4 | 5; // 1: Negligible, 2: Minor, 3: Moderate, 4: Major, 5: Critical
export type RiskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type RiskStatus = 'Identified' | 'Assessing' | 'Mitigating' | 'Monitored' | 'Closed';
export type RiskCategory = 'Cybersecurity' | 'Data Privacy' | 'Regulatory' | 'Operational' | 'Financial' | 'Third-Party';

export interface Risk {
  id: string;
  code: string; // e.g. "RSK-104"
  title: string;
  description: string;
  category: RiskCategory;
  likelihood: RiskLikelihood;
  impact: RiskImpact;
  score: number; // likelihood * impact
  priority: RiskPriority;
  status: RiskStatus;
  assignedTo: string;
  mitigationPlan?: string;
  createdAt: string;
  updatedAt: string;
}

export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type IncidentStatus = 'Open' | 'Under Review' | 'Assigned' | 'Resolved' | 'Closed';
export type IncidentCategory = 'Data Privacy' | 'Policy Violation' | 'Security Breach' | 'System Outage' | 'Access Control' | 'Compliance Failure';

export interface IncidentComment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  code: string; // e.g. "1001"
  title: string;
  description?: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  assignedTo: string;
  assignedAvatar?: string;
  reportedBy?: string;
  date: string; // e.g. "12/7/2024"
  comments?: IncidentComment[];
  mitigationNotes?: string;
  attachmentsCount?: number;
}

export type AuditStatus = 'Completed' | 'Pending' | 'Overdue' | 'In Progress';

export interface Audit {
  id: string;
  title: string;
  framework: string;
  scope: string;
  leadAuditor: string;
  status: AuditStatus;
  dueDate: string;
  progress: number; // 0-100%
  findingsCount: number;
}

export type ControlFramework = 'ISO 27001' | 'SOC 2' | 'GDPR' | 'NIST CSF' | 'HIPAA';
export type ControlStatus = 'Implemented' | 'In Progress' | 'Needs Review' | 'Failed';

export interface ComplianceControl {
  id: string;
  controlId: string; // e.g. "A.12.1.2" or "CC6.1"
  name: string;
  description: string;
  framework: ControlFramework;
  owner: string;
  status: ControlStatus;
  complianceRate: number; // 0-100
  reviewDate: string;
  evidenceCount: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Compliance Officer' | 'Lead Auditor' | 'Risk Analyst';
  avatar: string;
  status: 'Active' | 'Invited';
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
  size: string;
  complianceFrameworks: ControlFramework[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  title: string;
  avatar: string;
  organizationId: string;
  role: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'audit' | 'task' | 'success';
  read: boolean;
}
