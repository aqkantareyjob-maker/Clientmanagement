import React, { useState } from "react";
import { 
  Users, 
  Calendar, 
  FileText, 
  ShieldAlert, 
  Activity, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Lock, 
  Printer, 
  Edit, 
  PlusCircle, 
  Database,
  Search,
  HeartHandshake
} from "lucide-react";
import { Patient, ClinicalRole, TimelineEvent } from "../types";

interface PatientProfileProps {
  selectedPatientId: string | null;
  patients: Patient[];
  onSearchPatient: (id: string) => void;
  onEditPatientDetails?: (patientId: string, updatedFields: Partial<Patient>) => void;
}

export default function PatientProfile({
  selectedPatientId,
  patients,
  onSearchPatient,
  onEditPatientDetails
}: PatientProfileProps) {
  // Use selected patient, or default to Sarah Jenkins
  const patient = patients.find(p => p.id === selectedPatientId) || patients.find(p => p.id === "MF-88219") || patients[0];

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editContact, setEditContact] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editMedicalHistory, setEditMedicalHistory] = useState("");

  const [internalNotes, setInternalNotes] = useState(
    "Patient exhibits secondary stress-induced hypertension spikes. Instructed to log vitals twice daily. Recommend scheduling follow-up ambulatory monitoring if diastolic remains above 85 mmHg."
  );

  const startEdit = () => {
    if (!patient) return;
    setEditName(patient.name);
    setEditContact(patient.contact);
    setEditEmail(patient.email || "");
    setEditMedicalHistory(patient.medicalHistory);
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (onEditPatientDetails && patient) {
      onEditPatientDetails(patient.id, {
        name: editName,
        contact: editContact,
        email: editEmail,
        medicalHistory: editMedicalHistory
      });
    }
    setIsEditing(false);
  };

  if (!patient) {
    return (
      <div className="flex-1 p-8 text-center text-slate-500">
        <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold">No Patient Loaded</h3>
        <p className="text-sm">Please search or register a patient first.</p>
      </div>
    );
  }

  // BP Trend Coordinates for custom SVG Chart
  // Aug: 142/92, Sep: 138/89, Oct: 132/84
  const trendData = [
    { label: "Aug", sys: 142, dia: 92 },
    { label: "Sep", sys: 138, dia: 89 },
    { label: "Oct", sys: 132, dia: 84 }
  ];

  // Map values to coordinates on a 300x120 viewport
  // Max value mapped: 160. Min value mapped: 60.
  const mapValueToY = (val: number) => {
    const range = 160 - 60;
    const height = 110;
    return height - ((val - 60) / range) * height + 5;
  };

  const sysCoords = trendData.map((d, idx) => ({
    x: 40 + idx * 110,
    y: mapValueToY(d.sys)
  }));

  const diaCoords = trendData.map((d, idx) => ({
    x: 40 + idx * 110,
    y: mapValueToY(d.dia)
  }));

  const sysPath = `M ${sysCoords[0].x} ${sysCoords[0].y} L ${sysCoords[1].x} ${sysCoords[1].y} L ${sysCoords[2].x} ${sysCoords[2].y}`;
  const sysAreaPath = `${sysPath} L ${sysCoords[2].x} 115 L ${sysCoords[0].x} 115 Z`;

  const diaPath = `M ${diaCoords[0].x} ${diaCoords[0].y} L ${diaCoords[1].x} ${diaCoords[1].y} L ${diaCoords[2].x} ${diaCoords[2].y}`;
  const diaAreaPath = `${diaPath} L ${diaCoords[2].x} 115 L ${diaCoords[0].x} 115 Z`;

  const getTimelineEventBadge = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800 border-green-200";
      case "Critical": return "bg-rose-100 text-rose-800 border-rose-200";
      case "Archived": return "bg-slate-100 text-slate-800 border-slate-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div id="patient-profile-root" className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6 select-none">
      
      {/* Patient Profile Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 relative overflow-hidden">
        {/* Accent Glow */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-display font-bold flex items-center justify-center text-xl shadow-md">
              {patient.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display font-bold text-xl text-slate-900 leading-none">{patient.name}</h3>
                <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-0.5 rounded-full">
                  ID: {patient.id}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active File
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {patient.age} Yrs • <span className="font-semibold">{patient.gender}</span> • Blood Type: <span className="text-rose-600 font-semibold">{patient.bloodGroup}</span> • Contact: <span className="font-semibold text-slate-700">{patient.contact}</span>
              </p>
              <p className="text-xs text-slate-400 font-mono">Email: {patient.email || "n/a"}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              id="profile-print-btn"
              onClick={() => {
                alert(`Preparing print file for patient ${patient.name}. Initializing HIPAA secure local document stream.`);
                window.print();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print File</span>
            </button>
            <button 
              id="profile-edit-btn"
              onClick={isEditing ? saveEdit : startEdit}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              <span>{isEditing ? "Save Profile" : "Edit Profile"}</span>
            </button>
          </div>
        </div>

        {/* Editable profile fields */}
        {isEditing && (
          <div id="profile-edit-panel" className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 animate-fadeIn">
            <div className="text-xs font-bold uppercase text-slate-500">Modify Demographic Data</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 text-xs rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Contact Number</label>
                <input
                  type="text"
                  value={editContact}
                  onChange={(e) => setEditContact(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 text-xs rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 text-xs rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Medical Background history summary</label>
              <textarea
                rows={2}
                value={editMedicalHistory}
                onChange={(e) => setEditMedicalHistory(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 text-xs rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* Grid Layout: Timeline and Side-Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Clinical Timeline (Left column, 2 cols width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h4 className="font-display font-bold text-slate-900 text-base">Clinical History Timeline</h4>
              </div>
              <span className="text-[10px] font-bold font-mono bg-slate-50 text-slate-400 px-2 py-0.5 rounded border border-slate-150">
                {patient.timeline.length} ENCOUNTERS
              </span>
            </div>

            <div className="relative border-l border-slate-200 pl-6 ml-3 space-y-8 py-2">
              {patient.timeline.map((event, idx) => (
                <div id={`timeline-event-${event.id}`} key={event.id} className="relative group">
                  
                  {/* Circle marker */}
                  <span className={`absolute -left-[31px] top-0 w-4.5 h-4.5 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${
                    event.status === "Completed" ? "bg-green-500" : event.status === "Critical" ? "bg-rose-500" : "bg-slate-400"
                  }`} />

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-slate-400">{event.date}</span>
                        <h5 className="text-sm font-bold text-slate-900">{event.title}</h5>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getTimelineEventBadge(event.status)}`}>
                        {event.status}
                      </span>
                    </div>

                    <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 p-4 rounded-xl transition-all space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">PRIMARY DIAGNOSIS</span>
                          <span className="font-semibold text-slate-800">{event.diagnoses}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">ATTENDING PHYSICIAN</span>
                          <span className="font-medium text-slate-700">{event.doctorName}</span>
                        </div>
                      </div>

                      {event.notes && (
                        <div className="pt-2 border-t border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">CLINICAL OBSERVATION NOTES</span>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{event.notes}</p>
                        </div>
                      )}

                      {event.prescriptions && event.prescriptions.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono mb-1.5">PRESCRIBED MEDICINES</span>
                          <div className="flex flex-wrap gap-1.5">
                            {event.prescriptions.map((p, pIdx) => (
                              <span key={pIdx} className="inline-flex items-center bg-blue-50 border border-blue-100 text-blue-700 px-2 py-0.5 rounded-lg text-xs font-medium">
                                {p.medicineName} {p.dosage} • {p.duration}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {event.labTests && event.labTests.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono mb-1.5">LAB DIAGNOSTICS ORDERED</span>
                          <div className="flex flex-wrap gap-1.5">
                            {event.labTests.map((t, tIdx) => (
                              <span key={tIdx} className="inline-flex items-center bg-teal-50 border border-teal-100 text-teal-700 px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold uppercase">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {patient.timeline.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-sm">
                  No clinical encounters recorded yet. Start consultation to create history.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Vitals Graph, Assets and Internal Notes) */}
        <div className="space-y-6">
          
          {/* Vital Signs Trend (Custom SVG Chart) */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-display font-bold text-slate-900 text-base">Vital Signs Trend</h4>
                <p className="text-xs text-slate-400">Arterial Blood Pressure tracking (mmHg)</p>
              </div>
              <TrendingUp className="w-4.5 h-4.5 text-blue-600" />
            </div>

            {/* Premium Hand-Crafted SVG Chart */}
            <div className="p-2 border border-slate-100 rounded-xl bg-slate-50/50">
              <svg viewBox="0 0 300 150" className="w-full h-auto">
                {/* Horizontal Guide Lines */}
                <line x1="30" y1="20" x2="280" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="30" y1="50" x2="280" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="30" y1="80" x2="280" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="30" y1="110" x2="280" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="30" y1="115" x2="280" y2="115" stroke="#e2e8f0" strokeWidth="1.5" /> {/* baseline */}

                {/* Left Y-Axis Axis markings */}
                <text x="10" y="24" className="text-[9px] fill-slate-400 font-mono" textAnchor="start">140</text>
                <text x="10" y="54" className="text-[9px] fill-slate-400 font-mono" textAnchor="start">110</text>
                <text x="10" y="84" className="text-[9px] fill-slate-400 font-mono" textAnchor="start">80</text>
                <text x="10" y="114" className="text-[9px] fill-slate-400 font-mono" textAnchor="start">50</text>

                {/* Areas Under Curves */}
                <path d={sysAreaPath} fill="rgba(59, 130, 246, 0.08)" />
                <path d={diaAreaPath} fill="rgba(13, 148, 136, 0.08)" />

                {/* Plot Paths */}
                <path d={sysPath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                <path d={diaPath} fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" />

                {/* Systolic Data Points */}
                {sysCoords.map((pt, idx) => (
                  <g key={`sys-${idx}`}>
                    <circle cx={pt.x} cy={pt.y} r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={pt.x} y={pt.y - 8} className="text-[9px] fill-blue-700 font-mono font-bold" textAnchor="middle">{trendData[idx].sys}</text>
                  </g>
                ))}

                {/* Diastolic Data Points */}
                {diaCoords.map((pt, idx) => (
                  <g key={`dia-${idx}`}>
                    <circle cx={pt.x} cy={pt.y} r="4" fill="#0d9488" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={pt.x} y={pt.y + 13} className="text-[9px] fill-teal-700 font-mono font-bold" textAnchor="middle">{trendData[idx].dia}</text>
                  </g>
                ))}

                {/* Bottom X-Axis labels */}
                {trendData.map((d, idx) => (
                  <text key={idx} x={40 + idx * 110} y="138" className="text-[10px] fill-slate-500 font-semibold" textAnchor="middle">{d.label}</text>
                ))}
              </svg>
            </div>

            {/* Chart Legend */}
            <div className="flex justify-center gap-6 text-xs py-1">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span className="font-semibold text-slate-700">Systolic (Peak)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-teal-600 rounded-full"></span>
                <span className="font-semibold text-slate-700">Diastolic (Resting)</span>
              </div>
            </div>
          </div>

          {/* Medical Assets Card */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-display font-bold text-slate-900 text-base">Medical Assets</h4>
              <FileText className="w-4.5 h-4.5 text-blue-600" />
            </div>

            <div className="space-y-2">
              <div className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between gap-2 text-xs transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="font-semibold text-slate-800">Amlodipine 5mg Daily</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">PHARMACY</span>
              </div>

              <div className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between gap-2 text-xs transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                  <span className="font-semibold text-slate-800">Comp Metabolic Panel (CMP)</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">LAB_RESULT</span>
              </div>

              <div className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between gap-2 text-xs transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
                  <span className="font-semibold text-slate-800">Chest X-Ray AP View</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">RADIOLOGY</span>
              </div>
            </div>
          </div>

          {/* Internal Notes card */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3">
            <h4 className="font-display font-bold text-slate-900 text-base">Internal Clinical Notes</h4>
            <p className="text-xs text-slate-400">Confidential clinical team collaborative logs.</p>
            <textarea
              rows={4}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              className="w-full bg-amber-50/50 border border-amber-200 text-xs p-3 rounded-xl focus:outline-none focus:border-amber-400 text-slate-800 font-sans leading-relaxed shadow-inner"
              placeholder="Type internal observations..."
            />
            <div className="text-right">
              <span className="text-[9px] font-semibold text-slate-400 font-mono">HIPAA RESTRICTED SECURITY</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
