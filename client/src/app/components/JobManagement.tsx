import { useState } from "react";
import { Search, Filter, Plus, Calendar, User, ChevronDown, Clock, AlertCircle, CheckCircle, Truck } from "lucide-react";

const jobs = [
  { id: "JB-0094", title: "Label Printing - Apex Beverages", client: "Apex Beverages Ltd.", type: "Label Printing", status: "In Progress", priority: "High", due: "Jun 20, 2026", supervisor: "Ramesh Kumar", machine: "PM-3 (Offset)", progress: 65, value: "₹84,500", created: "Jun 15, 2026" },
  { id: "JB-0093", title: "Carton Box - Metro Retail", client: "Metro Retail Group", type: "Carton Box", status: "QC Pending", priority: "Medium", due: "Jun 19, 2026", supervisor: "Suresh Patel", machine: "PM-1 (Offset)", progress: 95, value: "₹1,32,000", created: "Jun 13, 2026" },
  { id: "JB-0092", title: "Flexible Pack - FreshFarm", client: "FreshFarm Foods", type: "Flexible Pack", status: "Completed", priority: "Low", due: "Jun 18, 2026", supervisor: "Anita Singh", machine: "FM-2 (Flexo)", progress: 100, value: "₹67,250", created: "Jun 12, 2026" },
  { id: "JB-0091", title: "Blister Pack - Sunrise Pharma", client: "Sunrise Pharma", type: "Blister Pack", status: "In Progress", priority: "High", due: "Jun 22, 2026", supervisor: "Ramesh Kumar", machine: "BL-1 (Blister)", progress: 40, value: "₹2,18,000", created: "Jun 14, 2026" },
  { id: "JB-0090", title: "Gift Box - Classic Gifts", client: "Classic Gifts Co.", type: "Gift Box", status: "Pending", priority: "Low", due: "Jun 25, 2026", supervisor: "Pradeep Joshi", machine: "Unassigned", progress: 0, value: "₹45,000", created: "Jun 16, 2026" },
  { id: "JB-0089", title: "Corrugated Box - TechPack", client: "TechPack Industries", type: "Corrugated", status: "Dispatched", priority: "Medium", due: "Jun 17, 2026", supervisor: "Suresh Patel", machine: "CM-1 (Corrugated)", progress: 100, value: "₹98,500", created: "Jun 10, 2026" },
  { id: "JB-0088", title: "Shrink Sleeve - Himalaya", client: "Himalaya Naturals", type: "Shrink Sleeve", status: "In Progress", priority: "Medium", due: "Jun 23, 2026", supervisor: "Anita Singh", machine: "DG-2 (Digital)", progress: 30, value: "₹1,55,000", created: "Jun 15, 2026" },
  { id: "JB-0087", title: "Brochure - PrintMart", client: "PrintMart Pvt. Ltd.", type: "Offset Printing", status: "Pending", priority: "Low", due: "Jun 28, 2026", supervisor: "Pradeep Joshi", machine: "Unassigned", progress: 0, value: "₹28,500", created: "Jun 16, 2026" },
];

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
  "Pending": { label: "Pending", bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", icon: <Clock size={12} /> },
  "In Progress": { label: "In Progress", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", icon: <AlertCircle size={12} /> },
  "QC Pending": { label: "QC Pending", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: <AlertCircle size={12} /> },
  "Completed": { label: "Completed", bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: <CheckCircle size={12} /> },
  "Dispatched": { label: "Dispatched", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", icon: <Truck size={12} /> },
};

const priorityColors: Record<string, string> = {
  High: "text-red-600 bg-red-50 border-red-200",
  Medium: "text-amber-600 bg-amber-50 border-amber-200",
  Low: "text-slate-500 bg-slate-50 border-slate-200",
};

const progressColors: Record<string, string> = {
  "Pending": "bg-slate-300",
  "In Progress": "bg-indigo-500",
  "QC Pending": "bg-amber-500",
  "Completed": "bg-green-500",
  "Dispatched": "bg-purple-500",
};

export function JobManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const filtered = jobs.filter(
    (j) =>
      (statusFilter === "All" || j.status === statusFilter) &&
      (j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.client.toLowerCase().includes(search.toLowerCase()) ||
        j.id.includes(search))
  );

  const statusCounts = {
    Pending: jobs.filter((j) => j.status === "Pending").length,
    "In Progress": jobs.filter((j) => j.status === "In Progress").length,
    "QC Pending": jobs.filter((j) => j.status === "QC Pending").length,
    Completed: jobs.filter((j) => j.status === "Completed").length,
    Dispatched: jobs.filter((j) => j.status === "Dispatched").length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Job Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">{jobs.length} total jobs · {statusCounts["In Progress"]} in production</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg text-white transition-colors" style={{ background: "#4f46e5", fontWeight: 500 }}>
          <Plus size={14} /> New Job Order
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {[{ label: "All", count: jobs.length }, ...Object.entries(statusCounts).map(([k, v]) => ({ label: k, count: v }))].map(({ label, count }) => {
          const conf = label !== "All" ? statusConfig[label] : null;
          const active = statusFilter === label;
          return (
            <button
              key={label}
              onClick={() => setStatusFilter(label)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${
                active
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
              style={{ fontWeight: active ? 600 : 400 }}
            >
              {conf && !active && <span className={conf.text}>{conf.icon}</span>}
              {label}
              <span className={`px-1.5 rounded-full text-xs ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`} style={{ fontWeight: 600 }}>
                {count}
              </span>
            </button>
          );
        })}
        <div className="flex-1" />
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs..."
            className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>
        <div className="flex border border-slate-200 rounded-lg overflow-hidden">
          <button onClick={() => setViewMode("card")} className={`px-3 py-1.5 text-xs ${viewMode === "card" ? "bg-slate-100 text-slate-800" : "text-slate-500"}`}>Cards</button>
          <button onClick={() => setViewMode("table")} className={`px-3 py-1.5 text-xs ${viewMode === "table" ? "bg-slate-100 text-slate-800" : "text-slate-500"}`}>Table</button>
        </div>
      </div>

      {viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((job) => {
            const conf = statusConfig[job.status];
            return (
              <div key={job.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="text-indigo-600 text-xs mb-0.5" style={{ fontWeight: 600 }}>{job.id}</p>
                    <p className="text-slate-900 text-sm leading-snug" style={{ fontWeight: 600 }}>{job.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{job.client}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border flex-shrink-0 ${conf.bg} ${conf.text} ${conf.border}`} style={{ fontWeight: 500 }}>
                    {conf.icon} {conf.label}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">Progress</span>
                  <span className="text-xs text-slate-700" style={{ fontWeight: 600 }}>{job.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full transition-all ${progressColors[job.status]}`}
                    style={{ width: `${job.progress}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar size={11} />
                    <span>Due: <span className="text-slate-700">{job.due}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <User size={11} />
                    <span className="text-slate-700 truncate">{job.supervisor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs ${priorityColors[job.priority]}`} style={{ fontWeight: 500 }}>
                    {job.priority} Priority
                  </span>
                  <span className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>{job.value}</span>
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
                  {["Job ID", "Title", "Client", "Type", "Priority", "Due Date", "Supervisor", "Progress", "Status", "Value"].map((h) => (
                    <th key={h} className="text-left text-xs text-slate-500 px-4 py-2.5 whitespace-nowrap" style={{ fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((job) => {
                  const conf = statusConfig[job.status];
                  return (
                    <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-indigo-600 text-xs" style={{ fontWeight: 600 }}>{job.id}</td>
                      <td className="px-4 py-3 text-slate-800 text-xs max-w-[180px] truncate" style={{ fontWeight: 500 }}>{job.title}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{job.client}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{job.type}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-xs border ${priorityColors[job.priority]}`} style={{ fontWeight: 500 }}>{job.priority}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{job.due}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{job.supervisor}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className={`h-full rounded-full ${progressColors[job.status]}`} style={{ width: `${job.progress}%` }} />
                          </div>
                          <span className="text-xs text-slate-600" style={{ fontWeight: 600 }}>{job.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${conf.bg} ${conf.text} ${conf.border}`} style={{ fontWeight: 500 }}>
                          {conf.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-800 text-xs" style={{ fontWeight: 600 }}>{job.value}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
