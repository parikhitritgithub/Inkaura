import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { Factory, Clock, AlertTriangle, CheckCircle, Cpu, TrendingUp, Pause, Play, User, Activity, Scissors, AlertOctagon } from "lucide-react";

const productionQueue = [
  { id: "JB-0095", title: "Corrugated Shipper Box", client: "Amazon India",      machine: "CM-1", operator: "Unassigned",    status: "Queued",     priority: "High",   qty: 5000, progress: 0,  scheduledStart: "2:00 PM", eta: "Tomorrow" },
  { id: "JB-0094", title: "Label Printing 4C",      client: "Apex Beverages",   machine: "PM-3", operator: "Vijay Kumar",   status: "Running",    priority: "High",   qty: 5000, progress: 65, scheduledStart: "8:30 AM", eta: "4:00 PM" },
  { id: "JB-0093", title: "Carton Box Offset",       client: "Metro Retail",     machine: "PM-1", operator: "Rajesh Yadav",  status: "Running",    priority: "Medium", qty: 2000, progress: 95, scheduledStart: "7:00 AM", eta: "12:30 PM" },
  { id: "JB-0092", title: "Flexible Pack Rotogravure", client: "FreshFarm",     machine: "FM-2", operator: "Deepak Singh",  status: "Completed",  priority: "Low",    qty: 10000, progress: 100, scheduledStart: "Yesterday", eta: "Done" },
  { id: "JB-0091", title: "Blister Pack Pharma",    client: "Sunrise Pharma",   machine: "BL-1", operator: "Meera Pillai",  status: "Running",    priority: "High",   qty: 50000, progress: 42, scheduledStart: "7:45 AM", eta: "8:00 PM" },
  { id: "JB-0088", title: "Shrink Sleeve Digital",  client: "Himalaya Naturals", machine: "DG-2", operator: "Sunita Devi",  status: "Running",    priority: "Medium", qty: 10000, progress: 30, scheduledStart: "10:00 AM", eta: "5:30 PM" },
  { id: "JB-0087", title: "Brochure Offset 4C",     client: "PrintMart",         machine: "PM-2", operator: "Unassigned",   status: "Queued",     priority: "Low",    qty: 10000, progress: 0,  scheduledStart: "Tomorrow", eta: "Jun 20" },
  { id: "JB-0086", title: "Corrugated Export Box",   client: "TechPack",          machine: "CM-1", operator: "Arun Sharma",  status: "Delayed",    priority: "Medium", qty: 2000,  progress: 55, scheduledStart: "Yesterday", eta: "3:00 PM" },
];

const hourlyData = [
  { hour: "8am",  output: 1200, target: 1400 },
  { hour: "9am",  output: 1450, target: 1400 },
  { hour: "10am", output: 1380, target: 1400 },
  { hour: "11am", output: 1520, target: 1400 },
  { hour: "12pm", output: 1100, target: 1400 },
  { hour: "1pm",  output: 1350, target: 1400 },
  { hour: "2pm",  output: 1460, target: 1400 },
  { hour: "3pm",  output: 1290, target: 1400 },
];

const machineUtil = [
  { machine: "PM-1", util: 78, oee: 82 },
  { machine: "PM-2", util: 12, oee: 15 },
  { machine: "PM-3", util: 65, oee: 70 },
  { machine: "DG-1", util: 5,  oee: 5  },
  { machine: "DG-2", util: 42, oee: 50 },
  { machine: "FM-2", util: 20, oee: 25 },
  { machine: "BL-1", util: 64, oee: 68 },
  { machine: "CM-1", util: 55, oee: 60 },
];

const oeeData = [
  { metric: "Availability", value: 85, color: "#4f46e5" },
  { metric: "Performance", value: 72, color: "#10b981" },
  { metric: "Quality", value: 96, color: "#f59e0b" },
];

const scrapData = [
  { day: "Mon", scrap: 4.2 },
  { day: "Tue", scrap: 3.8 },
  { day: "Wed", scrap: 5.1 },
  { day: "Thu", scrap: 2.9 },
  { day: "Fri", scrap: 3.4 },
];

const downtimeAlerts = [
  { machine: "DG-1", issue: "Printhead misalignment", time: "45m ago", severity: "High" },
  { machine: "PM-2", issue: "Routine Maintenance", time: "2h ago", severity: "Medium" },
];

