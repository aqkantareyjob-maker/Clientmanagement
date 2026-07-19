import React from "react";
import { 
  Stethoscope, 
  Users, 
  Settings, 
  ShieldAlert, 
  FileSpreadsheet, 
  FlaskConical, 
  LogOut,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { ClinicalRole, UserSession } from "../types";

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  currentUser: UserSession | null;
  onLogout: () => void;
  onSwitchRole: (role: ClinicalRole) => void;
}

export default function Sidebar({ 
  currentView, 
  setView, 
  currentUser, 
  onLogout,
  onSwitchRole
}: SidebarProps) {
  if (!currentUser) return null;

  const getRoleBadgeColor = (role: ClinicalRole) => {
    switch (role) {
      case ClinicalRole.ADMIN: return "bg-rose-100 text-rose-800 border-rose-200";
      case ClinicalRole.DOCTOR: return "bg-teal-100 text-teal-800 border-teal-200";
      case ClinicalRole.STAFF: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const navItems = [
    { id: "Doctor", label: "Doctor Queue", icon: Stethoscope, roleRequired: ClinicalRole.DOCTOR },
    { id: "Consultation", label: "Consultation", icon: FileSpreadsheet, roleRequired: ClinicalRole.DOCTOR },
    { id: "PatientProfile", label: "Patient Profile", icon: Users, roleRequired: ClinicalRole.DOCTOR },
    { id: "Staff", label: "Staff Module", icon: Users, roleRequired: ClinicalRole.STAFF },
    { id: "Admin", label: "Admin Module", icon: ShieldAlert, roleRequired: ClinicalRole.ADMIN },
  ];

  return (
    <div id="sidebar-container" className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center shadow-lg shadow-blue-500/10">
          <Stethoscope className="w-5.5 h-5.5 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg tracking-tight leading-none text-white">MediFlow</h1>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Clinical ERP</span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5">
        <div className="text-[10px] font-bold text-slate-500 uppercase px-3 mb-2 tracking-widest font-display">
          CLINICAL VIEWS
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              id={`nav-btn-${item.id}`}
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group text-left ${
                isActive 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/10 font-semibold" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`w-4.5 h-4.5 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-100"}`} />
              <span className="flex-1">{item.label}</span>
              {item.roleRequired && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                  isActive 
                    ? "bg-blue-700/50 text-blue-200 border-blue-500/30" 
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}>
                  {item.roleRequired}
                </span>
              )}
            </button>
          );
        })}

        {/* Demo Switcher Utility */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="text-[10px] font-bold text-slate-500 uppercase px-3 mb-3 tracking-widest font-display flex items-center justify-between">
            <span>SIMULATE ROLES</span>
            <RefreshCw className="w-3 h-3 text-slate-500" />
          </div>
          <div className="space-y-1">
            <button
              id="switch-role-doctor"
              onClick={() => {
                onSwitchRole(ClinicalRole.DOCTOR);
                setView("Doctor");
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors text-left ${
                currentUser.role === ClinicalRole.DOCTOR ? "bg-teal-950/40 text-teal-300 border border-teal-900/40" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-300"
              }`}
            >
              <span>Doctor Mode (Dr. Vance)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            </button>
            <button
              id="switch-role-staff"
              onClick={() => {
                onSwitchRole(ClinicalRole.STAFF);
                setView("Staff");
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors text-left ${
                currentUser.role === ClinicalRole.STAFF ? "bg-blue-950/40 text-blue-300 border border-blue-900/40" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-300"
              }`}
            >
              <span>Staff Mode (John Doe)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            </button>
            <button
              id="switch-role-admin"
              onClick={() => {
                onSwitchRole(ClinicalRole.ADMIN);
                setView("Admin");
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors text-left ${
                currentUser.role === ClinicalRole.ADMIN ? "bg-rose-950/40 text-rose-300 border border-rose-900/40" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-300"
              }`}
            >
              <span>Admin Mode (Dr. Chen)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            </button>
          </div>
        </div>
      </div>

      {/* User Session Profile Footing */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-200 border border-slate-700 font-display font-semibold flex items-center justify-center shadow-inner relative">
            {currentUser.avatar}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900"></span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate leading-tight">{currentUser.name}</p>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">{currentUser.title}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${getRoleBadgeColor(currentUser.role)}`}>
            {currentUser.role}
          </div>
          <button 
            id="sidebar-logout-btn"
            onClick={onLogout}
            className="ml-auto text-slate-400 hover:text-rose-400 p-1.5 rounded-md hover:bg-slate-800/50 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
