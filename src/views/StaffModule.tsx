import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Activity, 
  CreditCard, 
  QrCode, 
  Printer, 
  CheckCircle2, 
  Plus, 
  AlertCircle,
  Clock,
  HeartHandshake,
  ShieldCheck
} from "lucide-react";
import { Patient, Appointment, AuditLog, UserSession, ClinicalRole } from "../types";

interface StaffModuleProps {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  auditLogs: AuditLog[];
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditLog[]>>;
  currentUser: UserSession | null;
}

export default function StaffModule({
  patients,
  setPatients,
  appointments,
  setAppointments,
  auditLogs,
  setAuditLogs,
  currentUser
}: StaffModuleProps) {
  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");

  // Existing Patient Tab States
  const [patientIdInput, setPatientIdInput] = useState("PT-8829-24");
  const [fetchedPatient, setFetchedPatient] = useState<Patient | null>(null);
  const [fetchError, setFetchError] = useState("");

  // Check-in Vitals States
  const [bp, setBp] = useState("120/80");
  const [temp, setTemp] = useState(98.6);
  const [weight, setWeight] = useState(72);
  const [selectedDoctor, setSelectedDoctor] = useState("Dr. Julian Vance");
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "POS">("Cash");
  const [isCheckInSuccess, setIsCheckInSuccess] = useState(false);

  // New Patient Form States
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newDOB, setNewDOB] = useState("");
  const [newGender, setNewGender] = useState<"Male" | "Female" | "Other">("Male");
  const [newBloodGroup, setNewBloodGroup] = useState("O-positive");
  const [newHistory, setNewHistory] = useState("");
  const [newPatientRegSuccess, setNewPatientRegSuccess] = useState(false);

  const handleFetchDetails = () => {
    setFetchError("");
    const matched = patients.find(p => p.id.toLowerCase() === patientIdInput.trim().toLowerCase());
    if (matched) {
      setFetchedPatient(matched);
      // Pre-fill vitals
      setBp(matched.vitals.bp);
      setTemp(matched.vitals.temp);
      setWeight(matched.vitals.weight || 70);
    } else {
      setFetchedPatient(null);
      setFetchError("Patient ID not found in system databases.");
    }
  };

  const handleConfirmCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fetchedPatient) return;

    // Create new appointment token
    const tokenNum = appointments.length + 402; // e.g. TK-402, TK-403...
    const newAppt: Appointment = {
      id: `TK-${tokenNum}`,
      tokenNo: `#TK-${tokenNum}`,
      patientId: fetchedPatient.id,
      patientName: fetchedPatient.name,
      age: fetchedPatient.age,
      gender: fetchedPatient.gender,
      status: "Waiting",
      doctorName: selectedDoctor,
      timeSlot: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      vitalsSubmitted: true,
      vitals: { bp, temp, weight }
    };

    setAppointments([...appointments, newAppt]);

    // Save vitals back to patient record
    setPatients(patients.map(p => {
      if (p.id === fetchedPatient.id) {
        return {
          ...p,
          lastVisit: "Today (Checked In)",
          vitals: { bp, temp, weight }
        };
      }
      return p;
    }));

    // Register log
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: "Just now",
      user: currentUser?.name || "John Doe",
      role: "Front Desk",
      action: `Created appointment queue token ${newAppt.tokenNo} for ${fetchedPatient.name}. Payment approved via ${paymentMethod}.`,
      type: "Staff"
    };
    setAuditLogs([log, ...auditLogs]);

    setIsCheckInSuccess(true);
    setTimeout(() => {
      setIsCheckInSuccess(false);
      setFetchedPatient(null);
      setPatientIdInput("");
    }, 4000);
  };

  const handleRegisterNewPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName || !newLastName || !newMobile) return;

    const newId = `PT-${Math.floor(1000 + Math.random() * 9000)}-26`;
    const fullName = `${newFirstName} ${newLastName}`;
    
    const newPatient: Patient = {
      id: newId,
      name: fullName,
      age: 32, // placeholder age
      gender: newGender,
      contact: newMobile,
      email: newEmail,
      bloodGroup: newBloodGroup,
      lastVisit: "First Register",
      vitals: { bp: "120/80", temp: 98.6, weight: 70 },
      medicalHistory: newHistory || "No chronic history declared at registration.",
      activeFile: true,
      timeline: []
    };

    setPatients([newPatient, ...patients]);

    // Create log
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: "Just now",
      user: currentUser?.name || "John Doe",
      role: "Front Desk",
      action: `Registered new patient file ${fullName} with unique ID ${newId}`,
      type: "Staff"
    };
    setAuditLogs([log, ...auditLogs]);

    setNewPatientRegSuccess(true);
    // Preload them inside existing tab
    setPatientIdInput(newId);
    
    setTimeout(() => {
      setNewPatientRegSuccess(false);
      setActiveTab("existing");
      // Pre-fetch
      setFetchedPatient(newPatient);
      setBp("120/80");
      setTemp(98.6);
      setWeight(70);
      // Clean up fields
      setNewFirstName("");
      setNewLastName("");
      setNewMobile("");
      setNewEmail("");
      setNewHistory("");
    }, 2000);
  };

  return (
    <div id="staff-module-root" className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6 select-none">
      
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-200">
        <button
          id="tab-existing-patient"
          onClick={() => setActiveTab("existing")}
          className={`px-6 py-3 font-display font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "existing"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Check-In Existing Patient
        </button>
        <button
          id="tab-new-patient"
          onClick={() => setActiveTab("new")}
          className={`px-6 py-3 font-display font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "new"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          New Patient Registration
        </button>
      </div>

      {isCheckInSuccess && (
        <div id="checkin-success-alert" className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm animate-fadeIn">
          <CheckCircle2 className="w-5.5 h-5.5 text-emerald-600" />
          <div>
            <span className="font-bold">Check-in confirmed successfully!</span> Slips printed to receipt spool. Queue updated in Cardiologist cluster.
          </div>
        </div>
      )}

      {/* Tab: Existing Patient Lookup & Check-In */}
      {activeTab === "existing" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Lookup and Vitals Entry Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-slate-900 text-base">Patient Identification</h3>
                <p className="text-xs text-slate-400">Validate clinical identification token keys.</p>
              </div>

              {/* ID Input Search */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="staff-lookup-input"
                    type="text"
                    placeholder="Enter Patient ID (e.g. PT-8829-24, MF-88219)..."
                    value={patientIdInput}
                    onChange={(e) => setPatientIdInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-800"
                  />
                </div>
                <button
                  id="staff-fetch-details-btn"
                  onClick={handleFetchDetails}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md cursor-pointer shrink-0"
                >
                  Fetch Details
                </button>
              </div>

              {fetchError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-xs text-rose-600 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span>{fetchError}</span>
                </div>
              )}

              {/* Fetched Patient Information Card */}
              {fetchedPatient && (
                <div id="fetched-patient-data" className="space-y-5 animate-fadeIn">
                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Full Name</span>
                      <span className="font-bold text-slate-800">{fetchedPatient.name}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Contact number</span>
                      <span className="font-medium text-slate-700">{fetchedPatient.contact}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Blood Type</span>
                      <span className="font-medium text-rose-600">{fetchedPatient.bloodGroup}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Last Visit Record</span>
                      <span className="font-medium text-slate-600">{fetchedPatient.lastVisit || "None"}</span>
                    </div>
                  </div>

                  {/* Vitals & Scheduling Submission Form */}
                  <form onSubmit={handleConfirmCheckIn} className="space-y-4">
                    <div className="border-t border-slate-100 pt-4">
                      <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 font-display">Triage Vitals Entry (Optional)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Blood Pressure (mmHg)</label>
                          <input
                            id="triage-bp-input"
                            type="text"
                            value={bp}
                            onChange={(e) => setBp(e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                            placeholder="120/80"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Temperature (°F)</label>
                          <input
                            id="triage-temp-input"
                            type="number"
                            step="0.1"
                            value={temp}
                            onChange={(e) => setTemp(Number(e.target.value))}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                            placeholder="98.6"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Weight (kg)</label>
                          <input
                            id="triage-weight-input"
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                            placeholder="70"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Assigned Consulting Doctor</label>
                        <select
                          id="triage-doctor-select"
                          value={selectedDoctor}
                          onChange={(e) => setSelectedDoctor(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                        >
                          <option value="Dr. Julian Vance">Dr. Julian Vance (Senior Cardiologist)</option>
                          <option value="Dr. Rebecca White">Dr. Rebecca White (Senior Practitioner)</option>
                          <option value="Dr. Sarah Chen">Dr. Sarah Chen (Cardiovascular Specialist)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Financial checkout Desk</label>
                        <div className="flex gap-3 h-8.5 items-center">
                          <label className="flex items-center gap-1 text-xs cursor-pointer select-none">
                            <input
                              type="radio"
                              name="payMethod"
                              checked={paymentMethod === "Cash"}
                              onChange={() => setPaymentMethod("Cash")}
                              className="w-4 h-4 text-blue-600"
                            />
                            Cash Drawer
                          </label>
                          <label className="flex items-center gap-1 text-xs cursor-pointer select-none">
                            <input
                              type="radio"
                              name="payMethod"
                              checked={paymentMethod === "POS"}
                              onChange={() => setPaymentMethod("POS")}
                              className="w-4 h-4 text-blue-600"
                            />
                            Online / Credit / POS
                          </label>
                        </div>
                      </div>
                    </div>

                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Payment Collection sidebar card */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col space-y-4">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4.5 h-4.5 text-blue-600" />
                  <h4 className="font-display font-bold text-slate-900 text-base">Payment Checkout</h4>
                </div>
                <span className="text-[9px] font-bold font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
                  RECEIPT INVOICE
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Consultation Fee</span>
                  <span className="font-semibold text-slate-800 font-mono">$50.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">EHR Administration Fee</span>
                  <span className="font-semibold text-slate-800 font-mono">$5.00</span>
                </div>
                <div className="border-t border-slate-100 pt-2.5 flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-800 font-display">Total Payable</span>
                  <span className="text-blue-600 font-mono">$55.00</span>
                </div>
              </div>

              <button
                id="staff-confirm-print-btn"
                onClick={handleConfirmCheckIn}
                disabled={!fetchedPatient}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer text-center flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Confirm & Print Slip</span>
              </button>

              <div className="text-[10px] text-slate-400 text-center leading-normal">
                Receipt slip includes the physical queue token bar matrix. HIPAA payment standard compliant.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab: New Patient Intake Form */}
      {activeTab === "new" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Panel: QR Code and Self-Registration */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-center items-center text-center space-y-4">
            <span className="text-[10px] font-bold uppercase text-slate-400 font-mono tracking-widest block">Self-Registration</span>
            
            {/* Visual Vector QR Code */}
            <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50 shadow-inner flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-36 h-36">
                <path d="M5 5h30v30H5V5zm4 4v22h22V9H9zm5 5h12v12H14V14zm51-9h30v30H65V5zm4 4v22h22V9H69zm5 5h12v12H74V14zM5 65h30v30H5V65zm4 4v22h22V69H9zm5 5h12v12H14V74zm61-1H70v5h5v-5zm10 0h5v10h-5v-10zm-5 5h-5v5h5v-5zm10 5h5v5h-5v-5zm-20 5h5v5h-5v-5zm15-10h-5v5h5v-5zm-5 15h10v5H75v-5zm10-5h5v5h-5v-5zm-15 10h5v5h-5v-5zm20 0h5v5h-5v-5z" fill="#0f172a" />
              </svg>
            </div>

            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Patients can scan this QR code with any mobile device to complete self-onboarding registration forms in their browser.
            </p>
          </div>

          {/* Right Panel: Manual Intake Form (2 cols width) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-base">New Patient Intake Form</h3>
                  <p className="text-xs text-slate-400">Perform manual onboarding and clinical background indexing.</p>
                </div>
                <ShieldCheck className="w-4.5 h-4.5 text-teal-500" />
              </div>

              {newPatientRegSuccess && (
                <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 text-xs rounded-xl font-semibold">
                  Patient registered successfully! Loading check-in console...
                </div>
              )}

              <form onSubmit={handleRegisterNewPatient} className="space-y-4 font-sans text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">First Name</label>
                    <input
                      id="new-pt-firstname"
                      type="text"
                      required
                      placeholder="e.g. John"
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Last Name</label>
                    <input
                      id="new-pt-lastname"
                      type="text"
                      required
                      placeholder="e.g. Sterling"
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Mobile Contact Number</label>
                    <input
                      id="new-pt-mobile"
                      type="tel"
                      required
                      placeholder="e.g. +1 (555) 304-2019"
                      value={newMobile}
                      onChange={(e) => setNewMobile(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Email Address</label>
                    <input
                      id="new-pt-email"
                      type="email"
                      placeholder="e.g. name@example.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Date of Birth</label>
                    <input
                      id="new-pt-dob"
                      type="date"
                      required
                      value={newDOB}
                      onChange={(e) => setNewDOB(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Gender</label>
                    <select
                      id="new-pt-gender"
                      value={newGender}
                      onChange={(e) => setNewGender(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Blood Group type</label>
                    <select
                      id="new-pt-bloodgroup"
                      value={newBloodGroup}
                      onChange={(e) => setNewBloodGroup(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
                    >
                      <option value="O-positive">O-positive</option>
                      <option value="O-negative">O-negative</option>
                      <option value="A-positive">A-positive</option>
                      <option value="A-negative">A-negative</option>
                      <option value="B-positive">B-positive</option>
                      <option value="B-negative">B-negative</option>
                      <option value="AB-positive">AB-positive</option>
                      <option value="AB-negative">AB-negative</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Pre-existing Medical conditions / History notes</label>
                  <textarea
                    id="new-pt-history"
                    rows={3}
                    placeholder="Declare any chronic allergies, cardiovascular conditions, medications, or surgical history..."
                    value={newHistory}
                    onChange={(e) => setNewHistory(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
                  />
                </div>

                <div className="text-right">
                  <button
                    id="new-pt-submit-btn"
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Register & Proceed to Check-In
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
