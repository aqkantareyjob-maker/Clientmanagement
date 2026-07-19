import { Patient, StaffMember, Medicine, MedicalTest, Appointment, AuditLog } from "../types";

export const initialPatients: Patient[] = [
  {
    id: "MF-88219",
    name: "Sarah Jenkins",
    age: 42,
    gender: "Female",
    contact: "+1 (555) 234-5678",
    email: "s.jenkins@gmail.com",
    bloodGroup: "O-positive",
    lastVisit: "12 Oct 2023",
    vitals: {
      bp: "132/84",
      temp: 98.4,
      pulse: 74,
      weight: 64
    },
    medicalHistory: "History of Primary Hypertension, seasonal asthma, allergic to penicillin.",
    activeFile: true,
    timeline: [
      {
        id: "v-1",
        date: "Oct 12, 2023",
        title: "Routine Checkup & Lab Review",
        type: "Routine",
        status: "Completed",
        diagnoses: "Primary Hypertension (Controlled)",
        doctorName: "Dr. James Wilson",
        notes: "Patient is responding well to Amlodipine. Dietary advice (low-sodium) reinforced. Vitals stable. Advised to continue current course and return in 3 months.",
        prescriptions: [
          { id: "p-1", medicineName: "Amlodipine", dosage: "5 mg", duration: "90 Days", frequency: { morning: true, afternoon: false, night: false } }
        ],
        labTests: ["Lipid Profile", "HbA1c"]
      },
      {
        id: "v-2",
        date: "Aug 04, 2023",
        title: "Emergency Admission: Chest Pain",
        type: "Emergency",
        status: "Critical",
        diagnoses: "Acute Gastritis, rule out Myocardial Infarction",
        doctorName: "Dr. Elena Rodriguez",
        notes: "Presented with sharp sub-sternal chest pain. ECG and cardiac enzymes returned negative for MI. Symptoms resolved post oral antacid cocktail. Highly likely acid-reflux related, triggered by dietary indiscretion.",
        prescriptions: [
          { id: "p-2", medicineName: "Pantoprazole", dosage: "40 mg", duration: "14 Days", frequency: { morning: true, afternoon: false, night: false } }
        ],
        labTests: ["ECG (12-Lead)", "Troponin T Test", "CBC"]
      },
      {
        id: "v-3",
        date: "Jan 15, 2023",
        title: "Initial Consultation",
        type: "Initial",
        status: "Archived",
        diagnoses: "Newly diagnosed Hypertension, Stage 1",
        doctorName: "Dr. James Wilson",
        notes: "Baseline readings indicate sustained elevated BP (144/90). Baseline kidney function normal. Commencing low-dose monotherapy.",
        prescriptions: [
          { id: "p-3", medicineName: "Amlodipine", dosage: "2.5 mg", duration: "30 Days", frequency: { morning: true, afternoon: false, night: false } }
        ]
      }
    ]
  },
  {
    id: "PT-8829-24",
    name: "Alexander Thompson",
    age: 54,
    gender: "Male",
    contact: "+1 (555) 012-3456",
    email: "a.thompson@outlook.com",
    bloodGroup: "A-negative",
    lastVisit: "Oct 12, 2023",
    vitals: {
      bp: "128/82",
      temp: 98.2,
      pulse: 68,
      weight: 81
    },
    medicalHistory: "Type 2 Diabetes mellitus under control with oral hypoglycemics. Hyperlipidemia.",
    activeFile: true,
    timeline: [
      {
        id: "v-4",
        date: "Oct 12, 2023",
        title: "Diabetic Foot & Blood Sugar Review",
        type: "Routine",
        status: "Completed",
        diagnoses: "Type 2 Diabetes Mellitus",
        doctorName: "Dr. Julian Vance",
        notes: "HbA1c is stable at 6.8%. Foot examination negative for peripheral neuropathy. Continue Metformin.",
        prescriptions: [
          { id: "p-4", medicineName: "Metformin", dosage: "500 mg", duration: "60 Days", frequency: { morning: true, afternoon: false, night: true } }
        ]
      }
    ]
  },
  {
    id: "PT-1102-39",
    name: "Eleanor Fitzwilliam",
    age: 68,
    gender: "Female",
    contact: "+1 (555) 987-6543",
    email: "e.fitzwilliam@yahoo.com",
    bloodGroup: "B-positive",
    lastVisit: "14 Oct 2023",
    vitals: {
      bp: "132/88",
      temp: 98.6,
      pulse: 76,
      weight: 71
    },
    medicalHistory: "History of Type 2 Diabetes, Hypertension, Bilateral Osteoarthritis of the knee.",
    activeFile: true,
    timeline: [
      {
        id: "v-5",
        date: "Oct 14, 2023",
        title: "Cardiology Consultation & Refill",
        type: "Routine",
        status: "Completed",
        diagnoses: "Essential Hypertension, Mild Systolic overload",
        doctorName: "Dr. Julian Vance",
        notes: "Blood pressure is mildly elevated but acceptable given demographic. Commenced Metformin 500mg and Lisinopril 10mg.",
        prescriptions: [
          { id: "p-5", medicineName: "Metformin", dosage: "500 mg", duration: "30 Days", frequency: { morning: true, afternoon: false, night: true } },
          { id: "p-6", medicineName: "Lisinopril", dosage: "10 mg", duration: "30 Days", frequency: { morning: true, afternoon: false, night: false } }
        ],
        labTests: ["Lipid Profile"]
      }
    ]
  },
  {
    id: "PT-4412-10",
    name: "Alexander Wright",
    age: 39,
    gender: "Male",
    contact: "+1 (555) 441-2910",
    email: "awright@techcorp.com",
    bloodGroup: "O-negative",
    lastVisit: "08 Oct 2023",
    vitals: {
      bp: "118/76",
      temp: 98.1,
      pulse: 70,
      weight: 78
    },
    medicalHistory: "No chronic conditions. Occasional tension headaches. Fitness active.",
    activeFile: true,
    timeline: []
  },
  {
    id: "PT-7729-15",
    name: "Julian Marcus",
    age: 47,
    gender: "Male",
    contact: "+1 (555) 772-9915",
    email: "jmarcus@designstudio.io",
    bloodGroup: "AB-positive",
    lastVisit: "22 Sep 2023",
    vitals: {
      bp: "135/85",
      temp: 98.5,
      pulse: 72,
      weight: 85
    },
    medicalHistory: "Hypercholesterolemia. Family history of coronary artery disease.",
    activeFile: true,
    timeline: []
  },
  {
    id: "PT-2910-04",
    name: "Sophia Martinez",
    age: 29,
    gender: "Female",
    contact: "+1 (555) 291-0404",
    email: "smartinez@edu.org",
    bloodGroup: "A-positive",
    lastVisit: "None (New Patient)",
    vitals: {
      bp: "112/70",
      temp: 98.7,
      pulse: 64,
      weight: 58
    },
    medicalHistory: "Mild seasonal rhinitis. No drug allergies.",
    activeFile: true,
    timeline: []
  }
];

