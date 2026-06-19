import { useState } from "react";
import { Plus, FileText, CheckCircle, Clock, XCircle, Printer, Download, Send, ChevronDown, Trash2, X } from "lucide-react";

const quotations = [
  { id: "QT-0089", customer: "Apex Beverages Ltd.", date: "Jun 16, 2026", validUntil: "Jun 30, 2026", items: [{ desc: "Label Printing 4C (5,000 units)", qty: 5000, rate: 8, total: 40000 }, { desc: "Lamination Gloss", qty: 5000, rate: 2, total: 10000 }, { desc: "Die-cutting", qty: 5000, rate: 3.5, total: 17500 }], subtotal: 67500, gst: 12150, total: 79650, status: "Approved" },
  { id: "QT-0088", customer: "Metro Retail Group", date: "Jun 15, 2026", validUntil: "Jun 29, 2026", items: [{ desc: "Carton Box Offset (2,000 pcs)", qty: 2000, rate: 45, total: 90000 }, { desc: "UV Coating", qty: 2000, rate: 12, total: 24000 }], subtotal: 114000, gst: 20520, total: 134520, status: "Sent" },
  { id: "QT-0087", customer: "FreshFarm Foods", date: "Jun 14, 2026", validUntil: "Jun 28, 2026", items: [{ desc: "Flexible Packaging Rotogravure", qty: 10000, rate: 4.5, total: 45000 }], subtotal: 45000, gst: 8100, total: 53100, status: "Draft" },
  { id: "QT-0086", customer: "Sunrise Pharma", date: "Jun 14, 2026", validUntil: "Jun 28, 2026", items: [{ desc: "Blister Pack Foil (50,000 strips)", qty: 50000, rate: 3.2, total: 160000 }, { desc: "Carton Leaflet", qty: 50000, rate: 0.8, total: 40000 }], subtotal: 200000, gst: 36000, total: 236000, status: "Approved" },
  { id: "QT-0085", customer: "Classic Gifts Co.", date: "Jun 13, 2026", validUntil: "Jun 27, 2026", items: [{ desc: "Gift Box Premium (500 pcs)", qty: 500, rate: 85, total: 42500 }], subtotal: 42500, gst: 7650, total: 50150, status: "Rejected" },
];

function StatusBadge({ status }: { status: string }) {
  const s: Record<string, string> = {
    Approved: "bg-green-50 text-green-700 border-green-200",
    Sent: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Draft: "bg-slate-100 text-slate-600 border-slate-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${s[status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`} style={{ fontWeight: 500 }}>
      {status}
    </span>
  );
}

interface QuotationDetailProps {
  quotation: typeof quotations[0];
  onClose: () => void;
}

