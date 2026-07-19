import React, { useState } from "react";
import { 
  Users, 
  FlaskConical, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Activity, 
  Database, 
  Cpu, 
  Search, 
  Settings, 
  Lock,
  PlusCircle,
  Clock,
  HeartCrack,
  CheckCircle2
} from "lucide-react";
import { Medicine, MedicalTest, StaffMember, AuditLog, UserSession } from "../types";

interface AdminModuleProps {
  medicines: Medicine[];
  setMedicines: React.Dispatch<React.SetStateAction<Medicine[]>>;
  medicalTests: MedicalTest[];
  setMedicalTests: React.Dispatch<React.SetStateAction<MedicalTest[]>>;
  staffMembers: StaffMember[];
  setStaffMembers: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  auditLogs: AuditLog[];
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditLog[]>>;
  currentUser: UserSession | null;
}

export default function AdminModule({
  medicines,
  setMedicines,
  medicalTests,
  setMedicalTests,
  staffMembers,
  setStaffMembers,
  auditLogs,
  setAuditLogs,
  currentUser
}: AdminModuleProps) {
  // Add Staff form states
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("Front Desk");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPerms, setNewStaffPerms] = useState("Billing");

  // Add Medicine form states
  const [showAddMedForm, setShowAddMedForm] = useState(false);
  const [newMedName, setNewMedName] = useState("");
  const [newMedDosage, setNewMedDosage] = useState("500mg");
  const [newMedStock, setNewMedStock] = useState(100);
  const [newMedPrice, setNewMedPrice] = useState(0.50);
  const [newMedCat, setNewMedCat] = useState("General");

  // Add Test form states
  const [showAddTestForm, setShowAddTestForm] = useState(false);
  const [newTestName, setNewTestName] = useState("");
  const [newTestCat, setNewTestCat] = useState("Hematology");
  const [newTestPrice, setNewTestPrice] = useState(50.00);
  const [newTestCode, setNewTestCode] = useState("");

  // Search filter
  const [staffSearchQuery, setStaffSearchQuery] = useState("");

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;

    const newStaff: StaffMember = {
      id: `ST-00${staffMembers.length + 1}`,
      name: newStaffName,
      role: newStaffRole,
      permissions: newStaffPerms.split(",").map(p => p.trim()),
      email: newStaffEmail,
      status: "Active",
      avatarColor: "bg-purple-600"
    };

    setStaffMembers([...staffMembers, newStaff]);
    
    // Add audit log
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: "Just now",
      user: currentUser?.name || "Dr. Sarah Chen",
      role: "Super Admin",
      action: `Created new staff account for ${newStaffName} (${newStaffRole})`,
      type: "Staff"
    };
    setAuditLogs([log, ...auditLogs]);

    // Reset Form
    setNewStaffName("");
    setNewStaffEmail("");
    setShowAddStaffForm(false);
  };

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;

    const newMed: Medicine = {
      id: `m-${medicines.length + 1}`,
      name: newMedName,
      dosage: newMedDosage,
      stock: Number(newMedStock),
      unitPrice: Number(newMedPrice),
      category: newMedCat,
      isLowStock: Number(newMedStock) < 20
    };

    setMedicines([...medicines, newMed]);

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: "Just now",
      user: currentUser?.name || "Dr. Sarah Chen",
      role: "Super Admin",
      action: `Added new pharmaceutical substance ${newMedName} ${newMedDosage} to master catalog`,
      type: "Inventory"
    };
    setAuditLogs([log, ...auditLogs]);

    setNewMedName("");
    setShowAddMedForm(false);
  };

  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName || !newTestCode) return;

    const newTest: MedicalTest = {
      id: `t-${medicalTests.length + 1}`,
      name: newTestName,
      category: newTestCat,
      price: Number(newTestPrice),
      code: newTestCode.toUpperCase()
    };

    setMedicalTests([...medicalTests, newTest]);

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: "Just now",
      user: currentUser?.name || "Dr. Sarah Chen",
      role: "Super Admin",
      action: `Registered master laboratory diagnostic test: ${newTestName} [${newTestCode.toUpperCase()}]`,
      type: "Inventory"
    };
    setAuditLogs([log, ...auditLogs]);

    setNewTestName("");
    setNewTestCode("");
    setShowAddTestForm(false);
  };

  const handleDeleteStaff = (id: string, name: string) => {
    if (confirm(`Remove staff member ${name}? This action is logged.`)) {
      setStaffMembers(staffMembers.filter(s => s.id !== id));
      const log: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: "Just now",
        user: currentUser?.name || "Dr. Sarah Chen",
        role: "Super Admin",
        action: `Revoked database access tokens and deleted staff member ${name}`,
        type: "Staff"
      };
      setAuditLogs([log, ...auditLogs]);
    }
  };

  const handleToggleStaffStatus = (id: string) => {
    setStaffMembers(staffMembers.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === "Active" ? "Inactive" : "Active";
        
        // Log action
        const log: AuditLog = {
          id: `log-${Date.now()}`,
          timestamp: "Just now",
          user: currentUser?.name || "Dr. Sarah Chen",
          role: "Super Admin",
          action: `Toggled status for ${s.name} to ${nextStatus}`,
          type: "Staff"
        };
        setAuditLogs([log, ...auditLogs]);

        return { ...s, status: nextStatus as "Active" | "Inactive" };
      }
      return s;
    }));
  };

  const filteredStaff = staffMembers.filter(s => 
    s.name.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
    s.role.toLowerCase().includes(staffSearchQuery.toLowerCase())
  );

  return (
    <div id="admin-module-root" className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6 select-none">
      
      {/* Telemetry Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Active Staff Count</span>
              <div className="text-2xl font-bold font-display text-slate-900">{staffMembers.length} Accounts</div>
              <span className="text-xs text-emerald-600 font-semibold font-sans flex items-center gap-1 mt-1">
                +12% vs last month
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Medicines Master</span>
              <div className="text-2xl font-bold font-display text-slate-900">{medicines.length} Formulae</div>
              <span className="text-xs text-amber-600 font-semibold flex items-center gap-1 mt-1">
                {medicines.filter(m => m.stock < 20).length} running low
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Diagnostic Tests</span>
              <div className="text-2xl font-bold font-display text-slate-900">{medicalTests.length} Registered</div>
              <span className="text-xs text-blue-600 font-semibold flex items-center gap-1 mt-1">
                All codes operational
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Access Security Logs</span>
              <div className="text-2xl font-bold font-display text-slate-900">{auditLogs.length} Events</div>
              <span className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                {auditLogs.filter(l => l.type === "Critical").length} Critical triggers
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Staff Accounts Management Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-slate-900 text-lg">Staff Accounts Registry</h3>
            <p className="text-xs text-slate-400">Configure roles, permissions, active credentials, and revoke tokens.</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="staff-search-input"
              type="text"
              placeholder="Search staff..."
              value={staffSearchQuery}
              onChange={(e) => setStaffSearchQuery(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800"
            />
            <button
              id="add-staff-toggle-btn"
              onClick={() => setShowAddStaffForm(!showAddStaffForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Staff Member</span>
            </button>
          </div>
        </div>

        {/* Add Staff form */}
        {showAddStaffForm && (
          <form onSubmit={handleAddStaff} className="p-5 bg-slate-50 border-b border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Full Practitioner Name</label>
              <input
                id="new-staff-name"
                type="text"
                required
                placeholder="e.g. Dr. Rebecca White"
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 text-xs rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Clinic Duty Role</label>
              <select
                id="new-staff-role"
                value={newStaffRole}
                onChange={(e) => setNewStaffRole(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 text-xs rounded-lg"
              >
                <option value="Senior Doctor">Senior Doctor</option>
                <option value="Front Desk">Front Desk</option>
                <option value="Clinic Coordinator">Clinic Coordinator</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Authorized Email</label>
              <input
                id="new-staff-email"
                type="email"
                required
                placeholder="r.white@mediflow.com"
                value={newStaffEmail}
                onChange={(e) => setNewStaffEmail(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 text-xs rounded-lg"
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Permissions (comma split)</label>
                <input
                  id="new-staff-perms"
                  type="text"
                  placeholder="Billing, Check-in, Registry"
                  value={newStaffPerms}
                  onChange={(e) => setNewStaffPerms(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 text-xs rounded-lg"
                />
              </div>
              <button
                id="confirm-add-staff-btn"
                type="submit"
                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Create Account
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase font-mono">Practitioner Details</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase font-mono">Work Duty Role</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase font-mono">EHR Scope Access level permissions</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase font-mono">Authentication State</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase font-mono text-right">EHR Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((staff) => (
                <tr id={`staff-row-${staff.id}`} key={staff.id} className="hover:bg-slate-50/20">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8.5 h-8.5 rounded-full text-white font-display font-semibold flex items-center justify-center text-xs ${staff.avatarColor || "bg-blue-600"}`}>
                        {staff.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{staff.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-700">
                    {staff.role}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {staff.permissions.map((perm, pIdx) => (
                        <span key={pIdx} className="text-[9px] font-bold bg-slate-100 border border-slate-200/50 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      id={`staff-toggle-status-${staff.id}`}
                      onClick={() => handleToggleStaffStatus(staff.id)}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border cursor-pointer transition-all ${
                        staff.status === "Active"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                          : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${staff.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                      {staff.status}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      id={`staff-delete-btn-${staff.id}`}
                      onClick={() => handleDeleteStaff(staff.id, staff.name)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Revoke Credentials & Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Master Inventory Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Medicines Master Inventory */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-display font-bold text-slate-900 text-base">Medicines Master Catalog</h4>
              <p className="text-xs text-slate-400">Inventory formula catalog with low stock triggers.</p>
            </div>
            <button
              id="add-med-catalog-toggle"
              onClick={() => setShowAddMedForm(!showAddMedForm)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-blue-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New</span>
            </button>
          </div>

          {/* Add Medicine inline Form */}
          {showAddMedForm && (
            <form onSubmit={handleAddMedicine} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-fadeIn">
              <div className="grid grid-cols-2 gap-2">
                <input
                  id="new-med-name-input"
                  type="text"
                  required
                  placeholder="Substance (Amoxicillin)"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-lg"
                />
                <input
                  id="new-med-dosage-input"
                  type="text"
                  placeholder="Strength (500mg)"
                  value={newMedDosage}
                  onChange={(e) => setNewMedDosage(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-lg"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  id="new-med-stock-input"
                  type="number"
                  placeholder="Stock (100)"
                  value={newMedStock}
                  onChange={(e) => setNewMedStock(Number(e.target.value))}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-lg"
                />
                <input
                  id="new-med-price-input"
                  type="number"
                  step="0.01"
                  placeholder="Price ($0.45)"
                  value={newMedPrice}
                  onChange={(e) => setNewMedPrice(Number(e.target.value))}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-lg"
                />
                <select
                  id="new-med-cat-select"
                  value={newMedCat}
                  onChange={(e) => setNewMedCat(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-lg"
                >
                  <option value="General">General</option>
                  <option value="Antibiotic">Antibiotic</option>
                  <option value="Analgesic">Analgesic</option>
                  <option value="Antidiabetic">Antidiabetic</option>
                  <option value="Antihypertensive">Antihypertensive</option>
                </select>
              </div>
              <div className="text-right">
                <button type="submit" className="px-3 py-1 bg-teal-600 text-white text-xs font-bold rounded-lg cursor-pointer">
                  Save Substance
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-3 py-2 text-xs font-semibold text-slate-500 font-mono">Substance Formula</th>
                  <th className="px-3 py-2 text-xs font-semibold text-slate-500 font-mono">Category</th>
                  <th className="px-3 py-2 text-xs font-semibold text-slate-500 font-mono">Stock Level</th>
                  <th className="px-3 py-2 text-xs font-semibold text-slate-500 font-mono text-right">Unit Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicines.map((med) => (
                  <tr key={med.id} className="hover:bg-slate-50/20 text-xs">
                    <td className="px-3 py-2.5 font-semibold text-slate-800">{med.name} <span className="text-slate-400 font-normal">[{med.dosage}]</span></td>
                    <td className="px-3 py-2.5 text-slate-500 font-medium">{med.category}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center gap-1 font-mono font-bold ${med.stock < 20 ? "text-rose-600" : "text-slate-600"}`}>
                        {med.stock} units
                        {med.stock < 20 && (
                          <span className="text-[9px] uppercase font-bold bg-rose-50 text-rose-600 px-1 py-0.2 rounded">LOW</span>
                        )}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-600">${med.unitPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Diagnostic Tests Master Inventory */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-display font-bold text-slate-900 text-base">Medical Diagnostic Tests Registry</h4>
              <p className="text-xs text-slate-400">Master listing of laboratory panel test configurations.</p>
            </div>
            <button
              id="add-test-catalog-toggle"
              onClick={() => setShowAddTestForm(!showAddTestForm)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-blue-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New</span>
            </button>
          </div>

          {/* Add Test inline Form */}
          {showAddTestForm && (
            <form onSubmit={handleAddTest} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-fadeIn">
              <div className="grid grid-cols-2 gap-2">
                <input
                  id="new-test-name-input"
                  type="text"
                  required
                  placeholder="Test (Complete Blood Count)"
                  value={newTestName}
                  onChange={(e) => setNewTestName(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-lg"
                />
                <input
                  id="new-test-code-input"
                  type="text"
                  required
                  placeholder="Code (CBC)"
                  value={newTestCode}
                  onChange={(e) => setNewTestCode(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  id="new-test-price-input"
                  type="number"
                  placeholder="Cost ($45.00)"
                  value={newTestPrice}
                  onChange={(e) => setNewTestPrice(Number(e.target.value))}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-lg"
                />
                <select
                  id="new-test-cat-select"
                  value={newTestCat}
                  onChange={(e) => setNewTestCat(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-lg"
                >
                  <option value="Hematology">Hematology</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Biochemistry">Biochemistry</option>
                  <option value="Cardiology">Cardiology</option>
                </select>
              </div>
              <div className="text-right">
                <button type="submit" className="px-3 py-1 bg-teal-600 text-white text-xs font-bold rounded-lg cursor-pointer">
                  Save Diagnostic
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-3 py-2 text-xs font-semibold text-slate-500 font-mono">Diagnostic Panel</th>
                  <th className="px-3 py-2 text-xs font-semibold text-slate-500 font-mono">Category</th>
                  <th className="px-3 py-2 text-xs font-semibold text-slate-500 font-mono">Code</th>
                  <th className="px-3 py-2 text-xs font-semibold text-slate-500 font-mono text-right">Standard Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicalTests.map((test) => (
                  <tr key={test.id} className="hover:bg-slate-50/20 text-xs">
                    <td className="px-3 py-2.5 font-semibold text-slate-800">{test.name}</td>
                    <td className="px-3 py-2.5 text-slate-500 font-medium">{test.category}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-600 font-bold uppercase">{test.code}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-600">${test.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* System Audit Log and Core Health Status Double Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Master System Audit Log */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-display font-bold text-slate-900 text-base">EHR Master System Audit Logs</h4>
              <p className="text-xs text-slate-400">Chronological history of database actions and practitioner logins.</p>
            </div>
            <Lock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto space-y-3 pr-1">
            {auditLogs.map((log) => (
              <div id={`audit-log-item-${log.id}`} key={log.id} className="pt-3 first:pt-0 flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{log.user}</span>
                    <span className="text-[9px] font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.2 rounded border font-mono uppercase">
                      {log.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-normal font-sans">
                    {log.action}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 font-mono block">{log.timestamp}</span>
                  <span className={`inline-flex items-center text-[8px] font-bold uppercase px-1 py-0.2 rounded mt-1 ${
                    log.type === "Critical" 
                      ? "bg-rose-50 text-rose-600" 
                      : log.type === "Inventory" 
                      ? "bg-amber-50 text-amber-700"
                      : "bg-blue-50 text-blue-700"
                  }`}>
                    {log.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Core Health telemetry status */}
        <div className="bg-slate-900 text-slate-200 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4 relative overflow-hidden">
          {/* Background overlay */}
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="font-display font-bold text-white text-base">System Core Status</h4>
            <Activity className="w-4 h-4 text-teal-400" />
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400 font-semibold uppercase">API Gateway Server Load</span>
                <span className="text-white font-bold">24%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-teal-400 h-full rounded-full" style={{ width: "24%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400 font-semibold uppercase">Decentralized DB Cluster Health</span>
                <span className="text-teal-400 font-bold">98.2%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: "98%" }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">Local Sync Latency</span>
                <span className="text-lg font-bold text-white block mt-0.5">42ms</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">Gateway ping</span>
                <span className="text-lg font-bold text-emerald-400 block mt-0.5">HEALTHY</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