export const initialStaff: StaffMember[] = [
  {
    id: "ST-001",
    name: "Dr. Sarah Chen",
    role: "Super Admin",
    permissions: ["Full Access", "Staff Management", "Database Access", "Billing Approved"],
    email: "s.chen@mediflow.com",
    status: "Active",
    avatarColor: "bg-blue-600"
  },
  {
    id: "ST-002",
    name: "Dr. Julian Vance",
    role: "Senior Doctor",
    permissions: ["Write Prescription", "Access Patient Files", "Order Diagnostics"],
    email: "j.vance@mediflow.com",
    status: "Active",
    avatarColor: "bg-teal-600"
  },
  {
    id: "ST-003",
    name: "John Doe",
    role: "Front Desk",
    permissions: ["Billing & Receipts", "Check-in Registry", "Scheduling"],
    email: "john.doe@mediflow.com",
    status: "Active",
    avatarColor: "bg-amber-600"
  },
  {
    id: "ST-004",
    name: "Rebecca White",
    role: "Senior Doctor",
    permissions: ["Write Prescription", "Access Patient Files", "All Modifiers"],
    email: "r.white@mediflow.com",
    status: "Active",
    avatarColor: "bg-indigo-600"
  }
];

export const initialMedicines: Medicine[] = [
  { id: "m-1", name: "Amoxicillin", dosage: "500mg", stock: 120, unitPrice: 0.45, category: "Antibiotic", isLowStock: false },
  { id: "m-2", name: "Paracetamol", dosage: "650mg", stock: 45, unitPrice: 0.15, category: "Analgesic", isLowStock: true },
  { id: "m-3", name: "Metformin", dosage: "500mg", stock: 250, unitPrice: 0.30, category: "Antidiabetic", isLowStock: false },
  { id: "m-4", name: "Amlodipine", dosage: "5mg", stock: 18, unitPrice: 0.25, category: "Antihypertensive", isLowStock: true },
  { id: "m-5", name: "Lisinopril", dosage: "10mg", stock: 95, unitPrice: 0.35, category: "Antihypertensive", isLowStock: false },
  { id: "m-6", name: "Atorvastatin", dosage: "20mg", stock: 110, unitPrice: 0.65, category: "Cardiovascular", isLowStock: false },
  { id: "m-7", name: "Ibuprofen", dosage: "400mg", stock: 15, unitPrice: 0.20, category: "NSAID", isLowStock: true }
];

