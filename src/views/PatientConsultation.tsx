import React, { useState, useEffect } from "react";
import { 
  Users, 
  Plus, 
  Trash2, 
  FileText, 
  FlaskConical, 
  AlertCircle, 
  Activity, 
  Save, 
  Check, 
  X,
  PlusCircle,
  HelpCircle,
  Clock,
  BadgeAlert
} from "lucide-react";
import { Patient, Medicine, MedicalTest, PrescriptionItem, ClinicalRole } from "../types";

interface PatientConsultationProps {
  selectedPatientId: string | null;
  patients: Patient[];
  medicinesCatalog: Medicine[];
  medicalTestsCatalog: MedicalTest[];
  onSaveConsultation: (
    patientId: string, 
    diagnoses: string, 
    notes: string, 
    prescriptions: Omit<PrescriptionItem, "id">[], 
    orderedLabTests: string[]
  ) => void;
  onCancel: () => void;
}

export default function PatientConsultation({
  selectedPatientId,
  patients,
  medicinesCatalog,
  medicalTestsCatalog,
  onSaveConsultation,
  onCancel
}: PatientConsultationProps) {
  // Find current patient
  const patient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Prescription Builder State
  const [prescriptions, setPrescriptions] = useState<Omit<PrescriptionItem, "id">[]>([]);
  
  // Local Prescription form state
  const [selectedMedId, setSelectedMedId] = useState("");
  const [customDosage, setCustomDosage] = useState("500 mg");
  const [customDuration, setCustomDuration] = useState("14 Days");
  const [freqMorning, setFreqMorning] = useState(true);
  const [freqAfternoon, setFreqAfternoon] = useState(false);
  const [freqNight, setFreqNight] = useState(true);
  const [showAddMedForm, setShowAddMedForm] = useState(false);

  // Notes & Diagnosis State
  const [diagnoses, setDiagnoses] = useState("Essential Hypertension, stage 2");
  const [notes, setNotes] = useState("");

  // Tests Ordered State
  const [orderedTests, setOrderedTests] = useState<string[]>([]);
  const [testSearchQuery, setTestSearchQuery] = useState("");

  // Simulation State
  const [thyroidReportCollected, setThyroidReportCollected] = useState(false);

  // Load patient baseline if changed
  useEffect(() => {
    if (patient) {
      setNotes(`Patient presents for follow-up. BP is ${patient.vitals.bp}. Subjective wellness stable. No chest tightness reported.`);
      // Load any existing default medicines
      if (patient.id === "PT-1102-39") { // Eleanor Fitzwilliam
        setPrescriptions([
          { medicineName: "Metformin", dosage: "500 mg", frequency: { morning: true, afternoon: false, night: true }, duration: "30 Days" },
          { medicineName: "Lisinopril", dosage: "10 mg", frequency: { morning: true, afternoon: false, night: false }, duration: "30 Days" }
        ]);
        setDiagnoses("Essential Hypertension & Type 2 Diabetes Mellitus");
      } else {
        setPrescriptions([]);
        setDiagnoses("General Consultation Review");
      }
    }
  }, [patient]);

  if (!patient) {
    return (
      <div className="flex-1 p-8 text-center text-slate-500">
        <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold font-display">No patient loaded</h3>
        <p className="text-sm mt-1">Please select a patient from the Doctor Queue to write a prescription.</p>
      </div>
    );
  }

  const handleAddMedicine = () => {
    const medObj = medicinesCatalog.find(m => m.id === selectedMedId);
    if (!medObj) return;

    const newItem: Omit<PrescriptionItem, "id"> = {
      medicineName: `${medObj.name} ${medObj.dosage}`,
      dosage: customDosage,
      frequency: {
        morning: freqMorning,
        afternoon: freqAfternoon,
        night: freqNight
      },
      duration: customDuration
    };

    setPrescriptions([...prescriptions, newItem]);
    setShowAddMedForm(false);
    setSelectedMedId("");
  };

  const handleDeleteMedicine = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const handleToggleTest = (testCode: string) => {
    if (orderedTests.includes(testCode)) {
      setOrderedTests(orderedTests.filter(t => t !== testCode));
    } else {
      setOrderedTests([...orderedTests, testCode]);
    }
  };

  const handleSave = () => {
    onSaveConsultation(patient.id, diagnoses, notes, prescriptions, orderedTests);
  };

  // Filter tests based on query
  const filteredTests = medicalTestsCatalog.filter(test => 
    test.name.toLowerCase().includes(testSearchQuery.toLowerCase()) ||
    test.category.toLowerCase().includes(testSearchQuery.toLowerCase())
  );

  return (
    <div id="consultation-view-root" className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6 select-none">
      
      {/* Patient Summary Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-display font-bold flex items-center justify-center text-lg">
              {patient.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-slate-900">{patient.name}</h3>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded">
                  ID: {patient.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {patient.age} Years Old • <span className="font-semibold">{patient.gender}</span> • Blood Group: <span className="font-semibold text-rose-600">{patient.bloodGroup}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Blood Pressure</span>
              <span className="text-sm font-bold font-mono text-slate-800">{patient.vitals.bp}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Temperature</span>
              <span className="text-sm font-bold font-mono text-slate-800">{patient.vitals.temp}°F</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Last Visit Date</span>
              <span className="text-xs font-bold text-slate-800">{patient.lastVisit || "N/A"}</span>
            </div>
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Recorded Medical History Summary</span>
          <p className="text-xs text-slate-600 leading-relaxed mt-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            {patient.medicalHistory}
          </p>
        </div>
      </div>

      {/* Write Prescription & Laboratory Double Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Write Prescription & Advice notes (Left Panel, width 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="font-display font-bold text-slate-900 text-base">Write Prescription & Diagnosis</h4>
              </div>
              <button 
                id="add-medicine-toggle"
                onClick={() => setShowAddMedForm(!showAddMedForm)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medicine</span>
              </button>
            </div>

            {/* Inline Add Medicine Form */}
            {showAddMedForm && (
              <div id="add-medicine-form" className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h5 className="text-xs font-bold uppercase font-display text-slate-700">Add Clinical Substance</h5>
                  <button onClick={() => setShowAddMedForm(false)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Pick Medicine</label>
                    <select
                      id="med-select-id"
                      value={selectedMedId}
                      onChange={(e) => setSelectedMedId(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-lg focus:outline-none focus:border-blue-600"
                    >
                      <option value="">-- Choose Substance --</option>
                      {medicinesCatalog.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.dosage}) {m.stock < 20 ? "[Low Stock]" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Dosage strength</label>
                    <input
                      id="med-dosage-input"
                      type="text"
                      placeholder="e.g. 500 mg / 1 tablet"
                      value={customDosage}
                      onChange={(e) => setCustomDosage(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Duration course</label>
                    <input
                      id="med-duration-input"
                      type="text"
                      placeholder="e.g. 14 Days"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Intake Frequency schedule</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                      <input type="checkbox" checked={freqMorning} onChange={(e) => setFreqMorning(e.target.checked)} className="w-4 h-4 text-blue-600 border-slate-300 rounded bg-white" />
                      Morning (M)
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                      <input type="checkbox" checked={freqAfternoon} onChange={(e) => setFreqAfternoon(e.target.checked)} className="w-4 h-4 text-blue-600 border-slate-300 rounded bg-white" />
                      Afternoon (A)
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                      <input type="checkbox" checked={freqNight} onChange={(e) => setFreqNight(e.target.checked)} className="w-4 h-4 text-blue-600 border-slate-300 rounded bg-white" />
                      Night (N)
                    </label>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    id="confirm-add-med-btn"
                    type="button"
                    onClick={handleAddMedicine}
                    disabled={!selectedMedId}
                    className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply to Script</span>
                  </button>
                </div>
              </div>
            )}

            {/* Medicines List Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 font-mono">MEDICINE SUBSTANCE</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 font-mono">DOSAGE</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 font-mono text-center">FREQUENCY</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 font-mono">DURATION</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 font-mono text-right">REMOVE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prescriptions.map((med, index) => (
                    <tr key={index} className="hover:bg-slate-50/20">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800">{med.medicineName}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 font-mono bg-slate-50/50">{med.dosage}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex gap-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${med.frequency.morning ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-400"}`}>M</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${med.frequency.afternoon ? "bg-sky-100 text-sky-800" : "bg-slate-100 text-slate-400"}`}>A</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${med.frequency.night ? "bg-indigo-100 text-indigo-800" : "bg-slate-100 text-slate-400"}`}>N</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700 font-mono">{med.duration}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          id={`delete-prescription-item-${index}`}
                          onClick={() => handleDeleteMedicine(index)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {prescriptions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-slate-400 text-xs font-medium">
                        No pharmaceutical substances prescribed yet. Click "Add Medicine" to select.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Diagnosis and Notes */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Primary Diagnostic Summary</label>
                <input
                  id="consultation-diagnosis-input"
                  type="text"
                  value={diagnoses}
                  onChange={(e) => setDiagnoses(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 text-sm rounded-xl focus:outline-none focus:border-blue-600 text-slate-800"
                  placeholder="e.g. Essential Hypertension, ICD-10 I10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-display">Doctor's Advice & Clinical Notes</label>
                <textarea
                  id="consultation-notes-textarea"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 text-sm rounded-xl focus:outline-none focus:border-blue-600 text-slate-800 font-sans"
                  placeholder="Enter specific lifestyle recommendations, diagnostic summaries, and follow-up directives..."
                />
              </div>
            </div>

            {/* Action buttons footer */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                id="consultation-cancel-btn"
                onClick={onCancel}
                className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-slate-100 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel Consultation
              </button>
              <button
                id="consultation-save-btn"
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/10 hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Consultation & Complete</span>
              </button>
            </div>

          </div>
        </div>

        {/* Laboratory Tests Panel (Right panel, width 1 col) */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col space-y-4">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4.5 h-4.5 text-blue-600" />
                <h4 className="font-display font-bold text-slate-900 text-base">Laboratory Orders</h4>
              </div>
              <span className="text-[10px] font-bold font-mono bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                ORDER SHEET
              </span>
            </div>

            <div className="relative">
              <input
                id="lab-test-filter-input"
                type="text"
                placeholder="Search diagnostic catalog..."
                value={testSearchQuery}
                onChange={(e) => setTestSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-none focus:border-blue-600 text-slate-800"
              />
            </div>

            {/* Checkbox list of diagnostic tests */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredTests.map((test) => {
                const isChecked = orderedTests.includes(test.code);
                return (
                  <label 
                    id={`test-checkbox-label-${test.code}`}
                    key={test.id} 
                    className={`flex items-center justify-between p-2.5 border rounded-xl cursor-pointer transition-all ${
                      isChecked 
                        ? "bg-blue-50/50 border-blue-400" 
                        : "bg-slate-50/40 border-slate-200/70 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        id={`test-checkbox-${test.code}`}
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleTest(test.code)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-xs font-semibold text-slate-800 block">{test.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono uppercase">{test.category}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold font-mono text-slate-500">${test.price.toFixed(2)}</span>
                  </label>
                );
              })}
              {filteredTests.length === 0 && (
                <div className="text-center py-4 text-slate-400 text-xs">No matching laboratory tests.</div>
              )}
            </div>

            {/* Ordered Tests Total Price Summary */}
            {orderedTests.length > 0 && (
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Order Bill Summary</span>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600">{orderedTests.length} Tests Ordered</span>
                  <span className="font-bold text-slate-900 font-mono">
                    ${orderedTests.reduce((sum, code) => {
                      const test = medicalTestsCatalog.find(t => t.code === code);
                      return sum + (test ? test.price : 0);
                    }, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Pending Lab Results warning alert box */}
          {!thyroidReportCollected && patient.id === "PT-1102-39" && (
            <div id="pending-lab-alert" className="bg-rose-50 border border-rose-200 p-4 rounded-2xl shadow-sm flex flex-col gap-3 animate-fadeIn">
              <div className="flex gap-2.5">
                <BadgeAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-rose-800 uppercase font-display tracking-wide">Pending Lab Results</h5>
                  <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                    Patient has an uncollected **Thyroid Panel** diagnostic record (T3, T4, TSH) submitted yesterday from biochemistry.
                  </p>
                </div>
              </div>
              <button
                id="view-report-btn"
                onClick={() => {
                  setThyroidReportCollected(true);
                  alert("Digital record retrieved successfully! T3/T4 are normal. TSH is mildly elevated (4.2 mIU/L). Added to Clinical History timeline.");
                }}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-2 px-3 rounded-xl transition-all shadow-sm shadow-rose-600/15 cursor-pointer text-center"
              >
                View & Import Digital Report
              </button>
            </div>
          )}

          {thyroidReportCollected && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-emerald-800 uppercase font-display">Thyroid Report Imported</h5>
                <p className="text-xs text-emerald-700 mt-0.5">T3/T4 Normal, TSH 4.2 mIU/L. Added to clinical records.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
