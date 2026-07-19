import React, { useState } from "react";
import { 
  Search, 
  Bell, 
  Settings, 
  HelpCircle, 
  ArrowLeft,
  Activity,
  CheckCircle2
} from "lucide-react";
import { Patient } from "../types";

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
  onSearchPatient: (query: string) => void;
  patients: Patient[];
  onBack?: () => void;
}

export default function Header({ 
  currentView, 
  setView, 
  onSearchPatient, 
  patients,
  onBack 
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Formulate view titles
  const getViewTitle = () => {
    switch (currentView) {
      case "Doctor": return "Doctor Queue & Dashboard";
      case "Consultation": return "Patient Consultation & Prescription";
      case "PatientProfile": return "Patient Profile & Clinical History";
      case "Staff": return "Appointment Registry";
      case "Admin": return "Administrative Management Ecosystem";
      default: return "MediFlow ERP";
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchPatient(searchQuery.trim());
      setShowSearchResults(false);
    }
  };

  const filteredSearchSuggestions = searchQuery.trim() 
    ? patients.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectSuggestion = (patientId: string) => {
    onSearchPatient(patientId);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  return (
    <header id="clinical-header" className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 relative z-30 select-none">
      {/* Back Button & Title */}
      <div className="flex items-center gap-4">
        {onBack && (
          <button 
            id="header-back-btn"
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          <h2 className="font-display font-semibold text-lg text-slate-900 tracking-tight leading-none">
            {getViewTitle()}
          </h2>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">MediFlow Node Connected</span>
          </div>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md mx-8 relative">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="header-patient-search"
              type="text"
              placeholder="Search patient names, IDs (e.g. Jenkins, PT-8829-24)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full bg-slate-50 border border-slate-200 text-sm pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
            />
          </div>
        </form>

        {/* Suggestion Dropdown */}
        {showSearchResults && filteredSearchSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
            <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-400 tracking-wider border-b border-slate-100">
              MATCHING ACTIVE RECORDS
            </div>
            {filteredSearchSuggestions.map((p) => (
              <button
                id={`search-suggest-${p.id}`}
                key={p.id}
                onClick={() => handleSelectSuggestion(p.id)}
                className="w-full text-left px-4 py-2.5 hover:bg-blue-50/70 border-b border-slate-100 last:border-0 flex items-center justify-between text-sm transition-colors"
              >
                <div>
                  <span className="font-medium text-slate-800">{p.name}</span>
                  <span className="text-xs text-slate-400 font-mono ml-2">[{p.id}]</span>
                </div>
                <div className="text-xs text-slate-500">
                  {p.age} Yrs • {p.gender}
                </div>
              </button>
            ))}
          </div>
        )}
        {showSearchResults && searchQuery && filteredSearchSuggestions.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-4 text-center text-slate-500 text-xs z-50">
            No patient records matching "{searchQuery}"
          </div>
        )}
        {showSearchResults && (
          <div 
            className="fixed inset-0 z-40 cursor-default" 
            onClick={() => setShowSearchResults(false)}
          />
        )}
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-3">
        {/* Quick Help */}
        <button 
          id="header-help-btn"
          className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors relative group"
          title="Clinical Help & Guides"
        >
          <HelpCircle className="w-5 h-5" />
          <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Access EHR documentation, drug dosage catalogs, and support hotlines.
          </div>
        </button>

        {/* System Logs */}
        <button 
          id="header-status-btn"
          className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors relative group"
          title="System Core Status"
        >
          <Activity className="w-5 h-5" />
          <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            All nodes operational. API ping 42ms. DB cluster stable.
          </div>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button 
            id="header-notif-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors relative"
            title="Notification Center"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <>
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-3 bg-slate-50 font-semibold text-xs text-slate-600 border-b border-slate-100 flex justify-between items-center">
                  <span>CLINICAL NOTIFICATIONS</span>
                  <span className="text-[10px] text-blue-600 font-mono bg-blue-50 px-1.5 py-0.5 rounded">NEW</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  <div className="p-3 hover:bg-slate-50/50 transition-colors text-xs">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        Uncollected Lab Result
                      </span>
                      <span className="text-[10px] text-slate-400">15m ago</span>
                    </div>
                    <p className="text-slate-500">Thyroid report for Eleanor Fitzwilliam (#PT-1102-39) is completed and ready for clinical review.</p>
                  </div>
                  <div className="p-3 hover:bg-slate-50/50 transition-colors text-xs">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Patient Checked-in
                      </span>
                      <span className="text-[10px] text-slate-400">1h ago</span>
                    </div>
                    <p className="text-slate-500">Alexander Wright (#PT-4412-10) was registered by reception desk and is waiting.</p>
                  </div>
                  <div className="p-3 hover:bg-slate-50/50 transition-colors text-xs">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-slate-800">Low Stock Alert</span>
                      <span className="text-[10px] text-slate-400">4h ago</span>
                    </div>
                    <p className="text-slate-500">Amlodipine 5mg has fallen below safety stock levels (18 units remaining).</p>
                  </div>
                </div>
              </div>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
