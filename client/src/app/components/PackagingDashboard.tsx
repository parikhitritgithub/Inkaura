import { useState } from "react";
import { Box, CheckCircle, Clock, AlertTriangle, Truck, Tag, Package, User, Plus, QrCode, Search, ShieldAlert, Archive } from "lucide-react";

const packingJobs = [
  { id: "PKG-0042", jobId: "JB-0093", title: "Carton Box — Metro Retail",    client: "Metro Retail Group",    qty: 2000, unit: "pcs",   material: "Corrugated B-flute", labelType: "Brand Label",  status: "In Progress", packingTeam: "Team A", progress: 65, startTime: "11:00 AM", completionEta: "2:30 PM", labelStatus: "Printing" },
  { id: "PKG-0041", jobId: "JB-0092", title: "Flexible Pack — FreshFarm",    client: "FreshFarm Foods",       qty: 10000, unit: "units", material: "BOPP Bags",          labelType: "Product Label", status: "Completed",   packingTeam: "Team B", progress: 100, startTime: "9:30 AM", completionEta: "Done", labelStatus: "Affixed" },
  { id: "PKG-0040", jobId: "JB-0089", title: "Corrugated Shipper — TechPack", client: "TechPack Industries",  qty: 2000, unit: "boxes",  material: "Corrugated E-flute", labelType: "Shipping Label", status: "Ready",       packingTeam: "Unassigned", progress: 0, startTime: "—", completionEta: "4:00 PM", labelStatus: "Pending Gen." },
  { id: "PKG-0039", jobId: "JB-0088", title: "Shrink Sleeve — Himalaya",     client: "Himalaya Naturals",     qty: 10000, unit: "units", material: "Shrink Film",        labelType: "Shrink Label",  status: "Ready",       packingTeam: "Unassigned", progress: 0, startTime: "—", completionEta: "5:30 PM", labelStatus: "Pending Gen." },
  { id: "PKG-0038", jobId: "JB-0086", title: "Blister Pack — Sunrise",       client: "Sunrise Pharma",        qty: 50000, unit: "strips", material: "PVC Tray + Carton", labelType: "Pharma Label",  status: "QC Hold",     packingTeam: "Team C", progress: 30, startTime: "8:00 AM", completionEta: "Pending QC", labelStatus: "Affixed" },
];

const materialUsage = [
  { material: "Corrugated B-flute Sheet", used: 1200, available: 4800, unit: "sheets", forecastHours: 12 },
  { material: "BOPP Bags 10×14\"",        used: 8500, available: 24000, unit: "pcs", forecastHours: 8 },
  { material: "Shrink Film Roll 30mic",   used: 7,    available: 8, unit: "rolls", forecastHours: 1.5 },
  { material: "Packing Tape (3\")",       used: 42,   available: 48, unit: "rolls", forecastHours: 2 },
  { material: "Strapping Band",           used: 3,    available: 15, unit: "rolls", forecastHours: 36 },
];

