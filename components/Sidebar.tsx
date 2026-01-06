
import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  ClipboardList, 
  CreditCard, 
  Settings as SettingsIcon, 
  LogOut,
  Stethoscope,
  Sparkles,
  Activity,
  History,
  ChevronRight,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { AppView, UserRole } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  role: UserRole;
  onLogout: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  setView, 
  role, 
  onLogout, 
  isCollapsed, 
  setIsCollapsed 
}) => {
  const allNavItems = [
    { id: AppView.DASHBOARD, label: 'Overview', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT] },
    { id: AppView.MY_HEALTH, label: 'Vital Hub', icon: Activity, roles: [UserRole.PATIENT] },
    { id: AppView.APPOINTMENTS, label: role === UserRole.PATIENT ? 'My Visits' : 'Schedule', icon: Calendar, roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT] },
    { id: AppView.PATIENTS, label: 'Patient Hub', icon: Users, roles: [UserRole.ADMIN, UserRole.DOCTOR] },
    { id: AppView.RECORDS, label: role === UserRole.PATIENT ? 'Clinical Reports' : 'Medical Archive', icon: ClipboardList, roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT] },
    { id: AppView.BILLING, label: 'Financials', icon: CreditCard, roles: [UserRole.ADMIN] },
    { id: AppView.AUDIT_LOGS, label: 'Audit Trail', icon: History, roles: [UserRole.ADMIN] },
    { id: AppView.ASSISTANT, label: 'MediNest AI', icon: Sparkles, highlight: true, roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT] },
  ];

  const filteredItems = allNavItems.filter(item => item.roles.includes(role));

  return (
    <aside 
      className={`bg-slate-950 flex flex-col h-full shrink-0 border-r border-slate-800 z-50 overflow-hidden transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-[280px]'
      }`}
    >
      <div className={`p-6 transition-all duration-300 ${isCollapsed ? 'px-4' : 'px-8'}`}>
        <div className="flex items-center justify-between mb-2">
          <div 
            className="flex items-center gap-3 group cursor-pointer overflow-hidden" 
            onClick={() => setView(AppView.DASHBOARD)}
          >
            <div className="bg-indigo-600 p-2.5 rounded-[1.25rem] shadow-xl shadow-indigo-600/30 transition-all duration-500 group-hover:rotate-12 shrink-0">
              <Stethoscope className="text-white" size={24} strokeWidth={2.5} />
            </div>
            {!isCollapsed && (
              <div className="whitespace-nowrap animate-in fade-in duration-500">
                <h1 className="text-xl font-black text-white tracking-tight leading-none">Medi<span className="text-indigo-400">Nest</span></h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">v4.0 Enterprise</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button 
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            >
              <ChevronLeft size={20} />
            </button>
          )}
        </div>
        {isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(false)}
            className="w-full mt-4 flex justify-center p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <Menu size={24} />
          </button>
        )}
      </div>

      <div className={`flex-1 py-8 space-y-1 overflow-y-auto custom-scrollbar ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {!isCollapsed && (
          <p className="px-4 mb-4 text-[10px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">General Access</p>
        )}
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 rounded-2xl text-sm font-bold transition-all group relative ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/40' 
                  : item.highlight 
                    ? 'text-indigo-400 bg-indigo-600/5 hover:bg-indigo-600/10'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
              } ${isCollapsed ? 'justify-center p-3.5' : 'px-4 py-3.5'}`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-inherit opacity-70 group-hover:opacity-100 transition-opacity shrink-0'} />
              {!isCollapsed && <span className="flex-1 text-left tracking-tight whitespace-nowrap">{item.label}</span>}
              {!isCollapsed && isActive && <ChevronRight size={14} className="opacity-50" />}
              {item.highlight && !isActive && (
                <span className={`absolute flex h-2 w-2 ${isCollapsed ? 'top-2 right-2' : 'right-4'}`}>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className={`mt-auto transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-6'}`}>
        <div className="space-y-2">
          <button 
            onClick={() => setView(AppView.SETTINGS)}
            title={isCollapsed ? "Preferences" : undefined}
            className={`w-full flex items-center gap-3 rounded-2xl text-sm font-bold transition-all ${
              currentView === AppView.SETTINGS 
                ? 'bg-white/10 text-white' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            } ${isCollapsed ? 'justify-center p-3.5' : 'px-4 py-3'}`}
          >
            <SettingsIcon size={18} className="shrink-0" />
            {!isCollapsed && <span>Preferences</span>}
          </button>
          <button 
            onClick={onLogout}
            title={isCollapsed ? "Sign Out" : undefined}
            className={`w-full flex items-center gap-3 rounded-2xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all group active:scale-[0.98] ${isCollapsed ? 'justify-center p-3.5' : 'px-4 py-3'}`}
          >
            <LogOut size={18} className={`shrink-0 ${!isCollapsed ? 'group-hover:-translate-x-1 transition-transform' : ''}`} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
