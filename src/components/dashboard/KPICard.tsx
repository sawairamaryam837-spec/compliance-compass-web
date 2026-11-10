import React from 'react';
import {
  BarChart2,
  Zap,
  CheckCircle,
  ShieldCheck,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  iconType: 'risks' | 'incidents' | 'audits' | 'compliance';
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  trend,
  trendType = 'positive',
  iconType,
  onClick,
}) => {
  const renderIcon = () => {
    switch (iconType) {
      case 'risks':
        return <BarChart2 className="w-5 h-5 text-purple-400" />;
      case 'incidents':
        return <Zap className="w-5 h-5 text-purple-400" />;
      case 'audits':
        return <CheckCircle className="w-5 h-5 text-purple-400" />;
      case 'compliance':
        return <ShieldCheck className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className="saas-card rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_8px_25px_-5px_rgba(168,85,247,0.15)] group cursor-pointer"
    >
      {/* Top right icon badge matching screenshot */}
      <div className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-purple-950/70 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)] group-hover:scale-105 transition-transform">
        {renderIcon()}
      </div>

      <div className="flex flex-col pr-8">
        <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">
          {title}
        </span>

        <div className="flex items-baseline gap-2.5 sm:gap-3 mt-2 sm:mt-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {value}
          </span>

          {trend && (
            <div className="flex items-center gap-1 text-xs font-bold">
              {trend.startsWith('+') ? (
                <span className="flex items-center text-emerald-400">
                  <TrendingUp size={13} className="mr-0.5 inline" />
                  {trend}
                </span>
              ) : trend.startsWith('-') ? (
                <span className="flex items-center text-teal-400">
                  <TrendingDown size={13} className="mr-0.5 inline" />
                  {trend}
                </span>
              ) : (
                <span className="text-slate-400">{trend}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
