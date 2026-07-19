import React, { useState } from "react";
import { Stethoscope, User, Mail, Lock, ShieldCheck, ChevronRight, Fingerprint, Award } from "lucide-react";
import { ClinicalRole, UserSession } from "../types";

interface RegisterProps {
  onRegisterSuccess: (session: UserSession) => void;
  onGoToLogin: () => void;
}

export default function Register({ onRegisterSuccess, onGoToLogin }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(ClinicalRole.DOCTOR);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [error, setError] = useState("");

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!termsChecked) {
      setError("You must agree to the HIPAA and medical data regulations.");
      return;
    }

    // Auto calculate title based on role selection
    let title = "Senior Cardiologist";
    let avatar = name.slice(0, 2).toUpperCase();
    if (role === ClinicalRole.ADMIN) {
      title = "Super Admin";
    } else if (role === ClinicalRole.STAFF) {
      title = "Clinic Coordinator";
    }

    onRegisterSuccess({
      name,
      role,
      email,
      title,
      avatar: avatar || "HP"
    });
  };

  return (
    <div id="register-root" className="min-h-screen bg-slate-50 flex select-none">
      {/* Left Column: High Fidelity Clinical Graphics Panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        {/* Background Graphic Patterns */}
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-35 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200')` }} />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-900/40 pointer-events-none" />

        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Floating Content Card */}
        <div className="relative max-w-lg w-full text-slate-300 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs font-semibold text-indigo-300 font-mono">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
              ECOSYSTEM REGISTRATION
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight leading-tight">
              Enterprise Clinical Management Ecosystem
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Unlock decentralized clinical networks, instant prescription verification, and streamlined EHR modules across clinical facilities.
            </p>
          </div>

          {/* Stats Metrics Panel */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-slate-950/40 border border-slate-800 rounded-2xl backdrop-blur-md">
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">HIPAA Certified</span>
              <div className="text-2xl font-bold font-display text-white mt-1">100% Secure</div>
              <span className="text-xs text-slate-400">Encrypted Transactions</span>
            </div>
            <div className="p-5 bg-slate-950/40 border border-slate-800 rounded-2xl backdrop-blur-md">
              <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">Average Response</span>
              <div className="text-2xl font-bold font-display text-white mt-1">1.2s</div>
              <span className="text-xs text-slate-400">Sub-second Sync Speed</span>
            </div>
          </div>

          {/* Trust Seal */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs text-slate-400">
              Access is gated strictly for registered medical professionals. All activities are audited in the master system log.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-20 bg-white overflow-y-auto py-12">
        <div className="max-w-md w-full mx-auto">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-400 flex items-center justify-center shadow-md">
              <Stethoscope className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-slate-900 leading-none">MediFlow</h2>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600">Clinical ERP</span>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 tracking-tight">Create Clinical Account</h1>
            <p className="text-sm text-slate-500 mt-1">Submit your credentials to request instant access authorization.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {error && (
              <div id="register-error" className="p-3 bg-rose-50 border border-rose-100 text-xs text-rose-600 rounded-lg font-medium animate-shake">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Full Practitioner Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="register-name"
                  type="text"
                  placeholder="e.g. Dr. Arthur Pendelton"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Professional Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="register-email"
                    type="email"
                    placeholder="name@clinic.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Clinical Role</label>
                <select
                  id="register-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as ClinicalRole)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-800"
                >
                  <option value={ClinicalRole.DOCTOR}>Doctor (Prescription, Review)</option>
                  <option value={ClinicalRole.STAFF}>Clinic Staff (Registry, Billing)</option>
                  <option value={ClinicalRole.ADMIN}>Administrator (Inventory, Audit)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="register-password"
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="register-confirm-password"
                    type="password"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="py-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  id="register-terms"
                  type="checkbox"
                  checked={termsChecked}
                  onChange={(e) => setTermsChecked(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 bg-slate-50 mt-0.5"
                />
                <span className="text-xs text-slate-500 leading-normal">
                  I agree to the electronic healthcare credential auditing policy and consent to periodic workstation HIPAA logs.
                </span>
              </label>
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm py-2.5 px-4 rounded-xl shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Complete Account Registration</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Alternative Signup Modalities */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 font-display">ENTERPRISE FEDERATED LOGIN</div>
            <div className="grid grid-cols-2 gap-3">
              <button
                id="sso-hospital"
                type="button"
                onClick={() => {
                  setName("Dr. Arthur Pendelton");
                  setEmail("a.pendelton@st-mary-hospital.org");
                  setRole(ClinicalRole.DOCTOR);
                  setTermsChecked(true);
                  setError("");
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/20 rounded-xl text-xs text-slate-700 transition-all cursor-pointer font-medium"
              >
                <Fingerprint className="w-4 h-4 text-indigo-600" />
                <span>Hospital SSO</span>
              </button>
              <button
                id="sso-medical-id"
                type="button"
                onClick={() => {
                  setName("Administrator Sarah Jenkins");
                  setEmail("jenkins.s@mediflow.com");
                  setRole(ClinicalRole.ADMIN);
                  setTermsChecked(true);
                  setError("");
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/20 rounded-xl text-xs text-slate-700 transition-all cursor-pointer font-medium"
              >
                <Award className="w-4 h-4 text-indigo-600" />
                <span>NPI / Medical ID</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Already have authorized credentials?{" "}
              <button onClick={onGoToLogin} className="text-indigo-600 hover:underline font-semibold bg-transparent border-none p-0 cursor-pointer">
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
