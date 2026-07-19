import React, { useState } from "react";
import { ClinicalRole, UserSession, Patient, Appointment, Medicine, MedicalTest, StaffMember, AuditLog, PrescriptionItem } from "./types";
import { 
  initialPatients, 
  initialAppointments, 
  initialMedicines, 
  initialMedicalTests, 
  initialStaff, 
  initialAuditLogs 
} from "./data/mockData";

// View imports
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import SignIn from "./views/SignIn";
import Register from "./views/Register";
import DoctorDashboard from "./views/DoctorDashboard";
import PatientConsultation from "./views/PatientConsultation";
import PatientProfile from "./views/PatientProfile";
import AdminModule from "./views/AdminModule";
import StaffModule from "./views/StaffModule";

export default function App() {
  // Authentication session
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Core system State (synchronized across views)
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [medicalTests, setMedicalTests] = useState<MedicalTest[]>(initialMedicalTests);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(initialStaff);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Active view and patient selector
  const [currentView, setCurrentView] = useState<string>("Doctor");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  // Handlers
  const handleLoginSuccess = (session: UserSession) => {
    setCurrentUser(session);
    // Autoroute based on role
    if (session.role === ClinicalRole.ADMIN) {
      setCurrentView("Admin");
    } else if (session.role === ClinicalRole.STAFF) {
      setCurrentView("Staff");
    } else {
      setCurrentView("Doctor");
    }

    // Append Login Audit Log
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: "Just now",
      user: session.name,
      role: session.role,
      action: `Practitioner session authorized. Access token validated on workstation.`,
      type: "System"
    };
    setAuditLogs([log, ...auditLogs]);
  };

  const handleRegisterSuccess = (session: UserSession) => {
    setCurrentUser(session);
    setIsRegistering(false);
    setCurrentView(session.role === ClinicalRole.ADMIN ? "Admin" : session.role === ClinicalRole.STAFF ? "Staff" : "Doctor");

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: "Just now",
      user: session.name,
      role: session.role,
      action: `Created new verified clinical account and signed in.`,
      type: "Staff"
    };
    setAuditLogs([log, ...auditLogs]);
  };

  const handleLogout = () => {
    if (currentUser) {
      const log: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: "Just now",
        user: currentUser.name,
        role: currentUser.role,
        action: `Practitioner session terminated securely. Workstation locked.`,
        type: "System"
      };
      setAuditLogs([log, ...auditLogs]);
    }
    setCurrentUser(null);
    setIsRegistering(false);
    setSelectedPatientId(null);
    setSelectedAppointmentId(null);
  };

  const handleSwitchRole = (role: ClinicalRole) => {
    if (!currentUser) return;
    
    let name = "Dr. Julian Vance";
    let title = "Senior Cardiologist";
    let avatar = "JV";

    if (role === ClinicalRole.ADMIN) {
      name = "Dr. Sarah Chen";
      title = "Super Admin";
      avatar = "SC";
    } else if (role === ClinicalRole.STAFF) {
      name = "John Doe";
      title = "Front Desk & Reception";
      avatar = "JD";
    }

    setCurrentUser({
      name,
      role,
      email: name.toLowerCase().replace(" ", ".") + "@mediflow.com",
      title,
      avatar
    });

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: "Just now",
      user: name,
      role: role,
      action: `Simulated role transition to ${role} (${name}). Core permissions re-evaluated.`,
      type: "System"
    };
    setAuditLogs([log, ...auditLogs]);
  };

  const handleSearchPatient = (query: string) => {
    const queryLower = query.toLowerCase();
    const matched = patients.find(p => 
      p.id.toLowerCase() === queryLower || 
      p.name.toLowerCase().includes(queryLower)
    );

    if (matched) {
      setSelectedPatientId(matched.id);
      setCurrentView("PatientProfile");
    } else {
      alert(`No records found matching Patient "${query}" in master EHR index.`);
    }
  };

  const handleStartConsultation = (patientId: string, appointmentId: string) => {
    setSelectedPatientId(patientId);
    setSelectedAppointmentId(appointmentId);
    
    // Update appointment status to "In Consultation"
    setAppointments(appointments.map(a => {
      if (a.id === appointmentId) {
        return { ...a, status: "In Consultation" };
      }
      return a;
    }));

    setCurrentView("Consultation");
  };

  const handlePrioritizeAppointment = (appointmentId: string) => {
    setAppointments(appointments.map(a => {
      if (a.id === appointmentId) {
        return { ...a, priority: true, priorityReason: "Clinical urgency flagged by attending doctor" };
      }
      return a;
    }));

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: "Just now",
      user: currentUser?.name || "Dr. Julian Vance",
      role: "Doctor",
      action: `Prioritized appointment queue slot ${appointmentId}`,
      type: "Staff"
    };
    setAuditLogs([log, ...auditLogs]);
  };

  const handleSaveConsultation = (
    patientId: string, 
    diagnoses: string, 
    notes: string, 
    prescriptions: Omit<PrescriptionItem, "id">[], 
    orderedLabTests: string[]
  ) => {
    // Generate fresh timeline event
    const newEvent = {
      id: `v-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      title: "Clinical Consultation",
      type: "Routine" as const,
      status: "Completed" as const,
      diagnoses,
      doctorName: currentUser?.name || "Dr. Julian Vance",
      notes,
      prescriptions: prescriptions.map((p, idx) => ({ ...p, id: `p-${Date.now()}-${idx}` })),
      labTests: orderedLabTests
    };

    // Append to selected patient's history timeline
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          lastVisit: newEvent.date,
          timeline: [newEvent, ...p.timeline]
        };
      }
      return p;
    }));

    // Mark current appointment as completed in the queue
    if (selectedAppointmentId) {
      setAppointments(appointments.map(a => {
        if (a.id === selectedAppointmentId) {
          return { ...a, status: "Completed" };
        }
        return a;
      }));
    }

    // Deduct stock levels for prescribed medicines dynamically (EHR feedback!)
    setMedicines(prevMedicines => {
      return prevMedicines.map(m => {
        const match = prescriptions.find(p => p.medicineName.toLowerCase().includes(m.name.toLowerCase()));
        if (match) {
          const nextStock = Math.max(0, m.stock - 10); // simulate course consumption
          return { ...m, stock: nextStock, isLowStock: nextStock < 20 };
        }
        return m;
      });
    });

    // Log the transaction
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: "Just now",
      user: currentUser?.name || "Dr. Julian Vance",
      role: "Doctor",
      action: `Completed electronic consultation for Patient ID: ${patientId}. Logged timeline & synced pharmacy.`,
      type: "Inventory"
    };
    setAuditLogs([log, ...auditLogs]);

    alert("Consultation files finalized & prescription routed to local pharmacy network successfully!");

    // Route back to dashboard
    setCurrentView("Doctor");
    setSelectedPatientId(null);
    setSelectedAppointmentId(null);
  };

  const handleEditPatientDetails = (patientId: string, updatedFields: Partial<Patient>) => {
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        return { ...p, ...updatedFields };
      }
      return p;
    }));

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: "Just now",
      user: currentUser?.name || "Dr. Julian Vance",
      role: "Doctor",
      action: `Modified Demographic profile information for patient ID: ${patientId}`,
      type: "Staff"
    };
    setAuditLogs([log, ...auditLogs]);
  };

  // Render proper View Content
  const renderActiveView = () => {
    switch (currentView) {
      case "Doctor":
        return (
          <DoctorDashboard
            appointments={appointments}
            onStartConsultation={handleStartConsultation}
            onPrioritizeAppointment={handlePrioritizeAppointment}
            onAddQuickAppointment={() => setCurrentView("Staff")}
          />
        );
      case "Consultation":
        return (
          <PatientConsultation
            selectedPatientId={selectedPatientId}
            patients={patients}
            medicinesCatalog={medicines}
            medicalTestsCatalog={medicalTests}
            onSaveConsultation={handleSaveConsultation}
            onCancel={() => {
              setCurrentView("Doctor");
              setSelectedPatientId(null);
              setSelectedAppointmentId(null);
            }}
          />
        );
      case "PatientProfile":
        return (
          <PatientProfile
            selectedPatientId={selectedPatientId}
            patients={patients}
            onSearchPatient={handleSearchPatient}
            onEditPatientDetails={handleEditPatientDetails}
          />
        );
      case "Staff":
        return (
          <StaffModule
            patients={patients}
            setPatients={setPatients}
            appointments={appointments}
            setAppointments={setAppointments}
            auditLogs={auditLogs}
            setAuditLogs={setAuditLogs}
            currentUser={currentUser}
          />
        );
      case "Admin":
        return (
          <AdminModule
            medicines={medicines}
            setMedicines={setMedicines}
            medicalTests={medicalTests}
            setMedicalTests={setMedicalTests}
            staffMembers={staffMembers}
            setStaffMembers={setStaffMembers}
            auditLogs={auditLogs}
            setAuditLogs={setAuditLogs}
            currentUser={currentUser}
          />
        );
      default:
        return (
          <div className="p-6 text-center text-slate-500 font-sans">
            View "{currentView}" not yet fully configured. Use sidebar roles to toggle workspace.
          </div>
        );
    }
  };

  // Authentication Guard Check
  if (!currentUser) {
    if (isRegistering) {
      return (
        <Register
          onRegisterSuccess={handleRegisterSuccess}
          onGoToLogin={() => setIsRegistering(false)}
        />
      );
    }
    return (
      <SignIn
        onLoginSuccess={handleLoginSuccess}
        onGoToRegister={() => setIsRegistering(true)}
      />
    );
  }

  return (
    <div id="mediflow-main-viewport" className="flex h-screen bg-slate-100 overflow-hidden font-sans antialiased text-slate-800">
      
      {/* Sidebar Frame Navigation */}
      <Sidebar
        currentView={currentView}
        setView={setCurrentView}
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
      />

      {/* Main Panel Frame */}
      <div id="main-content-scroller" className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Core Global Header bar */}
        <Header
          currentView={currentView}
          setView={setCurrentView}
          onSearchPatient={handleSearchPatient}
          patients={patients}
          onBack={
            currentView !== "Doctor" && currentView !== "Staff" && currentView !== "Admin"
              ? () => setCurrentView(currentUser.role === ClinicalRole.ADMIN ? "Admin" : currentUser.role === ClinicalRole.STAFF ? "Staff" : "Doctor")
              : undefined
          }
        />

        {/* Dynamic Inner Page Stage view */}
        <div className="flex-1 flex flex-col min-h-0 relative z-10 overflow-hidden">
          {renderActiveView()}
        </div>

      </div>

    </div>
  );
}
