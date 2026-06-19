import { useState } from "react";
import { Cpu, User, CheckCircle, AlertCircle, Truck, Clock, Plus, ChevronRight } from "lucide-react";

const newJobs = [
  { id: "JB-0095", title: "Corrugated Shipper Box", client: "Amazon India", qty: "5,000 units", priority: "High", deadline: "Jun 21, 2026", type: "Corrugated" },
  { id: "JB-0090", title: "Gift Box - Classic Gifts", client: "Classic Gifts Co.", qty: "500 units", priority: "Low", deadline: "Jun 25, 2026", type: "Gift Box" },
  { id: "JB-0087", title: "Brochure Printing", client: "PrintMart Pvt. Ltd.", qty: "10,000 copies", priority: "Low", deadline: "Jun 28, 2026", type: "Offset" },
];

const machineAllocations = [
  { machine: "PM-1 (Offset 4C)", status: "Running", job: "JB-0093", operator: "Rajesh Yadav", speed: "8,400 sph", startTime: "09:00 AM", load: 78 },
  { machine: "PM-2 (Offset 2C)", status: "Idle", job: "—", operator: "Unassigned", speed: "—", startTime: "—", load: 0 },
  { machine: "PM-3 (Offset 4C)", status: "Running", job: "JB-0094", operator: "Vijay Kumar", speed: "7,200 sph", startTime: "08:30 AM", load: 65 },
  { machine: "DG-1 (Digital A3)", status: "Maintenance", job: "—", operator: "—", speed: "—", startTime: "—", load: 0 },
  { machine: "DG-2 (Digital A2)", status: "Running", job: "JB-0088", operator: "Sunita Devi", speed: "120 ppm", startTime: "10:00 AM", load: 30 },
  { machine: "FM-2 (Flexo 6C)", status: "Setup", job: "JB-0091", operator: "Deepak Singh", speed: "—", startTime: "—", load: 0 },
  { machine: "BL-1 (Blister)", status: "Running", job: "JB-0091", operator: "Meera Pillai", speed: "3,200 bpm", startTime: "07:45 AM", load: 45 },
  { machine: "CM-1 (Corrugated)", status: "Idle", job: "—", operator: "Unassigned", speed: "—", startTime: "—", load: 0 },
];

const operators = [
  { name: "Rajesh Yadav", skill: "Offset Printing", assigned: "JB-0093 (PM-1)", shift: "Morning", status: "Active" },
  { name: "Vijay Kumar", skill: "Offset Printing", assigned: "JB-0094 (PM-3)", shift: "Morning", status: "Active" },
  { name: "Sunita Devi", skill: "Digital Printing", assigned: "JB-0088 (DG-2)", shift: "Morning", status: "Active" },
  { name: "Deepak Singh", skill: "Flexo Printing", assigned: "JB-0091 (FM-2)", shift: "Morning", status: "Setup" },
  { name: "Meera Pillai", skill: "Blister Packing", assigned: "JB-0091 (BL-1)", shift: "Morning", status: "Active" },
  { name: "Arun Sharma", skill: "General", assigned: "Unassigned", shift: "Afternoon", status: "Available" },
];

const dispatchReady = [
  { id: "JB-0089", client: "TechPack Industries", items: "Corrugated Box (2,000 pcs)", vehicle: "MH-12 AB 4521", driver: "Ravi Patil", time: "2:00 PM" },
  { id: "JB-0092", client: "FreshFarm Foods", items: "Flexible Pack (10,000 units)", vehicle: "MH-04 CD 8832", driver: "Manoj Tiwari", time: "4:30 PM" },
];

const machineStatusColors: Record<string, string> = {
  Running: "bg-green-50 text-green-700 border-green-200",
  Idle: "bg-slate-100 text-slate-500 border-slate-200",
  Maintenance: "bg-red-50 text-red-700 border-red-200",
  Setup: "bg-amber-50 text-amber-700 border-amber-200",
};

const priorityColors: Record<string, string> = {
  High: "text-red-600 bg-red-50 border-red-200",
  Medium: "text-amber-600 bg-amber-50 border-amber-200",
  Low: "text-slate-500 bg-slate-50 border-slate-200",
};

