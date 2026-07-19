import React, { useState } from "react";
import { Stethoscope, Lock, Mail, ChevronRight, CheckCircle2 } from "lucide-react";
import { ClinicalRole, UserSession } from "../types";

interface SignInProps {
  onLoginSuccess: (session: UserSession) => void;
  onGoToRegister: () => void;
}

export default function SignIn({ onLoginSuccess, onGoToRegister }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Custom login logic
    if (email.includes("vance")) {
      handleQuickLogin(ClinicalRole.DOCTOR);
    } else if (email.includes("chen")) {
      handleQuickLogin(ClinicalRole.ADMIN);
    } else if (email.includes("doe")) {
      handleQuickLogin(ClinicalRole.STAFF);
    } else {
      // Default fallback
      onLoginSuccess({
        name: "Dr. Julian Vance",
        role: ClinicalRole.DOCTOR,
        email: email,
        title: "Senior Cardiologist",
        avatar: "JV"
      });
    }
  };

  const handleQuickLogin = (role: ClinicalRole) => {
    switch (role) {
      case ClinicalRole.DOCTOR:
        onLoginSuccess({
          name: "Dr. Julian Vance",
          role: ClinicalRole.DOCTOR,
          email: "j.vance@mediflow.com",
          title: "Senior Cardiologist",
          avatar: "JV"
        });
        break;
      case ClinicalRole.ADMIN:
        onLoginSuccess({
          name: "Dr. Sarah Chen",
          role: ClinicalRole.ADMIN,
          email: "s.chen@mediflow.com",
          title: "Super Admin",
          avatar: "SC"
        });
        break;
      case ClinicalRole.STAFF:
        onLoginSuccess({
          name: "John Doe",
          role: ClinicalRole.STAFF,
          email: "john.doe@mediflow.com",
          title: "Front Desk & Reception",
          avatar: "JD"
        });
        break;
    }
  };

  return (
    <div id="signin-root" className="min-h-screen bg-slate-50 flex select-none">
      {/* Left Column: Sign-in Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-20 bg-white">
        <div className="max-w-md w-full mx-auto">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center shadow-md">
              <Stethoscope className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-slate-900 leading-none">MediFlow</h2>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600">Clinical ERP</span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 tracking-tight">Sign In</h1>
            <p className="text-sm text-slate-500 mt-2">Access your electronic medical records and management portal.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div id="signin-error" className="p-3 bg-rose-50 border border-rose-100 text-xs text-rose-600 rounded-lg font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Professional Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="signin-email"
                  type="email"
                  placeholder="name@mediflow.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-sm rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Security Password</label>
                <a href="#forgot" className="text-xs text-blue-600 hover:underline">Forgot Password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-sm rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  id="signin-remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 bg-slate-50"
                />
                <span className="text-xs text-slate-600">Remember this workstation</span>
              </label>
            </div>

            <button
              id="signin-submit-btn"
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm py-3 px-4 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Login to Portal</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Quick Login Section (Critical for demonstration and user review) */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 font-display">QUICK DEMO LOGINS</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="quick-login-doctor"
                onClick={() => handleQuickLogin(ClinicalRole.DOCTOR)}
                className="p-2 border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 rounded-xl text-center transition-all cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-teal-700">Doctor Mode</div>
                <div className="text-[9px] text-slate-400 font-mono mt-0.5">Dr. Vance</div>
              </button>
              <button
                id="quick-login-staff"
                onClick={() => handleQuickLogin(ClinicalRole.STAFF)}
                className="p-2 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 rounded-xl text-center transition-all cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-blue-700">Staff Mode</div>
                <div className="text-[9px] text-slate-400 font-mono mt-0.5">Reception</div>
              </button>
              <button
                id="quick-login-admin"
                onClick={() => handleQuickLogin(ClinicalRole.ADMIN)}
                className="p-2 border border-slate-200 hover:border-rose-500 hover:bg-rose-50/50 rounded-xl text-center transition-all cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-rose-700">Admin Mode</div>
                <div className="text-[9px] text-slate-400 font-mono mt-0.5">Dr. Chen</div>
              </button>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs text-slate-500">
              New practitioner?{" "}
              <button onClick={onGoToRegister} className="text-blue-600 hover:underline font-semibold bg-transparent border-none p-0 cursor-pointer">
                Request Account Registration
              </button>
            </p>
            <div className="mt-6 flex justify-center gap-4 text-[10px] text-slate-400">
              <a href="#help" className="hover:underline">Contact System Admin</a>
              <span>•</span>
              <a href="#security" className="hover:underline">HIPAA / GDPR Compliance</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: High Fidelity Clinical Graphics Panel */}
      <div className="hidden lg:flex lg:w-[55%] bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        {/* Background Graphic Patterns */}
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1579154767015-376b3759da55?auto=format&fit=crop&q=80&w=1200')` }} />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-900/40 pointer-events-none" />

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

        {/* Floating Content Card */}
        <div className="relative max-w-lg w-full text-slate-300 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-xs font-semibold text-blue-300 font-mono">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></span>
              SECURE WORKSTATION NODE
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight leading-tight">
              Advanced Clinical Diagnostics & Patient Lifecycle Management
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              MediFlow is a high-performance clinical ERP built with modern standards for real-time patient charts, prescription security, and sub-second diagnostic reviews.
            </p>
          </div>

          {/* Stats Metrics Panel */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-slate-950/40 border border-slate-800 rounded-2xl backdrop-blur-md">
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Active System Health</span>
              <div className="text-2xl font-bold font-display text-white mt-1">99.99%</div>
              <span className="text-xs text-slate-400">HIPAA Compliant Uptime</span>
            </div>
            <div className="p-5 bg-slate-950/40 border border-slate-800 rounded-2xl backdrop-blur-md">
              <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">Demographics Served</span>
              <div className="text-2xl font-bold font-display text-white mt-1">1.2M+</div>
              <span className="text-xs text-slate-400">Practitioner Transactions</span>
            </div>
          </div>

          {/* Trust Seal */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs text-slate-400">
              This node utilizes military-grade AES-256 local database encryption and secure multi-factor authentication protocols.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
