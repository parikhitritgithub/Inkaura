import { useState } from "react";
import { Cog, AlertTriangle, CheckCircle, Clock, Wrench, Activity, Calendar, Plus, ChevronRight } from "lucide-react";

const machines = [
  {
    id: "PM-1", name: "Heidelberg SM 52", type: "Offset 4C", location: "Hall A",
    status: "Running", currentJob: "JB-0093", operator: "Rajesh Yadav",
    speed: 8400, maxSpeed: 15000, unit: "sph",
    utilization: 78, uptime: 92, hoursToday: 6.5,
    lastMaintenance: "Jun 5, 2026", nextMaintenance: "Jul 5, 2026",
    totalJobs: 312, maintenanceAlert: false,
  },
  {
    id: "PM-2", name: "Komori LS 29", type: "Offset 2C", location: "Hall A",
    status: "Idle", currentJob: null, operator: "Unassigned",
    speed: 0, maxSpeed: 12000, unit: "sph",
    utilization: 0, uptime: 88, hoursToday: 0,
    lastMaintenance: "May 28, 2026", nextMaintenance: "Jun 28, 2026",
    totalJobs: 198, maintenanceAlert: true,
  },
  {
    id: "PM-3", name: "Heidelberg SM 74", type: "Offset 4C", location: "Hall A",
    status: "Running", currentJob: "JB-0094", operator: "Vijay Kumar",
    speed: 7200, maxSpeed: 15000, unit: "sph",
    utilization: 65, uptime: 95, hoursToday: 7.2,
    lastMaintenance: "Jun 10, 2026", nextMaintenance: "Jul 10, 2026",
    totalJobs: 287, maintenanceAlert: false,
  },
  {
    id: "DG-1", name: "HP Indigo 7900", type: "Digital A3+", location: "Hall B",
    status: "Maintenance", currentJob: null, operator: "—",
    speed: 0, maxSpeed: 2700, unit: "sph",
    utilization: 0, uptime: 72, hoursToday: 0,
    lastMaintenance: "Jun 17, 2026", nextMaintenance: "Jun 24, 2026",
    totalJobs: 145, maintenanceAlert: false,
  },
  {
    id: "DG-2", name: "Xerox Versant 280", type: "Digital A2", location: "Hall B",
    status: "Running", currentJob: "JB-0088", operator: "Sunita Devi",
    speed: 120, maxSpeed: 280, unit: "ppm",
    utilization: 42, uptime: 90, hoursToday: 3.5,
    lastMaintenance: "Jun 1, 2026", nextMaintenance: "Jul 1, 2026",
    totalJobs: 523, maintenanceAlert: false,
  },
  {
    id: "FM-2", name: "Mark Andy 2200", type: "Flexo 6C", location: "Hall C",
    status: "Setup", currentJob: "JB-0091", operator: "Deepak Singh",
    speed: 0, maxSpeed: 4800, unit: "fpm",
    utilization: 0, uptime: 85, hoursToday: 1.5,
    lastMaintenance: "Jun 8, 2026", nextMaintenance: "Jul 8, 2026",
    totalJobs: 94, maintenanceAlert: false,
  },
  {
    id: "BL-1", name: "Uhlmann Blister B1280", type: "Blister Line", location: "Hall C",
    status: "Running", currentJob: "JB-0091", operator: "Meera Pillai",
    speed: 3200, maxSpeed: 5000, unit: "bpm",
    utilization: 64, uptime: 88, hoursToday: 5.0,
    lastMaintenance: "Jun 3, 2026", nextMaintenance: "Jul 3, 2026",
    totalJobs: 67, maintenanceAlert: false,
  },
  {
    id: "CM-1", name: "BOBST FFG 618", type: "Corrugated", location: "Hall D",
    status: "Idle", currentJob: null, operator: "Unassigned",
    speed: 0, maxSpeed: 8000, unit: "bph",
    utilization: 0, uptime: 82, hoursToday: 0,
    lastMaintenance: "May 20, 2026", nextMaintenance: "Jun 20, 2026",
    totalJobs: 42, maintenanceAlert: true,
  },
];