export const initialMedicalTests: MedicalTest[] = [
  { id: "t-1", name: "CBC (Complete Blood Count)", category: "Hematology", price: 45.00, code: "CBC" },
  { id: "t-2", name: "HbA1c (Glycated Hemoglobin)", category: "Endocrinology", price: 60.00, code: "HBA1C" },
  { id: "t-3", name: "Chest X-Ray (PA View)", category: "Radiology", price: 120.00, code: "CXRAY" },
  { id: "t-4", name: "Lipid Profile (Fasting)", category: "Biochemistry", price: 75.00, code: "LIPID" },
  { id: "t-5", name: "ECG (12-Lead)", category: "Cardiology", price: 50.00, code: "ECG" },
  { id: "t-6", name: "Thyroid Profile (T3, T4, TSH)", category: "Endocrinology", price: 90.00, code: "THYROID" }
];

export const initialAppointments: Appointment[] = [
  {
    id: "TK-402",
    tokenNo: "#TK-402",
    patientId: "PT-4412-10",
    patientName: "Alexander Wright",
    age: 39,
    gender: "Male",
    status: "In Consultation",
    doctorName: "Dr. Julian Vance",
    timeSlot: "09:15 AM",
    vitalsSubmitted: true,
    vitals: { bp: "118/76", temp: 98.1, pulse: 70 }
  },
  {
    id: "TK-403",
    tokenNo: "#TK-403",
    patientId: "PT-1102-39",
    patientName: "Eleanor Fitzwilliam",
    age: 68,
    gender: "Female",
    status: "Waiting",
    doctorName: "Dr. Julian Vance",
    timeSlot: "09:30 AM",
    vitalsSubmitted: true,
    vitals: { bp: "132/88", temp: 98.6, pulse: 76 }
  },
  {
    id: "TK-404",
    tokenNo: "#TK-404",
    patientId: "PT-7729-15",
    patientName: "Julian Marcus",
    age: 47,
    gender: "Male",
    status: "Waiting",
    doctorName: "Dr. Julian Vance",
    timeSlot: "10:00 AM",
    vitalsSubmitted: true,
    vitals: { bp: "135/85", temp: 98.5, pulse: 72 }
  },
  {
    id: "TK-405",
    tokenNo: "#TK-405",
    patientId: "PT-2910-04",
    patientName: "Sophia Martinez",
    age: 29,
    gender: "Female",
    status: "Waiting",
    doctorName: "Dr. Julian Vance",
    timeSlot: "10:15 AM",
    vitalsSubmitted: true,
    vitals: { bp: "112/70", temp: 98.7, pulse: 64 }
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: "log-1",
    timestamp: "10 mins ago",
    user: "Dr. Sarah Chen",
    role: "Super Admin",
    action: "Edited master stock level for Amoxicillin 500mg (+50 units)",
    type: "Inventory"
  },
  {
    id: "log-2",
    timestamp: "1 hour ago",
    user: "John Doe",
    role: "Front Desk",
    action: "Added Alexander Wright (PT-4412-10) to Julian Vance's Consultation Queue",
    type: "Staff"
  },
  {
    id: "log-3",
    timestamp: "2 hours ago",
    user: "Dr. Sarah Chen",
    role: "Super Admin",
    action: "Reviewed system firewall and access token keys",
    type: "System"
  },
  {
    id: "log-4",
    timestamp: "4 hours ago",
    user: "System Daemon",
    role: "System",
    action: "Server load spiked to 58% during automated patient db backup",
    type: "Critical"
  },
  {
    id: "log-5",
    timestamp: "5 hours ago",
    user: "Dr. Rebecca White",
    role: "Senior Doctor",
    action: "Registered digital signature and HIPAA diagnostic verification code",
    type: "Staff"
  }
];
