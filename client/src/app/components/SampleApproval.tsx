import { useState } from "react";
import {
  FlaskConical, CheckCircle, XCircle, Clock, AlertTriangle,
  Eye, RotateCcw, Send, User, Calendar, X, ChevronRight
} from "lucide-react";

type SampleStatus = "Generating" | "QC Pending" | "QC Approved" | "Sent to Customer" | "Customer Approved" | "Rework Required" | "Rejected";

const samples = [
  {
    id: "SMP-0018", jobId: "JB-0094", title: "Label Printing — Apex Beverages",
    client: "Apex Beverages Ltd.", type: "Label (4C Offset)", qty: "5,000 units",
    supervisor: "Ramesh Kumar", createdAt: "Jun 17, 2026",
    status: "QC Pending" as SampleStatus, priority: "High",
    qcChecklist: { colorAccuracy: null, registration: null, finishing: null, sizeSpec: null, barcode: null },
    customerContact: "Rajiv Sharma", history: [],
  },
  {
    id: "SMP-0017", jobId: "JB-0091", title: "Blister Pack — Sunrise Pharma",
    client: "Sunrise Pharma", type: "Blister (PVC + Alu Foil)", qty: "50,000 strips",
    supervisor: "Anita Singh", createdAt: "Jun 16, 2026",
    status: "Sent to Customer" as SampleStatus, priority: "High",
    qcChecklist: { colorAccuracy: true, registration: true, finishing: true, sizeSpec: true, barcode: true },
    customerContact: "Sunita Kapoor", history: [
      { action: "QC Approved", by: "Deepa Nair", at: "Jun 16, 9:30 AM" },
      { action: "Sent to Customer", by: "Ramesh Kumar", at: "Jun 16, 11:00 AM" },
    ],
  },
  {
    id: "SMP-0016", jobId: "JB-0088", title: "Shrink Sleeve — Himalaya Naturals",
    client: "Himalaya Naturals", type: "Shrink Sleeve (Digital)", qty: "10,000 units",
    supervisor: "Suresh Patel", createdAt: "Jun 15, 2026",
    status: "Customer Approved" as SampleStatus, priority: "Medium",
    qcChecklist: { colorAccuracy: true, registration: true, finishing: true, sizeSpec: true, barcode: true },
    customerContact: "Arjun Pillai", history: [
      { action: "QC Approved",       by: "Deepa Nair",      at: "Jun 15, 10:00 AM" },
      { action: "Sent to Customer",  by: "Priya Nair (Sales)", at: "Jun 15, 12:30 PM" },
      { action: "Customer Approved", by: "Arjun Pillai (Client)", at: "Jun 16, 2:00 PM" },
    ],
  },
  {
    id: "SMP-0015", jobId: "JB-0087", title: "Brochure — PrintMart",
    client: "PrintMart Pvt. Ltd.", type: "Offset 4C Brochure", qty: "10,000 copies",
    supervisor: "Pradeep Joshi", createdAt: "Jun 15, 2026",
    status: "Rework Required" as SampleStatus, priority: "Low",
    qcChecklist: { colorAccuracy: false, registration: true, finishing: true, sizeSpec: true, barcode: null },
    customerContact: "Kavita Joshi", history: [
      { action: "QC Failed — Color accuracy issue (Cyan +0.12D)", by: "Deepa Nair", at: "Jun 15, 3:00 PM" },
    ],
  },
  {
    id: "SMP-0014", jobId: "JB-0085", title: "Gift Box — Classic Gifts",
    client: "Classic Gifts Co.", type: "Premium Gift Box", qty: "500 pcs",
    supervisor: "Ramesh Kumar", createdAt: "Jun 14, 2026",
    status: "Generating" as SampleStatus, priority: "Low",
    qcChecklist: { colorAccuracy: null, registration: null, finishing: null, sizeSpec: null, barcode: null },
    customerContact: "Mohit Gupta", history: [],
  },
];

