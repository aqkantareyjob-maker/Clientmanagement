/**
 * Types and Interfaces for MediFlow Clinical ERP
 */

export enum ClinicalRole {
  DOCTOR = "Doctor",
  ADMIN = "Admin",
  STAFF = "Staff",
}

export interface VitalSigns {
  bp: string;          // e.g., "132/88"
  temp: number;        // e.g., 98.6
  pulse?: number;      // e.g., 72
  weight?: number;     // e.g., 68 (kg)
}

export interface Patient {
  id: string;          // e.g., "PT-8829-24"
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  contact: string;
  email?: string;
  bloodGroup: string;  // e.g., "O-positive"
  lastVisit: string;   // e.g., "14 Oct 2023"
  vitals: VitalSigns;
  medicalHistory: string; // e.g., "History of Type 2 Diabetes, Hypertension..."
  assignedDoctorId?: string;
  activeFile: boolean;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  type: "Routine" | "Emergency" | "Initial" | "Lab";
  status: "Completed" | "Critical" | "Archived" | "Pending";
  diagnoses: string;
  doctorName: string;
  notes?: string;
  prescriptions?: PrescriptionItem[];
  labTests?: string[];
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string;      // e.g., "500 mg"
  frequency: {
    morning: boolean;
    afternoon: boolean;
    night: boolean;
  };
  duration: string;    // e.g., "14 Days"
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  stock: number;
  unitPrice: number;
  category: string;
  isLowStock: boolean;
}

export interface MedicalTest {
  id: string;
  name: string;
  category: string;
  price: number;
  code: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;        // e.g., "Senior Doctor", "Front Desk", "Super Admin"
  permissions: string[]; // e.g., ["Billing", "All Modifiers", "Write Prescription"]
  email: string;
  status: "Active" | "Inactive";
  avatarColor?: string;
}

export interface Appointment {
  id: string;          // e.g., "TK-402"
  tokenNo: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  status: "In Consultation" | "Waiting" | "Completed";
  doctorName: string;
  timeSlot: string;    // e.g., "10:30 AM"
  vitalsSubmitted: boolean;
  vitals?: VitalSigns;
  priority?: boolean;
  priorityReason?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  type: "Critical" | "System" | "Inventory" | "Staff";
}

export interface UserSession {
  name: string;
  role: ClinicalRole;
  email: string;
  title: string; // e.g. "Senior Cardiologist", "Super Admin", "Receptionist"
  avatar: string; // Initials or URL
}
