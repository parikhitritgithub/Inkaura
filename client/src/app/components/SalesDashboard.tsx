import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Plus, Search, Filter, TrendingUp, FileText,
  Users, Clock, CheckCircle, XCircle, Eye, ArrowRight
} from "lucide-react";

const salesData = [
  { day: "Mon", quotations: 8, orders: 5 },
  { day: "Tue", quotations: 12, orders: 9 },
  { day: "Wed", quotations: 7, orders: 4 },
  { day: "Thu", quotations: 15, orders: 11 },
  { day: "Fri", quotations: 10, orders: 7 },
  { day: "Sat", quotations: 4, orders: 3 },
];

const quotations = [
  { id: "QT-0089", customer: "Apex Beverages Ltd.", date: "Jun 16", value: "₹84,500", status: "Approved", items: 3 },
  { id: "QT-0088", customer: "Metro Retail Group", date: "Jun 15", value: "₹1,32,000", status: "Sent", items: 5 },
  { id: "QT-0087", customer: "FreshFarm Foods", date: "Jun 14", value: "₹67,250", status: "Draft", items: 2 },
  { id: "QT-0086", customer: "Sunrise Pharma", date: "Jun 14", value: "₹2,18,000", status: "Approved", items: 8 },
  { id: "QT-0085", customer: "Classic Gifts Co.", date: "Jun 13", value: "₹45,000", status: "Rejected", items: 1 },
  { id: "QT-0084", customer: "TechPack Industries", date: "Jun 12", value: "₹98,500", status: "Sent", items: 4 },
  { id: "QT-0083", customer: "Himalaya Naturals", date: "Jun 11", value: "₹1,55,000", status: "Approved", items: 6 },
];

const pipeline = [
  { stage: "New Leads", count: 24, color: "bg-slate-400" },
  { stage: "Contacted", count: 18, color: "bg-indigo-400" },
  { stage: "Proposal Sent", count: 12, color: "bg-indigo-600" },
  { stage: "Negotiation", count: 7, color: "bg-amber-500" },
  { stage: "Closed Won", count: 5, color: "bg-green-500" },
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

export function SalesDashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = quotations.filter(
    (q) =>
      (statusFilter === "All" || q.status === statusFilter) &&
      (q.customer.toLowerCase().includes(search.toLowerCase()) || q.id.includes(search))
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Sales Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage quotations, customers, and orders</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Users size={14} /> New Customer
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg text-white transition-colors" style={{ background: "#4f46e5", fontWeight: 500 }}>
            <Plus size={14} /> New Quotation
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Quotations", value: "89", sub: "This month", icon: <FileText size={16} />, color: "text-indigo-600 bg-indigo-50" },
          { label: "Approved", value: "52", sub: "Conversion 58.4%", icon: <CheckCircle size={16} />, color: "text-green-600 bg-green-50" },
          { label: "Pending Review", value: "18", sub: "Awaiting response", icon: <Clock size={16} />, color: "text-amber-600 bg-amber-50" },
          { label: "Sales Value (MTD)", value: "₹38.2L", sub: "+14.2% vs last month", icon: <TrendingUp size={16} />, color: "text-purple-600 bg-purple-50" },
        ].map((k) => (
          <div key={k.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${k.color}`}>
              {k.icon}
            </div>
            <p className="text-slate-900 mb-0.5" style={{ fontSize: "1.375rem", fontWeight: 700 }}>{k.value}</p>
            <p className="text-slate-700 text-xs" style={{ fontWeight: 500 }}>{k.label}</p>
            <p className="text-slate-400 text-xs mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Weekly Chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-slate-900 text-sm mb-4" style={{ fontWeight: 600 }}>Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={salesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
              <Bar dataKey="quotations" fill="#dbeafe" radius={[3, 3, 0, 0]} name="Quotations" />
              <Bar dataKey="orders" fill="#4f46e5" radius={[3, 3, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pipeline */}
        <div className="xl:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Sales Pipeline</h3>
            <button className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">View CRM <ArrowRight size={12} /></button>
          </div>
          <div className="flex gap-2 h-10 rounded-lg overflow-hidden mb-4">
            {pipeline.map((stage, i) => (
              <div
                key={stage.stage}
                className={`${stage.color} flex items-center justify-center transition-all hover:opacity-90 cursor-pointer`}
                style={{ flex: stage.count }}
                title={`${stage.stage}: ${stage.count}`}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {pipeline.map((stage) => (
              <div key={stage.stage} className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                  <span className="text-xs text-slate-500">{stage.stage}</span>
                </div>
                <p className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>{stage.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-border flex-wrap">
          <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Recent Quotations</h3>
          <div className="flex-1" />
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-border">
                {["Quote ID", "Customer", "Items", "Value", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs text-slate-500 px-5 py-2.5 whitespace-nowrap" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((q) => (
                <tr key={q.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 text-indigo-600 text-xs" style={{ fontWeight: 600 }}>{q.id}</td>
                  <td className="px-5 py-3 text-slate-800 text-xs" style={{ fontWeight: 500 }}>{q.customer}</td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{q.items} items</td>
                  <td className="px-5 py-3 text-slate-800 text-xs" style={{ fontWeight: 600 }}>{q.value}</td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{q.date}</td>
                  <td className="px-5 py-3"><StatusBadge status={q.status} /></td>
                  <td className="px-5 py-3">
                    <button className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-border">
          <p className="text-xs text-slate-500">Showing {filtered.length} of {quotations.length} quotations</p>
          <div className="flex gap-1">
            {[1, 2, 3].map((p) => (
              <button key={p} className={`w-6 h-6 rounded text-xs ${p === 1 ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