const dispatchReady = [
  { id: "JB-0092", client: "FreshFarm Foods",    items: "Flexible Pack (10,000 units)", weight: "45 kg",  pallets: 2, dimensions: "1.2m x 1.0m", stagingArea: "Dock 1" },
  { id: "JB-0086", client: "TechPack Industries", items: "Corrugated Box (2,000 pcs)",  weight: "280 kg", pallets: 8, dimensions: "1.2m x 1.2m", stagingArea: "Dock 3" },
];

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  "In Progress": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  "Completed":   { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200" },
  "Ready":       { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200" },
  "QC Hold":     { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200" },
};

export function PackagingDashboard() {
  const [filter, setFilter] = useState("All");

  const filtered = packingJobs.filter((j) => filter === "All" || j.status === filter);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Packaging & Dispatch</h1>
          <p className="text-slate-500 text-sm mt-0.5">Packing queue, labeling workflow, and dispatch preparation</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <QrCode size={13} /> Batch Barcode Gen
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-white" style={{ background: "#4f46e5", fontWeight: 500 }}>
            <Plus size={13} /> Create Packing Task
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Packing Jobs", value: packingJobs.filter(j => j.status === "In Progress").length, icon: <Box size={16} />, color: "text-indigo-600 bg-indigo-50" },
          { label: "Ready for Packing",   value: packingJobs.filter(j => j.status === "Ready").length,       icon: <Clock size={16} />, color: "text-amber-600 bg-amber-50" },
          { label: "Pending QC Clearance",value: packingJobs.filter(j => j.status === "QC Hold").length,     icon: <ShieldAlert size={16} />, color: "text-red-600 bg-red-50" },
          { label: "Ready for Dispatch",  value: dispatchReady.length,                                        icon: <Truck size={16} />, color: "text-purple-600 bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex flex-col justify-center items-center text-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${s.color}`}>{s.icon}</div>
            <p className="text-slate-900" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{s.value}</p>
            <p className="text-slate-600 text-xs" style={{ fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex border border-slate-200 rounded-lg overflow-hidden w-fit">
        {["All", "Ready", "In Progress", "Completed", "QC Hold"].map((f) => (
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Packing Jobs */}
        <div className="xl:col-span-2 space-y-3">
          {filtered.map((job) => {
            const sc = statusConfig[job.status];
            return (
              <div key={job.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Box size={15} className="text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-indigo-600 text-xs" style={{ fontWeight: 700 }}>{job.id}</p>
                      <p className="text-slate-400 text-xs">· {job.jobId}</p>
                      <span className={`inline-flex px-2 py-0.5 rounded border text-xs ${sc.bg} ${sc.text} ${sc.border}`} style={{ fontWeight: 500 }}>
                        {job.status}
                      </span>
                      {job.labelStatus === "Pending Gen." && (
                        <span className="inline-flex px-2 py-0.5 rounded border text-xs bg-slate-100 text-slate-600 border-slate-200 ml-1">
                          <QrCode size={10} className="mr-1 inline" /> No Labels
                        </span>
                      )}
                    </div>
                    <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>{job.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{job.client} · {job.qty.toLocaleString()} {job.unit}</p>
                  </div>
                </div>

                {job.status === "In Progress" && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500">Packing progress</span>
                      <span className="text-xs text-slate-700" style={{ fontWeight: 600 }}>{job.progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-indigo-500" style={{ width: `${job.progress}%` }} />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-4">
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-slate-400 mb-0.5">Material</p>
                    <p className="text-slate-700 truncate" style={{ fontWeight: 500 }}>{job.material}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-slate-400 mb-0.5">Label Workflow</p>
                    <p className="text-slate-700" style={{ fontWeight: 500 }}>{job.labelStatus}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-slate-400 mb-0.5">Team</p>
                    <p className="text-slate-700" style={{ fontWeight: 500 }}>{job.packingTeam}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-slate-400 mb-0.5">ETA</p>
                    <p className={`${job.status === "QC Hold" ? "text-red-600" : "text-slate-700"}`} style={{ fontWeight: 500 }}>{job.completionEta}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {job.status === "Ready" && job.labelStatus === "Pending Gen." && (
                    <button className="flex-1 flex items-center justify-center gap-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg py-1.5 transition-colors" style={{ fontWeight: 500 }}>
                      <QrCode size={13} /> Generate Labels
                    </button>
                  )}
                  {job.status === "Ready" && job.labelStatus !== "Pending Gen." && (
                    <button className="flex-1 text-xs text-white rounded-lg py-1.5 transition-colors" style={{ background: "#4f46e5", fontWeight: 500 }}>
                      Start Packing
                    </button>
                  )}
                  {job.status === "Completed" && (
                    <button className="flex-1 text-xs text-white bg-purple-600 hover:bg-purple-700 rounded-lg py-1.5 transition-colors" style={{ fontWeight: 500 }}>
                      Move to Dispatch Area
                    </button>
                  )}
                  {job.status === "QC Hold" && (
                    <button className="flex-1 flex justify-center items-center gap-1.5 text-xs text-white bg-red-600 hover:bg-red-700 rounded-lg px-3 py-1.5 transition-colors font-medium">
                      <ShieldAlert size={12} /> Request Manager Override / QC Review
                    </button>
                  )}
                  <button className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Packaging Material Usage */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Archive className="text-amber-600" size={16} />
              <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Material Depletion Forecast</h3>
            </div>
            <div className="space-y-4">
              {materialUsage.map((m) => {
                const pct = Math.round((m.used / (m.used + m.available)) * 100);
                const isCritical = m.forecastHours < 3;
                return (
                  <div key={m.material}>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-xs text-slate-700 font-medium truncate flex-1 mr-2">{m.material}</span>
                      <div className="text-right flex-shrink-0">
                        <span className={`text-[10px] block ${isCritical ? 'text-red-500 font-bold' : 'text-slate-400'}`}>Runs out in ~{m.forecastHours}h</span>
                        <span className="text-[10px] text-slate-500">{m.used} / {m.used + m.available} {m.unit}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full rounded-full ${isCritical ? "bg-red-500" : pct > 75 ? "bg-amber-500" : "bg-indigo-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ready for Dispatch */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-purple-50/50">
              <div className="flex items-center gap-2">
                <Truck className="text-purple-600" size={16} />
                <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Ready for Dispatch</h3>
              </div>
              <span className="text-xs bg-purple-100 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>{dispatchReady.length}</span>
            </div>
            {dispatchReady.map((d) => (
              <div key={d.id} className="p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-indigo-600 text-xs" style={{ fontWeight: 700 }}>{d.id}</p>
                    <p className="text-slate-800 text-xs mt-0.5" style={{ fontWeight: 600 }}>{d.client}</p>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium border border-slate-200">
                    {d.stagingArea}
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-1">{d.items}</p>
                <div className="grid grid-cols-2 gap-2 mt-2 bg-slate-50 rounded p-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5"><Package size={12} className="text-slate-400" /> <span className="font-medium">{d.weight}</span></div>
                  <div className="flex items-center gap-1.5"><Box size={12} className="text-slate-400" /> <span>{d.pallets} pallets</span></div>
                  <div className="col-span-2 flex items-center gap-1.5 text-[10px]"><Tag size={12} className="text-slate-400" /> Dim: {d.dimensions}</div>
                </div>
                <button className="mt-3 w-full text-xs text-white hover:bg-purple-700 rounded-lg py-1.5 transition-colors" style={{ background: "#6d28d9", fontWeight: 500 }}>
                  Assign to Transport
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