const operatorEfficiency = [
  { name: "Vijay Kumar", machine: "PM-3", eff: 94 },
  { name: "Rajesh Yadav", machine: "PM-1", eff: 88 },
  { name: "Meera Pillai", machine: "BL-1", eff: 92 },
];

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  Running:   { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  Queued:    { bg: "bg-slate-100", text: "text-slate-600",  border: "border-slate-200" },
  Completed: { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200" },
  Delayed:   { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200" },
  Paused:    { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200" },
};

const progressColors: Record<string, string> = {
  Running: "bg-indigo-500", Queued: "bg-slate-300", Completed: "bg-green-500", Delayed: "bg-red-400", Paused: "bg-amber-400",
};

const priorityColors: Record<string, string> = {
  High: "text-red-600 bg-red-50 border-red-200",
  Medium: "text-amber-600 bg-amber-50 border-amber-200",
  Low: "text-slate-500 bg-slate-50 border-slate-200",
};

export function ProductionDashboard() {
  const running   = productionQueue.filter((j) => j.status === "Running").length;
  const delayed   = productionQueue.filter((j) => j.status === "Delayed").length;
  const queued    = productionQueue.filter((j) => j.status === "Queued").length;
  const completed = productionQueue.filter((j) => j.status === "Completed").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Production Floor</h1>
          <p className="text-slate-500 text-sm mt-0.5">Live monitoring, OEE, and scrap tracking — Shift A</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Shift Report</button>
          <button className="px-3 py-1.5 text-xs rounded-lg text-white" style={{ background: "#4f46e5", fontWeight: 500 }}>Production Plan</button>
        </div>
      </div>

      {/* Main KPIs including OEE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
          <Activity className="text-indigo-500 mb-2" size={24} />
          <p className="text-slate-900" style={{ fontSize: "1.5rem", fontWeight: 700 }}>78.4%</p>
          <p className="text-slate-500 text-xs" style={{ fontWeight: 600 }}>Overall Equipment Effectiveness (OEE)</p>
          <div className="flex gap-4 mt-3 w-full justify-center">
            {oeeData.map((d) => (
              <div key={d.metric} className="text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{d.metric}</p>
                <p className="text-xs font-semibold" style={{ color: d.color }}>{d.value}%</p>
              </div>
            ))}
          </div>
        </div>

        {[
          { label: "Running Jobs",    value: running,   icon: <Play size={16} />,          color: "text-indigo-600 bg-indigo-50" },
          { label: "Queued Jobs",     value: queued,    icon: <Clock size={16} />,          color: "text-slate-500 bg-slate-100" },
          { label: "Delayed/Halted",  value: delayed,   icon: <AlertTriangle size={16} />,  color: "text-red-600 bg-red-50" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex flex-col justify-center items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${s.color}`}>{s.icon}</div>
            <p className="text-slate-900" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{s.value}</p>
            <p className="text-slate-600 text-xs" style={{ fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hourly Output vs Target */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Hourly Output vs Target</h3>
              <p className="text-slate-400 text-xs mt-0.5">Units produced this shift</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={hourlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
              <Line type="monotone" dataKey="output" stroke="#4f46e5" strokeWidth={3} dot={{ fill: "#4f46e5", r: 4 }} activeDot={{ r: 6 }} name="Output" />
              <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Machine Downtime Alerts & Operator Efficiency */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertOctagon className="text-red-500" size={16} />
              <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Active Downtime Alerts</h3>
            </div>
            <div className="space-y-2">
              {downtimeAlerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg border border-red-100 bg-red-50/50">
                  <Cpu size={14} className="text-red-500 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs font-bold text-red-700">{alert.machine}</span>
                      <span className="text-[10px] text-red-500">{alert.time}</span>
                    </div>
                    <p className="text-xs text-red-600 truncate">{alert.issue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-slate-900 text-sm mb-3" style={{ fontWeight: 600 }}>Top Operator Efficiency</h3>
            <div className="space-y-3">
              {operatorEfficiency.map((op, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-slate-700">{op.name} <span className="text-slate-400 font-normal">({op.machine})</span></span>
                    <span className="text-xs font-bold text-indigo-600">{op.eff}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${op.eff}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Machine Utilization vs OEE */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h3 className="text-slate-900 text-sm mb-4" style={{ fontWeight: 600 }}>Machine Utilization & OEE</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={machineUtil} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="machine" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="util" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Utilization %" barSize={20} />
              <Bar dataKey="oee" fill="#4f46e5" radius={[4, 4, 0, 0]} name="OEE %" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Scrap Rate Tracking */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Scissors className="text-amber-500" size={16} />
            <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Scrap & Rejection Rate</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={scrapData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} formatter={(val: number) => [`${val}%`, "Scrap Rate"]} />
              <Area type="monotone" dataKey="scrap" stroke="#f59e0b" fill="#fef3c7" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Production Queue */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Production Queue</h3>
          <div className="flex items-center gap-3 text-xs">
            {[
              { label: "Running", color: "bg-indigo-500" },
              { label: "Queued",  color: "bg-slate-300" },
              { label: "Delayed", color: "bg-red-400" },
              { label: "Done",    color: "bg-green-500" },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1.5 text-slate-500">
                <span className={`w-2 h-2 rounded-full ${l.color}`} />{l.label}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-border">
                {["Job ID", "Title", "Client", "Machine", "Operator", "Priority", "Qty", "Progress", "ETA", "Status"].map((h) => (
                  <th key={h} className="text-left text-xs text-slate-500 px-4 py-2.5 whitespace-nowrap" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productionQueue.map((job) => {
                const sc = statusConfig[job.status];
                return (
                  <tr key={job.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${job.status === "Delayed" ? "bg-red-50/30" : ""}`}>
                    <td className="px-4 py-3 text-indigo-600 text-xs" style={{ fontWeight: 700 }}>{job.id}</td>
                    <td className="px-4 py-3 text-slate-800 text-xs max-w-[160px] truncate" style={{ fontWeight: 500 }}>{job.title}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{job.client}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">
                      <span className="flex items-center gap-1"><Cpu size={10} /> {job.machine}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">
                      <span className="flex items-center gap-1"><User size={10} /> {job.operator}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-1.5 py-0.5 rounded border text-xs ${priorityColors[job.priority]}`} style={{ fontWeight: 500 }}>{job.priority}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{job.qty.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className={`h-full rounded-full ${progressColors[job.status]}`} style={{ width: `${job.progress}%` }} />
                        </div>
                        <span className="text-xs text-slate-600" style={{ fontWeight: 600 }}>{job.progress}%</span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-xs whitespace-nowrap ${job.status === "Delayed" ? "text-red-600 font-semibold" : "text-slate-500"}`}>{job.eta}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded border text-xs ${sc.bg} ${sc.text} ${sc.border}`} style={{ fontWeight: 500 }}>{job.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
