import React from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  AlertTriangle,
  BarChart3,
  FolderLock,
  FileText,
  Settings,
  Compass,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'risks'
  | 'incidents'
  | 'audits'
  | 'controls'
  | 'reports'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'risks' as NavTab,
      label: 'Risk Assessments',
      icon: ShieldCheck,
    },
    {
      id: 'incidents' as NavTab,
      label: 'Incident Management',
      icon: AlertTriangle,
    },
    {
      id: 'audits' as NavTab,
      label: 'Audit Analytics',
      icon: BarChart3,
    },
    {
      id: 'controls' as NavTab,
      label: 'Controls',
      icon: FolderLock,
    },
    {
      id: 'reports' as NavTab,
      label: 'Reports',
      icon: FileText,
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings',
      icon: Settings,
    },
  ];

  const handleItemClick = (id: NavTab) => {
    onSelectTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Main Sidebar (Fixed on Desktop, Slide-over on Mobile) */}
      <aside
        className={`fixed top-0 left-0 h-screen z-50 lg:z-30 transition-transform duration-300 ease-in-out flex flex-col border-r border-slate-800/80 bg-[#0a0e17] select-none ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className="h-16 md:h-20 flex items-center px-4 md:px-5 border-b border-slate-800/60 justify-between">
          <div 
            onClick={() => handleItemClick('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Compass Icon Badge matching screenshot */}
            <div className="relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-purple-900/60 via-purple-700/80 to-fuchsia-500/90 p-[2px] shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <div className="w-full h-full bg-[#0b0f19] rounded-full flex items-center justify-center">
                <Compass className="w-5 h-5 md:w-6 md:h-6 text-purple-400 group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            
            {(!collapsed || mobileOpen) && (
              <div className="flex flex-col">
                <span className="text-white font-bold text-base md:text-lg tracking-tight leading-none">
                  Compliance
                </span>
                <span className="text-purple-300 font-semibold text-xs md:text-sm tracking-wide mt-0.5">
                  Compass
                </span>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="flex lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/60 transition"
            title="Close Menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 md:py-6 px-3 space-y-1.5 md:space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 md:py-3 rounded-xl font-medium text-xs md:text-sm transition-all duration-200 relative group text-left ${
                  isActive
                    ? 'bg-purple-950/40 text-white border border-purple-500/80 shadow-[0_0_16px_rgba(168,85,247,0.35)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-colors ${
                    isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-purple-300'
                  }`}
                />

                {(!collapsed || mobileOpen) && (
                  <span className="truncate flex-1 tracking-normal">
                    {item.label}
                  </span>
                )}

                {/* Tooltip for desktop collapsed state */}
                {collapsed && !mobileOpen && (
                  <div className="hidden lg:block absolute left-full ml-3 px-2.5 py-1 bg-slate-900 border border-purple-500/30 text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Enterprise Pro Badge & Quick Status */}
        {(!collapsed || mobileOpen) && (
          <div className="p-3.5 mx-3 mb-4 rounded-xl bg-gradient-to-br from-purple-950/30 to-slate-900/60 border border-purple-500/20">
            <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold mb-1">
              <Sparkles size={14} className="text-purple-400" />
              <span>SOC 2 & ISO 27001 Ready</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Continuous compliance engine active. 92% readiness score.
            </p>
          </div>
        )}
      </aside>
    </>
  );
};