function QuotationDetail({ quotation: q, onClose }: QuotationDetailProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>Quotation {q.id}</h2>
            <p className="text-slate-400 text-xs mt-0.5">{q.customer}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={q.status} />
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 ml-2"><X size={18} /></button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-400 mb-0.5">Customer</p>
              <p className="text-slate-800" style={{ fontWeight: 600 }}>{q.customer}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-0.5">Quotation Date</p>
              <p className="text-slate-800" style={{ fontWeight: 600 }}>{q.date}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-0.5">Valid Until</p>
              <p className="text-slate-800" style={{ fontWeight: 600 }}>{q.validUntil}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-0.5">Payment Terms</p>
              <p className="text-slate-800" style={{ fontWeight: 600 }}>50% Advance · 50% on delivery</p>
            </div>
          </div>

          <div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border border-slate-100 rounded-t-lg">
                  {["Description", "Qty", "Rate (₹)", "Total (₹)"].map((h) => (
                    <th key={h} className="text-left text-slate-500 px-3 py-2" style={{ fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {q.items.map((item, i) => (
                  <tr key={i} className="border-x border-b border-slate-100">
                    <td className="px-3 py-2 text-slate-700">{item.desc}</td>
                    <td className="px-3 py-2 text-slate-700">{item.qty.toLocaleString()}</td>
                    <td className="px-3 py-2 text-slate-700">₹{item.rate.toFixed(2)}</td>
                    <td className="px-3 py-2 text-slate-800" style={{ fontWeight: 600 }}>₹{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-x border-b border-slate-100 rounded-b-lg">
              <div className="flex justify-between px-3 py-1.5 text-xs border-t border-slate-50">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-800" style={{ fontWeight: 600 }}>₹{q.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 text-xs border-t border-slate-50">
                <span className="text-slate-500">GST (18%)</span>
                <span className="text-slate-800" style={{ fontWeight: 600 }}>₹{q.gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between px-3 py-2 text-sm bg-slate-50 border-t border-slate-100">
                <span className="text-slate-700" style={{ fontWeight: 600 }}>Total Amount</span>
                <span className="text-indigo-700" style={{ fontWeight: 700 }}>₹{q.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {q.status === "Draft" && (
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg text-white" style={{ background: "#4f46e5", fontWeight: 500 }}>
                <Send size={12} /> Send to Customer
              </button>
            )}
            {q.status === "Sent" && (
              <>
                <button className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg text-white bg-green-600 hover:bg-green-700" style={{ fontWeight: 500 }}>
                  <CheckCircle size={12} /> Mark Approved
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg text-white bg-red-500 hover:bg-red-600" style={{ fontWeight: 500 }}>
                  <XCircle size={12} /> Mark Rejected
                </button>
              </>
            )}
            {q.status === "Approved" && (
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg text-white bg-green-600" style={{ fontWeight: 500 }}>
                <Plus size={12} /> Create Job Order
              </button>
            )}
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50" style={{ fontWeight: 500 }}>
              <Download size={12} /> Download PDF
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50" style={{ fontWeight: 500 }}>
              <Printer size={12} /> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuotationManagement() {
  const [selected, setSelected] = useState<typeof quotations[0] | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = quotations.filter((q) => statusFilter === "All" || q.status === statusFilter);
  const stats = {
    total: quotations.length,
    approved: quotations.filter((q) => q.status === "Approved").length,
    sent: quotations.filter((q) => q.status === "Sent").length,
    totalValue: quotations.reduce((a, q) => a + q.total, 0),
  };

  return (
    <div className="p-6 space-y-6">
      {selected && <QuotationDetail quotation={selected} onClose={() => setSelected(null)} />}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Quotation Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Create, manage, and track customer quotations</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg text-white transition-colors" style={{ background: "#4f46e5", fontWeight: 500 }}>
          <Plus size={14} /> Create Quotation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Quotations", value: stats.total, icon: <FileText size={16} />, color: "text-indigo-600 bg-indigo-50" },
          { label: "Approved", value: stats.approved, icon: <CheckCircle size={16} />, color: "text-green-600 bg-green-50" },
          { label: "Awaiting Response", value: stats.sent, icon: <Clock size={16} />, color: "text-amber-600 bg-amber-50" },
          { label: "Total Value", value: `₹${(stats.totalValue / 100000).toFixed(1)}L`, icon: <FileText size={16} />, color: "text-purple-600 bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
            <p className="text-slate-900 mb-0.5" style={{ fontSize: "1.25rem", fontWeight: 700 }}>{s.value}</p>
            <p className="text-slate-600 text-xs" style={{ fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quotation List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-border flex-wrap">
          <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>All Quotations</h3>
          <div className="flex-1" />
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            {["All", "Approved", "Sent", "Draft", "Rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 text-xs transition-colors ${statusFilter === f ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
                style={{ fontWeight: statusFilter === f ? 500 : 400 }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {filtered.map((q) => (
            <div key={q.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelected(q)}>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <FileText size={16} className="text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>{q.id}</p>
                  <StatusBadge status={q.status} />
                </div>
                <p className="text-slate-500 text-xs mt-0.5">{q.customer} · {q.items.length} items · Valid until {q.validUntil}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>₹{q.total.toLocaleString()}</p>
                <p className="text-slate-400 text-xs mt-0.5">{q.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