const qcChecklistLabels: Record<string, string> = {
  colorAccuracy: "Color accuracy (±0.05D)",
  registration:  "Print registration (±0.1mm)",
  finishing:     "Lamination / finishing quality",
  sizeSpec:      "Size & die specifications",
  barcode:       "Barcode readability (ISO B+)",
};

const statusConfig: Record<SampleStatus, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  "Generating":         { bg: "bg-slate-100",    text: "text-slate-600",    border: "border-slate-200",   icon: <Clock size={11} /> },
  "QC Pending":         { bg: "bg-amber-50",     text: "text-amber-700",    border: "border-amber-200",   icon: <AlertTriangle size={11} /> },
  "QC Approved":        { bg: "bg-indigo-50",    text: "text-indigo-700",   border: "border-indigo-200",  icon: <CheckCircle size={11} /> },
  "Sent to Customer":   { bg: "bg-sky-50",       text: "text-sky-700",      border: "border-sky-200",     icon: <Send size={11} /> },
  "Customer Approved":  { bg: "bg-green-50",     text: "text-green-700",    border: "border-green-200",   icon: <CheckCircle size={11} /> },
  "Rework Required":    { bg: "bg-red-50",        text: "text-red-700",     border: "border-red-200",     icon: <RotateCcw size={11} /> },
  "Rejected":           { bg: "bg-red-100",      text: "text-red-800",     border: "border-red-300",     icon: <XCircle size={11} /> },
};