const maintenanceLog = [
  { machine: "PM-2", type: "Preventive", date: "Jun 28, 2026", notes: "Ink system flush, roller cleaning", assignedTo: "Arun Sharma" },
  { machine: "CM-1", type: "Overdue",    date: "Jun 20, 2026", notes: "Belt inspection, lubrication", assignedTo: "Deepak Singh" },
  { machine: "DG-1", type: "Corrective", date: "Jun 17, 2026", notes: "Printhead alignment correction", assignedTo: "Service Engineer" },
  { machine: "PM-3", type: "Preventive", date: "Jul 10, 2026", notes: "Monthly blanket wash + calibration", assignedTo: "Vijay Kumar" },
];

const statusColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Running:     { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
  Idle:        { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" },
  Maintenance: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  Breakdown:   { bg: "bg-red-50",   text: "text-red-700",   border: "border-red-200",   dot: "bg-red-500" },
  Setup:       { bg: "bg-sky-50",   text: "text-sky-700",   border: "border-sky-200",   dot: "bg-sky-500" },
};

export function MachineManagement() {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [filter, setFilter] = useState("All");

  const filtered = machines.filter((m) => filter === "All" || m.status === filter);
  const running   = machines.filter((m) => m.status === "Running").length;
  const alerts    = machines.filter((m) => m.maintenanceAlert).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Machine Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Fleet of {machines.length} machines · {running} currently running</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            Schedule Maintenance
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-white" style={{ background: "#4f46e5", fontWeight: 500 }}>
            <Plus size={13} /> Add Machine
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Running",           value: running,                                                   icon: <Activity size={16} />,     color: "text-green-600 bg-green-50" },
          { label: "Idle / Setup",      value: machines.filter(m => m.status === "Idle" || m.status === "Setup").length, icon: <Clock size={16} />, color: "text-slate-500 bg-slate-100" },
          { label: "Under Maintenance", value: machines.filter(m => m.status === "Maintenance").length,  icon: <Wrench size={16} />,       color: "text-amber-600 bg-amber-50" },
          { label: "Maintenance Alerts",value: alerts,                                                    icon: <AlertTriangle size={16} />, color: "text-red-600 bg-red-50" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
            <p className="text-slate-900 mb-0.5" style={{ fontSize: "1.25rem", fontWeight: 700 }}>{s.value}</p>
            <p className="text-slate-600 text-xs" style={{ fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters + view toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex border border-slate-200 rounded-lg overflow-hidden">
          {["All", "Running", "Idle", "Maintenance", "Setup"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs transition-colors ${filter === f ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
              style={{ fontWeight: filter === f ? 600 : 400 }}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex border border-slate-200 rounded-lg overflow-hidden">
          <button onClick={() => setView("grid")} className={`px-3 py-1.5 text-xs ${view === "grid" ? "bg-slate-100 text-slate-800" : "text-slate-500"}`}>Grid</button>
          <button onClick={() => setView("table")} className={`px-3 py-1.5 text-xs ${view === "table" ? "bg-slate-100 text-slate-800" : "text-slate-500"}`}>Table</button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {filtered.map((m) => {
            const sc = statusColors[m.status];
            return (
              <div key={m.id} className={`bg-card border rounded-xl p-4 ${m.maintenanceAlert ? "border-red-200" : "border-border"}`}>
                {m.maintenanceAlert && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded-lg mb-3">
                    <AlertTriangle size={11} /> Maintenance overdue!
                  </div>
                )}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>{m.id}</p>
                    <p className="text-slate-500 text-xs">{m.name}</p>
                    <p className="text-slate-400 text-xs">{m.type} · {m.location}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-xs flex-shrink-0 ${sc.bg} ${sc.text} ${sc.border}`} style={{ fontWeight: 500 }}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {m.status}
                  </span>
                </div>

                {/* Utilization */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">Utilization</span>
                    <span className="text-xs text-slate-700" style={{ fontWeight: 600 }}>{m.utilization}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${m.utilization > 70 ? "bg-green-500" : m.utilization > 30 ? "bg-amber-500" : "bg-slate-300"}`}
                      style={{ width: `${m.utilization}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-slate-400">Current Job</p>
                    <p className="text-indigo-600" style={{ fontWeight: 600 }}>{m.currentJob ?? "—"}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-slate-400">Uptime (Month)</p>
                    <p className="text-slate-700" style={{ fontWeight: 600 }}>{m.uptime}%</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-slate-400">Speed</p>
                    <p className="text-slate-700" style={{ fontWeight: 600 }}>{m.speed > 0 ? `${m.speed.toLocaleString()} ${m.unit}` : "—"}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-slate-400">Hours Today</p>
                    <p className="text-slate-700" style={{ fontWeight: 600 }}>{m.hoursToday}h</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                  <Calendar size={10} />
                  <span>Next PM: <span className="text-slate-700" style={{ fontWeight: 500 }}>{m.nextMaintenance}</span></span>
                </div>

                <div className="flex gap-1.5">
                  <button className="flex-1 text-xs border border-slate-200 rounded-lg py-1.5 text-slate-600 hover:bg-slate-50 transition-colors">Details</button>
                  <button className="flex-1 text-xs border border-amber-200 rounded-lg py-1.5 text-amber-700 hover:bg-amber-50 transition-colors">Schedule PM</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-border">
                  {["ID", "Machine", "Type", "Status", "Current Job", "Operator", "Utilization", "Uptime", "Next PM", "Alerts"].map((h) => (
                    <th key={h} className="text-left text-xs text-slate-500 px-4 py-2.5 whitespace-nowrap" style={{ fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const sc = statusColors[m.status];
                  return (
                    <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-indigo-600 text-xs" style={{ fontWeight: 700 }}>{m.id}</td>
                      <td className="px-4 py-3">
                        <p className="text-slate-800 text-xs" style={{ fontWeight: 600 }}>{m.name}</p>
                        <p className="text-slate-400 text-xs">{m.location}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{m.type}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-xs ${sc.bg} ${sc.text} ${sc.border}`} style={{ fontWeight: 500 }}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{m.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-indigo-600 text-xs" style={{ fontWeight: m.currentJob ? 600 : 400 }}>{m.currentJob ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{m.operator}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-14 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className={`h-full rounded-full ${m.utilization > 70 ? "bg-green-500" : m.utilization > 30 ? "bg-amber-500" : "bg-slate-300"}`} style={{ width: `${m.utilization}%` }} />
                          </div>
                          <span className="text-xs text-slate-600" style={{ fontWeight: 600 }}>{m.utilization}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs" style={{ fontWeight: 500 }}>{m.uptime}%</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{m.nextMaintenance}</td>
                      <td className="px-4 py-3">
                        {m.maintenanceAlert ? (
                          <span className="text-xs text-red-600 flex items-center gap-1"><AlertTriangle size={10} /> Overdue</span>
                        ) : (
                          <span className="text-xs text-green-600">OK</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Maintenance Schedule */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Maintenance Schedule</h3>
          <button className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1" style={{ fontWeight: 500 }}>
            Full calendar <ChevronRight size={12} />
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {maintenanceLog.map((log, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${log.type === "Overdue" ? "bg-red-50 text-red-600" : log.type === "Corrective" ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"}`}>
                <Wrench size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-indigo-600 text-xs" style={{ fontWeight: 600 }}>{log.machine}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${log.type === "Overdue" ? "bg-red-50 text-red-700" : log.type === "Corrective" ? "bg-amber-50 text-amber-700" : "bg-indigo-50 text-indigo-700"}`} style={{ fontWeight: 500 }}>
                    {log.type}
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-0.5">{log.notes}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-slate-700 text-xs" style={{ fontWeight: 500 }}>{log.date}</p>
                <p className="text-slate-400 text-xs">{log.assignedTo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
