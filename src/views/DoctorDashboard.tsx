import React, { useState } from "react";
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  Plus, 
  Activity,
  UserPlus,
  Flame,
  Award
} from "lucide-react";
import { Appointment } from "../types";

interface DoctorDashboardProps {
  appointments: Appointment[];
  onStartConsultation: (patientId: string, appointmentId: string) => void;
  onPrioritizeAppointment: (appointmentId: string) => void;
  onAddQuickAppointment: () => void;
}

export default function DoctorDashboard({
  appointments,
  onStartConsultation,
  onPrioritizeAppointment,
  onAddQuickAppointment
}: DoctorDashboardProps) {
  const [showQuickNoteModal, setShowQuickNoteModal] = useState(false);
  const [quickNotes, setQuickNotes] = useState<string[]>([
    "Review Sarah Jenkins' BP trend lines at 2 PM",
    "Calibrate pediatric scale in Room 4",
    "Confirm prescription refill clearance for Alexander Thompson"
  ]);
  const [newNoteText, setNewNoteText] = useState("");

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteText.trim()) {
      setQuickNotes([...quickNotes, newNoteText.trim()]);
      setNewNoteText("");
    }
  };

  const handleRemoveNote = (index: number) => {
    setQuickNotes(quickNotes.filter((_, i) => i !== index));
  };

  // Compute metrics dynamically
  const totalInQueue = appointments.length;
  const inConsultation = appointments.filter(a => a.status === "In Consultation").length;
  const waiting = appointments.filter(a => a.status === "Waiting").length;
  const completed = appointments.filter(a => a.status === "Completed").length;

  return (
    <div id="doctor-dashboard-root" className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
      
      {/* Clinician Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-80 h-full opacity-10 bg-contain bg-right bg-no-repeat pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600')` }} />
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/25 border border-teal-500/30 text-xs font-semibold text-teal-300 font-mono mb-2">
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping"></span>
              CARDIOLOGY UNIT NODE 01
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-white">
              Welcome back, Dr. Julian Vance
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              You have <span className="font-semibold text-teal-300">{waiting} pending patients</span> in your queue today. Access critical lab review diagnostics on the right sidebar.
            </p>
          </div>
          
          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl backdrop-blur-md shrink-0 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Clinic Pulse</span>
              <div className="text-lg font-bold font-mono text-white leading-tight">94% Efficiency</div>
              <span className="text-xs text-slate-400">Peak wait time: 14 mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Queue Today</span>
            <div className="text-3xl font-display font-bold text-slate-900">{totalInQueue} <span className="text-xs font-normal text-slate-500">Patients</span></div>
            <p className="text-xs text-slate-500 font-mono mt-1">Active queue workload</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">In Consultation</span>
            <div className="text-3xl font-display font-bold text-teal-600">{inConsultation} <span className="text-xs font-normal text-slate-500">Active</span></div>
            <p className="text-xs text-slate-500 font-mono mt-1">Undergoing active review</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Completed Reviews</span>
            <div className="text-3xl font-display font-bold text-slate-500">{completed} <span className="text-xs font-normal text-slate-500">Done</span></div>
            <p className="text-xs text-slate-500 font-mono mt-1">Discharged or scheduled</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Today's Appointments Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-slate-900 text-lg">Today's Appointment Queue</h3>
                <p className="text-xs text-slate-400">Manage, prioritize, and initiate patient consultations live.</p>
              </div>
              <button 
                id="doctor-add-appt-btn"
                onClick={onAddQuickAppointment}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Fast Register Patient</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100">
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase font-mono">Token ID</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase font-mono">Patient Name</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase font-mono">Age & Gender</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase font-mono">Status</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase font-mono">Time Slot</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase font-mono text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((appt) => (
                    <tr id={`appt-row-${appt.id}`} key={appt.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-5 py-4 text-sm font-mono text-slate-500 font-medium">
                        {appt.tokenNo}
                        {appt.priority && (
                          <span className="ml-1.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-100 border border-amber-200 text-[9px] font-bold text-amber-700 font-display">
                            <Flame className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                            URGENT
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{appt.patientName}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {appt.patientId}</div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {appt.age} Yrs • {appt.gender}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          appt.status === "In Consultation"
                            ? "bg-teal-50 border-teal-200 text-teal-700"
                            : appt.status === "Waiting"
                            ? "bg-amber-50 border-amber-200 text-amber-700"
                            : "bg-slate-50 border-slate-200 text-slate-500"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            appt.status === "In Consultation"
                              ? "bg-teal-500 animate-pulse"
                              : appt.status === "Waiting"
                              ? "bg-amber-500"
                              : "bg-slate-400"
                          }`}></span>
                          {appt.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-mono text-slate-600">
                        {appt.timeSlot}
                      </td>
                      <td className="px-5 py-4 text-right space-x-1">
                        {appt.status === "In Consultation" ? (
                          <button
                            id={`action-continue-${appt.id}`}
                            onClick={() => onStartConsultation(appt.patientId, appt.id)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                          >
                            <span>Continue</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : appt.status === "Waiting" ? (
                          <>
                            <button
                              id={`action-call-${appt.id}`}
                              onClick={() => onStartConsultation(appt.patientId, appt.id)}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                            >
                              <span>Call Next</span>
                            </button>
                            {!appt.priority && (
                              <button
                                id={`action-prioritize-${appt.id}`}
                                onClick={() => onPrioritizeAppointment(appt.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 text-slate-600 hover:text-amber-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                                title="Mark as high clinical priority"
                              >
                                <span>Prioritize</span>
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {appointments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400 text-sm">
                        All patient consultations are complete for today.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Pending Diagnostics & Agenda Schedule */}
        <div className="space-y-6">
          
          {/* Pending Diagnostics Reviews */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-display font-bold text-slate-900 text-base">Pending Reviews</h4>
                <p className="text-xs text-slate-400">Incoming diagnostics awaiting verification.</p>
              </div>
              <span className="text-[10px] font-bold font-mono bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded border border-rose-100">
                3 REVIEWS
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-rose-50/40 border border-rose-100/50 rounded-xl flex items-center justify-between gap-3 hover:bg-rose-50 transition-colors">
                <div>
                  <span className="text-[10px] font-bold uppercase font-mono text-rose-700 block">LAB REPORT</span>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">Hemoglobin A1C Review</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Patient: Sarah Jenkins • #MF-88219</span>
                </div>
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              </div>

              <div className="p-3 bg-amber-50/40 border border-amber-100/50 rounded-xl flex items-center justify-between gap-3 hover:bg-amber-50 transition-colors">
                <div>
                  <span className="text-[10px] font-bold uppercase font-mono text-amber-700 block">ECG TEST</span>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">Abnormal Rhythm Tracing</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Patient: Alexander Thompson • #PT-8829-24</span>
                </div>
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3 hover:bg-slate-100 transition-colors">
                <div>
                  <span className="text-[10px] font-bold uppercase font-mono text-slate-500 block">X-RAY LAB</span>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">Chest AP Lung Consolidation</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Patient: Eleanor Fitzwilliam • #PT-1102-39</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              </div>
            </div>
          </div>

          {/* Medical Agenda Schedule */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-display font-bold text-slate-900 text-base">Medical Calendar</h4>
                <p className="text-xs text-slate-400">Scheduled clinical agenda and events.</p>
              </div>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3 font-sans">
              <div className="flex gap-3 text-xs">
                <div className="w-14 shrink-0 font-semibold font-mono text-slate-500 text-right mt-0.5">12:30 PM</div>
                <div className="w-1.5 h-auto bg-slate-200 rounded-full shrink-0"></div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">Lunch Break</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">Staff Lounge / Cafeteria</p>
                </div>
              </div>

              <div className="flex gap-3 text-xs">
                <div className="w-14 shrink-0 font-semibold font-mono text-blue-600 text-right mt-0.5">02:00 PM</div>
                <div className="w-1.5 h-auto bg-blue-500 rounded-full shrink-0"></div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">Surgery Briefing</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">OR Suite 3 Preparations</p>
                </div>
              </div>

              <div className="flex gap-3 text-xs">
                <div className="w-14 shrink-0 font-semibold font-mono text-teal-600 text-right mt-0.5">04:30 PM</div>
                <div className="w-1.5 h-auto bg-teal-500 rounded-full shrink-0"></div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">Virtual Consults</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">Dermatology External Referrals</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Doctor Notes (FAB addition target) */}
          <div className="bg-blue-600 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-full pointer-events-none -mr-10 -mb-10"></div>
            <div className="relative z-10 space-y-3">
              <h4 className="font-display font-bold text-base flex items-center gap-1.5">
                <Award className="w-4 h-4 text-yellow-300" />
                <span>Today's Quick Notes</span>
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {quickNotes.map((note, idx) => (
                  <div key={idx} className="bg-white/10 p-2.5 rounded-lg text-xs leading-normal flex justify-between items-start gap-2">
                    <span className="flex-1">{note}</span>
                    <button 
                      onClick={() => handleRemoveNote(idx)} 
                      className="text-white/40 hover:text-white cursor-pointer hover:bg-white/10 rounded-md p-0.5 transition-all text-[10px]"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="New reminder note..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 bg-white/20 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/50 focus:outline-none focus:bg-white/25"
                />
                <button type="submit" className="bg-white text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shrink-0">
                  Add
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* FAB (Floating Action Button) for instant note addition */}
      <button 
        id="doctor-fab-btn"
        onClick={() => {
          const quickText = prompt("Register a fast clinical reminder note for today:", "");
          if (quickText?.trim()) {
            setQuickNotes([...quickNotes, quickText.trim()]);
          }
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all z-40 cursor-pointer"
        title="Add Fast Note Reminder"
      >
        <Plus className="w-7 h-7" />
      </button>

    </div>
  );
}