function SampleCard({ sample }: { sample: typeof samples[0] }) {
  const [expanded, setExpanded] = useState(false);
  const [qc, setQc] = useState<Record<string, boolean | null>>(sample.qcChecklist);
  const conf = statusConfig[sample.status];

  const passCount = Object.values(qc).filter((v) => v === true).length;
  const totalCount = Object.values(qc).filter((v) => v !== null).length;

  return (
    <div className={`bg-card border rounded-xl overflow-hidden transition-all ${sample.status === "QC Pending" ? "border-amber-200" : sample.status === "Rework Required" ? "border-red-200" : sample.status === "Customer Approved" ? "border-green-200" : "border-border"}`}>
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <FlaskConical size={16} className="text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-indigo-600 text-xs" style={{ fontWeight: 700 }}>{sample.id}</p>
            <span className="text-slate-300">·</span>
            <p className="text-slate-500 text-xs">{sample.jobId}</p>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs ${conf.bg} ${conf.text} ${conf.border}`} style={{ fontWeight: 500 }}>
              {conf.icon} {sample.status}
            </span>
            {sample.priority === "High" && (
              <span className="text-xs text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded" style={{ fontWeight: 500 }}>High Priority</span>
            )}
          </div>
          <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>{sample.title}</p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-xs text-slate-500 flex items-center gap-1"><User size={10} /> {sample.client}</span>
            <span className="text-xs text-slate-500">{sample.type}</span>
            <span className="text-xs text-slate-500">{sample.qty}</span>
            <span className="text-xs text-slate-500 flex items-center gap-1"><Calendar size={10} /> {sample.createdAt}</span>
          </div>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0">
          <ChevronRight size={16} className={`transition-transform ${expanded ? "rotate-90" : ""}`} />
        </button>
      </div>

      {/* Expandable QC section */}
      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-4 space-y-4">
          {/* QC Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-700" style={{ fontWeight: 600 }}>QC Checklist</p>
              {totalCount > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded ${passCount === totalCount && totalCount === 5 ? "text-green-600 bg-green-50" : "text-amber-600 bg-amber-50"}`} style={{ fontWeight: 600 }}>
                  {passCount} / {Object.keys(qc).length} passed
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              {Object.entries(qcChecklistLabels).map(([key, label]) => (
                <div key={key} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setQc((p) => ({ ...p, [key]: true }))}
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs border transition-all ${qc[key] === true ? "bg-green-500 border-green-500 text-white" : "border-slate-200 text-slate-300 hover:border-green-300"}`}
                    >✓</button>
                    <button
                      onClick={() => setQc((p) => ({ ...p, [key]: false }))}
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs border transition-all ${qc[key] === false ? "bg-red-500 border-red-500 text-white" : "border-slate-200 text-slate-300 hover:border-red-300"}`}
                    >✗</button>
                  </div>
                  <span className="flex-1 text-xs text-slate-700">{label}</span>
                  {qc[key] !== null && (
                    <span className={`text-xs ${qc[key] ? "text-green-600" : "text-red-600"}`} style={{ fontWeight: 500 }}>
                      {qc[key] ? "Pass" : "Fail"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          {sample.history.length > 0 && (
            <div>
              <p className="text-xs text-slate-700 mb-2" style={{ fontWeight: 600 }}>Approval History</p>
              <div className="space-y-1.5">
                {sample.history.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-slate-700" style={{ fontWeight: 500 }}>{h.action}</span>
                      <span className="text-slate-400"> · {h.by} · {h.at}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            {sample.status === "QC Pending" && (
              <>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors" style={{ fontWeight: 500 }}>
                  <CheckCircle size={12} /> Approve QC
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors" style={{ fontWeight: 500 }}>
                  <RotateCcw size={12} /> Request Rework
                </button>
              </>
            )}
            {sample.status === "QC Approved" && (
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-lg transition-colors" style={{ background: "#4f46e5", fontWeight: 500 }}>
                <Send size={12} /> Send to Customer
              </button>
            )}
            {sample.status === "Sent to Customer" && (
              <>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors" style={{ fontWeight: 500 }}>
                  <CheckCircle size={12} /> Mark Customer Approved
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors" style={{ fontWeight: 500 }}>
                  <RotateCcw size={12} /> Request Changes
                </button>
              </>
            )}
            {sample.status === "Customer Approved" && (
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-lg transition-colors" style={{ background: "#4f46e5", fontWeight: 500 }}>
                <ChevronRight size={12} /> Proceed to Production
              </button>
            )}
            {sample.status === "Rework Required" && (
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors" style={{ fontWeight: 500 }}>
                <RotateCcw size={12} /> Reassign for Rework
              </button>
            )}
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors" style={{ fontWeight: 500 }}>
              <Eye size={12} /> View Job
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SampleApproval() {
  const [filterStatus, setFilterStatus] = useState("All");

  const counts: Record<string, number> = { All: samples.length };
  samples.forEach((s) => { counts[s.status] = (counts[s.status] ?? 0) + 1; });

  const filtered = samples.filter((s) => filterStatus === "All" || s.status === filterStatus);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Sample Approval</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track sample production, QC verification, and customer approval</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-white" style={{ background: "#4f46e5", fontWeight: 500 }}>
          <FlaskConical size={13} /> Generate New Sample
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Samples",     value: samples.length, color: "text-indigo-600 bg-indigo-50", icon: <FlaskConical size={16} /> },
          { label: "QC Pending",        value: counts["QC Pending"] ?? 0, color: "text-amber-600 bg-amber-50", icon: <AlertTriangle size={16} /> },
          { label: "Customer Approved", value: counts["Customer Approved"] ?? 0, color: "text-green-600 bg-green-50", icon: <CheckCircle size={16} /> },
          { label: "Rework Required",   value: counts["Rework Required"] ?? 0, color: "text-red-600 bg-red-50", icon: <RotateCcw size={16} /> },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
            <p className="text-slate-900 mb-0.5" style={{ fontSize: "1.25rem", fontWeight: 700 }}>{s.value}</p>
            <p className="text-slate-600 text-xs" style={{ fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {["All", "Generating", "QC Pending", "QC Approved", "Sent to Customer", "Customer Approved", "Rework Required"].map((f) => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${filterStatus === f ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}
            style={{ fontWeight: filterStatus === f ? 600 : 400 }}
          >
            {f}
            {counts[f] !== undefined && (
              <span className={`ml-1.5 px-1.5 rounded-full text-xs ${filterStatus === f ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`} style={{ fontWeight: 600 }}>
                {counts[f]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Sample Cards */}
      <div className="space-y-3">
        {filtered.map((sample) => (
          <SampleCard key={sample.id} sample={sample} />
        ))}
      </div>
    </div>
  );
}
