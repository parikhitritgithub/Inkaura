import { useState } from "react";
import { CheckCircle, XCircle, Clock, AlertTriangle, Eye, X } from "lucide-react";

const pendingInspections = [
  { id: "JB-0093", title: "Carton Box - Metro Retail", client: "Metro Retail Group", type: "Offset 4C", qty: 2000, supervisor: "Suresh Patel", completedAt: "11:45 AM", priority: "Medium" },
  { id: "JB-0088", title: "Shrink Sleeve - Himalaya", client: "Himalaya Naturals", type: "Digital Print", qty: 10000, supervisor: "Anita Singh", completedAt: "02:15 PM", priority: "Medium" },
  { id: "JB-0086", title: "Pharma Leaflet - MedCore", client: "MedCore India", type: "Offset 2C", qty: 50000, supervisor: "Ramesh Kumar", completedAt: "03:30 PM", priority: "High" },
];

const completedInspections = [
  { id: "JB-0092", title: "Flexible Pack - FreshFarm", result: "Approved", inspector: "Deepa Nair", inspectedAt: "10:30 AM", issues: 0 },
  { id: "JB-0089", title: "Corrugated Box - TechPack", result: "Approved", inspector: "Deepa Nair", inspectedAt: "Yesterday 04:15 PM", issues: 0 },
  { id: "JB-0085", title: "Gift Box - Classic Gifts", result: "Rejected", inspector: "Deepa Nair", inspectedAt: "Yesterday 02:00 PM", issues: 3 },
];

const checklistItems = [
  { id: "c1", label: "Print registration within ±0.1mm tolerance", category: "Registration" },
  { id: "c2", label: "Color density matches approved proof (±0.05 D)", category: "Color" },
  { id: "c3", label: "No visible hickeys, spots, or mottling", category: "Print Quality" },
  { id: "c4", label: "Lamination — no bubbles, wrinkles, or peeling", category: "Finishing" },
  { id: "c5", label: "Cutting/die size within ±0.5mm tolerance", category: "Cutting" },
  { id: "c6", label: "Barcode scan — 100% scannable (ISO 15416 grade B+)", category: "Barcode" },
  { id: "c7", label: "Text legibility — all text readable at minimum size", category: "Content" },
  { id: "c8", label: "Quantity count verified (±1% tolerance)", category: "Quantity" },
  { id: "c9", label: "No scuffs, scratches, or contamination", category: "Appearance" },
  { id: "c10", label: "Packaging and bundling as per specification", category: "Packing" },
];

interface InspectionModalProps {
  job: typeof pendingInspections[0];
  onClose: () => void;
}

