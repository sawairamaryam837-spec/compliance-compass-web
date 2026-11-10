import React from 'react';
import { KPICard } from './KPICard';
import { RiskHeatmap } from './RiskHeatmap';
import { AuditAnalyticsCharts } from './AuditAnalyticsCharts';
import { IncidentsTable } from './IncidentsTable';
import { Risk, Incident, RiskLikelihood, RiskImpact } from '../../types';

interface DashboardOverviewProps {
  kpis: {
    totalRisks: number;
    totalRisksTrend: string;
    activeIncidents: number;
    activeIncidentsTrend: string;
    auditCompletion: number;
    complianceScore: number;
  };
  risks: Risk[];
  incidents: Incident[];
  onSelectRisk: (risk: Risk) => void;
  onSelectIncident: (incident: Incident) => void;
  onOpenCreateRisk: (likelihood?: RiskLikelihood, impact?: RiskImpact) => void;
  onOpenCreateIncident: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  kpis,
  risks,
  incidents,
  onSelectRisk,
  onSelectIncident,
  onOpenCreateRisk,
  onOpenCreateIncident,
  onNavigateToTab,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* KPI Cards Row matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <KPICard
          title="Total Risks"
          value={kpis.totalRisks}
          trend={kpis.totalRisksTrend}
          trendType="positive"
          iconType="risks"
          onClick={() => onNavigateToTab('risks')}
        />
        <KPICard
          title="Active Incidents"
          value={kpis.activeIncidents}
          trend={kpis.activeIncidentsTrend}
          trendType="negative"
          iconType="incidents"
          onClick={() => onNavigateToTab('incidents')}
        />
        <KPICard
          title="Audit Completion"
          value={`${kpis.auditCompletion}%`}
          iconType="audits"
          onClick={() => onNavigateToTab('audits')}
        />
        <KPICard
          title="Overall Compliance Score"
          value={`${kpis.complianceScore}%`}
          iconType="compliance"
          onClick={() => onNavigateToTab('controls')}
        />
      </div>

      {/* Main Content Split matching screenshot:
          Left 50%: Risk Assessment Heatmap
          Right 50%: Audit Analytics (top) + Incident Complaints Management (bottom)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Risk Assessment Heatmap (approx 5 cols on lg, or 5/12) */}
        <div className="lg:col-span-5 flex flex-col">
          <RiskHeatmap
            risks={risks}
            onSelectRisk={onSelectRisk}
            onAddRiskAt={(l, i) => onOpenCreateRisk(l, i)}
          />
        </div>

        {/* Right Column: Audit Analytics & Incident Management (approx 7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col space-y-5">
          {/* Top: Audit Analytics Card */}
          <AuditAnalyticsCharts
            onOpenAuditModule={() => onNavigateToTab('audits')}
          />

          {/* Bottom: Incident Complaints Management Card */}
          <IncidentsTable
            incidents={incidents}
            onSelectIncident={onSelectIncident}
            onOpenCreateModal={onOpenCreateIncident}
          />
        </div>
      </div>
    </div>
  );
};
