import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  Bell,
  CheckCircle2,
  Building2,
  LogOut,
  User,
  Sliders,
  ShieldAlert,
  Menu
} from 'lucide-react';
import { UserProfile, NotificationItem } from '../../types';

interface TopNavbarProps {
  pageTitle?: string;
  subTitle?: string;
  user: UserProfile;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onOpenAuth: () => void;
  onOpenOnboarding: () => void;
  onSelectTab: (tab: any) => void;
  onToggleMobileSidebar: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  pageTitle = 'Compliance Overview',
  subTitle = 'May 2024',
  user,
  notifications,
  onMarkNotificationRead,
  onOpenAuth,
  onOpenOnboarding,
  onSelectTab,
  onToggleMobileSidebar,
}) => {
  const [startDate, setStartDate] = useState('Jan 2024');
  const [endDate, setEndDate] = useState('May 2024');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 md:h-20 w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#0b0f19] border-b border-slate-800/60 sticky top-0 z-20">
      {/* Left section: Hamburger on mobile + Title */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-[#121827] hover:bg-[#1a233a] border border-slate-700/60 text-slate-300 hover:text-white transition"
          title="Open Navigation Menu"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2 truncate">
          <h1 className="text-base sm:text-lg md:text-2xl font-bold text-white tracking-tight truncate">
            {pageTitle}
          </h1>
          {subTitle && (
            <>
              <span className="hidden sm:inline text-slate-500 font-light text-base md:text-xl">|</span>
              <span className="hidden sm:inline text-slate-300 font-medium text-sm md:text-lg truncate">
                {subTitle}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        {/* Date Filter Range Pickers (Desktop & Tablet) */}
        <div className="hidden md:flex items-center gap-2">
          {/* Start Date Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#121827] hover:bg-[#161f33] border border-slate-700/60 text-slate-300 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition">
            <Calendar size={13} className="text-purple-400" />
            <span>{startDate}</span>
            <ChevronDown size={13} className="text-slate-400" />
          </div>

          {/* End Date Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#121827] hover:bg-[#161f33] border border-slate-700/60 text-slate-300 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition">
            <Calendar size={13} className="text-purple-400" />
            <span>{endDate}</span>
            <ChevronDown size={13} className="text-slate-400" />
          </div>
        </div>

        {/* Mobile Date Tag */}
        <div className="flex md:hidden items-center gap-1 bg-[#121827] border border-slate-700/60 text-purple-300 px-2 py-1 rounded-lg text-[11px] font-semibold">
          <Calendar size={12} className="text-purple-400" />
          <span>May '24</span>
        </div>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-xl bg-[#121827] hover:bg-[#1a233a] border border-slate-700/60 text-slate-300 hover:text-white transition"
            title="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 sm:w-80 md:w-96 bg-[#111726] border border-slate-700/80 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <Bell size={15} className="text-purple-400" /> Notifications
                </span>
                <span className="text-[10px] text-purple-400 font-semibold bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/30">
                  {unreadCount} Unread
                </span>
              </div>
              <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto mt-2">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onMarkNotificationRead(item.id)}
                    className={`py-2.5 px-2 rounded-lg cursor-pointer transition flex items-start gap-2.5 hover:bg-slate-800/40 ${
                      !item.read ? 'bg-purple-950/20' : ''
                    }`}
                  >
                    <div className="mt-0.5">
                      {item.type === 'alert' && <ShieldAlert size={15} className="text-rose-400" />}
                      {item.type === 'audit' && <CheckCircle2 size={15} className="text-purple-400" />}
                      {item.type === 'task' && <Sliders size={15} className="text-amber-400" />}
                      {item.type === 'success' && <CheckCircle2 size={15} className="text-emerald-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{item.message}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 sm:gap-2.5 p-1 sm:p-1.5 sm:pl-2 sm:pr-3 rounded-full bg-[#111726] hover:bg-[#161f33] border border-slate-700/60 transition group cursor-pointer"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-purple-500/50"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-400 leading-tight">
                {user.title}
              </span>
            </div>
            <ChevronDown size={13} className="text-slate-400 group-hover:text-white transition" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-[#111726] border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-bold text-white">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-purple-950/60 text-purple-300 border border-purple-500/30 rounded-full font-semibold">
                  {user.role} (Primary Admin)
                </span>
              </div>
              <div className="pt-1 text-xs text-slate-300">
                <button
                  onClick={() => {
                    onSelectTab('settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800/60 hover:text-white transition text-left"
                >
                  <User size={14} className="text-purple-400" />
                  <span>Profile & Security</span>
                </button>
                <button
                  onClick={() => {
                    onOpenOnboarding();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800/60 hover:text-white transition text-left"
                >
                  <Building2 size={14} className="text-purple-400" />
                  <span>Onboarding Wizard</span>
                </button>
                <button
                  onClick={() => {
                    onOpenAuth();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-950/30 text-rose-300 hover:text-rose-200 transition text-left mt-1 border-t border-slate-800/80 pt-2"
                >
                  <LogOut size={14} />
                  <span>Switch Account / Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