export function SupervisorDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Supervisor Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Production floor monitoring — Morning Shift</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            Shift Report
          </button>
          <button className="px-3 py-1.5 text-xs rounded-lg text-white transition-colors" style={{ background: "#4f46e5", fontWeight: 500 }}>
            Allocate Job
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Machines Running", value: "3/8", icon: <Cpu size={16} />, color: "text-green-600 bg-green-50" },
          { label: "Operators On Shift", value: "6", icon: <User size={16} />, color: "text-indigo-600 bg-indigo-50" },
          { label: "Jobs In Production", value: "5", icon: <AlertCircle size={16} />, color: "text-amber-600 bg-amber-50" },
          { label: "Ready for Dispatch", value: "2", icon: <Truck size={16} />, color: "text-purple-600 bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
            <p className="text-slate-900 mb-0.5" style={{ fontSize: "1.25rem", fontWeight: 700 }}>{s.value}</p>
            <p className="text-slate-600 text-xs" style={{ fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* New Jobs Queue */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>New Jobs Queue</h3>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>{newJobs.length}</span>
          </div>
          <div className="divide-y divide-slate-50">
            {newJobs.map((job) => (
              <div key={job.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-indigo-600 text-xs" style={{ fontWeight: 600 }}>{job.id}</p>
                    <p className="text-slate-800 text-xs mt-0.5" style={{ fontWeight: 600 }}>{job.title}</p>
                    <p className="text-slate-500 text-xs">{job.client}</p>
                  </div>
                  <span className={`inline-flex px-2 py-0.5 rounded border text-xs flex-shrink-0 ${priorityColors[job.priority]}`} style={{ fontWeight: 500 }}>
                    {job.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{job.qty}</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {job.deadline}</span>
                </div>
                <button className="mt-2 w-full text-xs text-indigo-600 border border-indigo-200 rounded-lg py-1 hover:bg-indigo-50 transition-colors" style={{ fontWeight: 500 }}>
                  Assign to Machine
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Machine Allocation */}
        <div className="xl:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Machine Allocation</h3>
            <button className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">View all <ChevronRight size={12} /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-border">
                  {["Machine", "Status", "Job", "Operator", "Speed", "Load"].map((h) => (
                    <th key={h} className="text-left text-xs text-slate-500 px-4 py-2.5 whitespace-nowrap" style={{ fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {machineAllocations.map((m) => (
                  <tr key={m.machine} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-2.5 text-slate-800 text-xs" style={{ fontWeight: 500 }}>{m.machine}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex px-2 py-0.5 rounded border text-xs ${machineStatusColors[m.status]}`} style={{ fontWeight: 500 }}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-indigo-600" style={{ fontWeight: m.job !== "—" ? 600 : 400 }}>{m.job}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">{m.operator}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-500">{m.speed}</td>
                    <td className="px-4 py-2.5">
                      {m.load > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${m.load}%` }} />
                          </div>
                          <span className="text-xs text-slate-600" style={{ fontWeight: 600 }}>{m.load}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Operators */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Operator Assignments</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {operators.map((op) => (
              <div key={op.name} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs flex-shrink-0" style={{ fontWeight: 600 }}>
                  {op.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 text-xs" style={{ fontWeight: 600 }}>{op.name}</p>
                  <p className="text-slate-400 text-xs truncate">{op.skill} · {op.assigned}</p>
                </div>
                <span className={`inline-flex px-2 py-0.5 rounded text-xs border flex-shrink-0 ${
                  op.status === "Active" ? "bg-green-50 text-green-700 border-green-200" :
                  op.status === "Available" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                  "bg-amber-50 text-amber-700 border-amber-200"
                }`} style={{ fontWeight: 500 }}>{op.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dispatch Ready */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Ready for Dispatch</h3>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>{dispatchReady.length} orders</span>
          </div>
          <div className="divide-y divide-slate-50">
            {dispatchReady.map((d) => (
              <div key={d.id} className="p-5 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-indigo-600 text-xs" style={{ fontWeight: 600 }}>{d.id}</p>
                    <p className="text-slate-800 text-xs mt-0.5" style={{ fontWeight: 600 }}>{d.client}</p>
                    <p className="text-slate-500 text-xs">{d.items}</p>
                  </div>
                  <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-xs" style={{ fontWeight: 500 }}>
                    {d.time}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1"><Truck size={10} /> {d.vehicle}</span>
                  <span className="flex items-center gap-1"><User size={10} /> {d.driver}</span>
                </div>
                <button className="w-full text-xs text-white rounded-lg py-1.5 transition-colors" style={{ background: "#6d28d9", fontWeight: 500 }}>
                  Confirm Dispatch
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