function InspectionModal({ job, onClose }: InspectionModalProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [remarks, setRemarks] = useState("");
  const [decision, setDecision] = useState<"" | "approve" | "reject">("");

  const allChecked = checklistItems.every((item) => checked[item.id] !== undefined);
  const passCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>QC Inspection — {job.id}</h2>
            <p className="text-slate-400 text-xs mt-0.5">{job.title} · {job.client}</p>
          </div>
          <button onClick={onClose}><X size={18} className="text-slate-400 hover:text-slate-600" /></button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-3 text-xs">
            {[["Job Type", job.type], ["Qty", `${job.qty.toLocaleString()} units`], ["Supervisor", job.supervisor]].map(([l, v]) => (
              <div key={l} className="bg-slate-50 rounded-lg p-2.5">
                <p className="text-slate-400 mb-0.5">{l}</p>
                <p className="text-slate-800" style={{ fontWeight: 600 }}>{v}</p>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-800 text-xs" style={{ fontWeight: 700 }}>QC Checklist ({passCount}/{checklistItems.length} items checked)</h3>
              <div className="h-1.5 w-24 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${(passCount / checklistItems.length) * 100}%` }} />
              </div>
            </div>
            <div className="space-y-1.5">
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
                  <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                    <button
                      onClick={() => setChecked((p) => ({ ...p, [item.id]: true }))}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${checked[item.id] === true ? "bg-green-500 border-green-500 text-white" : "border-slate-200 hover:border-green-300"}`}
                    >
                      <CheckCircle size={13} />
                    </button>
                    <button
                      onClick={() => setChecked((p) => ({ ...p, [item.id]: false }))}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${checked[item.id] === false ? "bg-red-500 border-red-500 text-white" : "border-slate-200 hover:border-red-300"}`}
                    >
                      <XCircle size={13} />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 text-xs leading-relaxed">{item.label}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{item.category}</p>
                  </div>
                  {checked[item.id] !== undefined && (
                    <span className={`text-xs ${checked[item.id] ? "text-green-600" : "text-red-600"}`} style={{ fontWeight: 500 }}>
                      {checked[item.id] ? "Pass" : "Fail"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Inspector Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none"
              rows={2}
              placeholder="Add inspection notes..."
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setDecision("approve")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all ${decision === "approve" ? "bg-green-600 text-white" : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"}`}
              style={{ fontWeight: 600 }}
            >
              <CheckCircle size={16} /> Approve Job
            </button>
            <button
              onClick={() => setDecision("reject")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all ${decision === "reject" ? "bg-red-600 text-white" : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"}`}
              style={{ fontWeight: 600 }}
            >
              <XCircle size={16} /> Reject & Rework
            </button>
          </div>
          {decision && (
            <button className="w-full py-2.5 rounded-xl text-sm text-white bg-slate-800 hover:bg-slate-900 transition-colors" style={{ fontWeight: 600 }}>
              Submit QC Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function QualityControl() {
  const [inspecting, setInspecting] = useState<typeof pendingInspections[0] | null>(null);

  return (
    <div className="p-6 space-y-6">
      {inspecting && <InspectionModal job={inspecting} onClose={() => setInspecting(null)} />}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Quality Control</h1>
          <p className="text-slate-500 text-sm mt-0.5">Inspector: Deepa Nair · {pendingInspections.length} pending inspections</p>
        </div>
        <button className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
          QC Reports
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pending Inspections", value: pendingInspections.length, icon: <Clock size={16} />, color: "text-amber-600 bg-amber-50" },
          { label: "Approved Today", value: 2, icon: <CheckCircle size={16} />, color: "text-green-600 bg-green-50" },
          { label: "Rejected / Rework", value: 1, icon: <XCircle size={16} />, color: "text-red-600 bg-red-50" },
          { label: "Approval Rate (MTD)", value: "94.2%", icon: <AlertTriangle size={16} />, color: "text-indigo-600 bg-indigo-50" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
            <p className="text-slate-900 mb-0.5" style={{ fontSize: "1.25rem", fontWeight: 700 }}>{s.value}</p>
            <p className="text-slate-600 text-xs" style={{ fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Pending Inspections */}
        <div className="bg-card border border-amber-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-amber-100 bg-amber-50/50">
            <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Pending Inspections</h3>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>{pendingInspections.length} jobs</span>
          </div>
          <div className="divide-y divide-slate-50">
            {pendingInspections.map((job) => (
              <div key={job.id} className="p-5 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-indigo-600 text-xs" style={{ fontWeight: 600 }}>{job.id}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded border ${job.priority === "High" ? "bg-red-50 text-red-700 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200"}`} style={{ fontWeight: 500 }}>
                        {job.priority}
                      </span>
                    </div>
                    <p className="text-slate-800 text-xs" style={{ fontWeight: 600 }}>{job.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{job.client} · {job.type} · {job.qty.toLocaleString()} units</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-slate-400 text-xs">Completed</p>
                    <p className="text-slate-700 text-xs" style={{ fontWeight: 600 }}>{job.completedAt}</p>
                  </div>
                </div>
                <button
                  onClick={() => setInspecting(job)}
                  className="w-full flex items-center justify-center gap-1.5 text-xs text-indigo-600 border border-indigo-200 rounded-lg py-2 hover:bg-indigo-50 transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  <Eye size={12} /> Start Inspection
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Inspections */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Recent QC Results</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {completedInspections.map((ins) => (
              <div key={ins.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ins.result === "Approved" ? "bg-green-50" : "bg-red-50"}`}>
                  {ins.result === "Approved" ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <XCircle size={16} className="text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-indigo-600 text-xs" style={{ fontWeight: 600 }}>{ins.id}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${ins.result === "Approved" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`} style={{ fontWeight: 500 }}>
                      {ins.result}
                    </span>
                  </div>
                  <p className="text-slate-700 text-xs mt-0.5" style={{ fontWeight: 500 }}>{ins.title}</p>
                  <p className="text-slate-400 text-xs">By {ins.inspector} · {ins.inspectedAt}</p>
                </div>
                {ins.issues > 0 && (
                  <span className="text-xs text-red-600 flex-shrink-0" style={{ fontWeight: 600 }}>{ins.issues} issues</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
