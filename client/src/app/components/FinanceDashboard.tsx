import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Download, Plus, CheckCircle, Clock, XCircle } from "lucide-react";

const revenueMonthly = [
  { month: "Jan", revenue: 182000, expense: 124000 },
  { month: "Feb", revenue: 195000, expense: 131000 },
  { month: "Mar", revenue: 168000, expense: 118000 },
  { month: "Apr", revenue: 221000, expense: 145000 },
  { month: "May", revenue: 247000, expense: 162000 },
  { month: "Jun", revenue: 263000, expense: 171000 },
];

const invoices = [
  { id: "INV-0142", client: "Apex Beverages Ltd.", amount: 79650, due: "Jun 22, 2026", issued: "Jun 16, 2026", status: "Pending" },
  { id: "INV-0141", client: "Sunrise Pharma", amount: 236000, due: "Jun 28, 2026", issued: "Jun 14, 2026", status: "Pending" },
  { id: "INV-0140", client: "Metro Retail Group", amount: 134520, due: "Jun 19, 2026", issued: "Jun 13, 2026", status: "Overdue" },
  { id: "INV-0139", client: "FreshFarm Foods", amount: 53100, due: "Jun 10, 2026", issued: "Jun 4, 2026", status: "Paid" },
  { id: "INV-0138", client: "Himalaya Naturals", amount: 183300, due: "Jun 8, 2026", issued: "Jun 2, 2026", status: "Paid" },
  { id: "INV-0137", client: "TechPack Industries", amount: 116230, due: "Jun 15, 2026", issued: "Jun 9, 2026", status: "Overdue" },
  { id: "INV-0136", client: "Classic Gifts Co.", amount: 50150, due: "Jun 18, 2026", issued: "Jun 12, 2026", status: "Paid" },
];

const expenses = [
  { category: "Raw Materials", amount: 82000, pct: 48 },
  { category: "Labour", amount: 41000, pct: 24 },
  { category: "Electricity", amount: 17100, pct: 10 },
  { category: "Machine Maintenance", amount: 12825, pct: 7.5 },
  { category: "Transport", amount: 8550, pct: 5 },
  { category: "Others", amount: 9525, pct: 5.5 },
];

const expenseColors = ["bg-indigo-500", "bg-purple-500", "bg-amber-500", "bg-green-500", "bg-sky-500", "bg-slate-400"];

function StatusBadge({ status }: { status: string }) {
  const s: Record<string, string> = {
    Paid: "bg-green-50 text-green-700 border-green-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Overdue: "bg-red-50 text-red-700 border-red-200",
  };
  const icons: Record<string, React.ReactNode> = {
    Paid: <CheckCircle size={10} />,
    Pending: <Clock size={10} />,
    Overdue: <XCircle size={10} />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs ${s[status]}`} style={{ fontWeight: 500 }}>
      {icons[status]} {status}
    </span>
  );
}

export function FinanceDashboard() {
  const totalRevenue = revenueMonthly.reduce((a, m) => a + m.revenue, 0);
  const totalExpense = revenueMonthly.reduce((a, m) => a + m.expense, 0);
  const netProfit = totalRevenue - totalExpense;
  const margin = ((netProfit / totalRevenue) * 100).toFixed(1);

  const pendingAmount = invoices.filter(i => i.status === "Pending").reduce((a, i) => a + i.amount, 0);
  const overdueAmount = invoices.filter(i => i.status === "Overdue").reduce((a, i) => a + i.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Finance & Reports</h1>
          <p className="text-slate-500 text-sm mt-0.5">Financial year 2025–26 · January to June 2026</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={12} /> Export P&L
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-white transition-colors" style={{ background: "#4f46e5", fontWeight: 500 }}>
            <Plus size={12} /> Create Invoice
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue (H1)", value: `₹${(totalRevenue / 100000).toFixed(1)}L`, change: "+12.4% YoY", up: true, icon: <TrendingUp size={16} />, color: "text-indigo-600 bg-indigo-50" },
          { label: "Net Profit", value: `₹${(netProfit / 100000).toFixed(1)}L`, change: `${margin}% margin`, up: true, icon: <DollarSign size={16} />, color: "text-green-600 bg-green-50" },
          { label: "Pending Invoices", value: `₹${(pendingAmount / 100000).toFixed(1)}L`, change: "2 invoices", up: false, icon: <Clock size={16} />, color: "text-amber-600 bg-amber-50" },
          { label: "Overdue Amount", value: `₹${(overdueAmount / 100000).toFixed(1)}L`, change: "2 invoices", up: false, icon: <AlertCircle size={16} />, color: "text-red-600 bg-red-50" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>{s.icon}</div>
              {s.up ? <TrendingUp size={13} className="text-green-500" /> : <TrendingDown size={13} className="text-red-400" />}
            </div>
            <p className="text-slate-900 mb-0.5" style={{ fontSize: "1.25rem", fontWeight: 700 }}>{s.value}</p>
            <p className="text-slate-700 text-xs" style={{ fontWeight: 500 }}>{s.label}</p>
            <p className={`text-xs mt-0.5 ${s.up ? "text-green-600" : "text-red-500"}`} style={{ fontWeight: 500 }}>{s.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* P&L Chart */}
        <div className="xl:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Revenue vs Expenses</h3>
              <p className="text-slate-400 text-xs mt-0.5">Monthly comparison (₹)</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-indigo-600 inline-block" /> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-red-400 inline-block" /> Expenses</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueMonthly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} formatter={(v: number) => [`₹${(v / 1000).toFixed(1)}k`, ""]} />
              <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} fill="url(#revGrad2)" name="Revenue" />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#expGrad)" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-slate-900 text-sm mb-4" style={{ fontWeight: 600 }}>Expense Breakdown (Jun)</h3>
          <div className="space-y-3">
            {expenses.map((exp, i) => (
              <div key={exp.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">{exp.category}</span>
                  <span className="text-xs text-slate-800" style={{ fontWeight: 600 }}>₹{(exp.amount / 1000).toFixed(0)}k ({exp.pct}%)</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${expenseColors[i]}`} style={{ width: `${exp.pct * 2}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600" style={{ fontWeight: 500 }}>Total Expenses (Jun)</span>
              <span className="text-slate-900" style={{ fontWeight: 700 }}>₹1,71,000</span>
            </div>
            <div className="flex justify-between text-xs mt-1.5">
              <span className="text-slate-600" style={{ fontWeight: 500 }}>Net Profit (Jun)</span>
              <span className="text-green-600" style={{ fontWeight: 700 }}>₹92,000 (35.0%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Management */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Invoice Management</h3>
          <div className="flex gap-2">
            {[{ s: "Paid", c: "text-green-600" }, { s: "Pending", c: "text-amber-600" }, { s: "Overdue", c: "text-red-600" }].map(({ s, c }) => (
              <span key={s} className={`text-xs ${c}`} style={{ fontWeight: 600 }}>
                {invoices.filter((i) => i.status === s).length} {s}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-border">
                {["Invoice #", "Client", "Amount", "Issue Date", "Due Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs text-slate-500 px-5 py-2.5 whitespace-nowrap" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 text-indigo-600 text-xs" style={{ fontWeight: 600 }}>{inv.id}</td>
                  <td className="px-5 py-3 text-slate-800 text-xs" style={{ fontWeight: 500 }}>{inv.client}</td>
                  <td className="px-5 py-3 text-slate-900 text-xs" style={{ fontWeight: 700 }}>₹{inv.amount.toLocaleString()}</td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{inv.issued}</td>
                  <td className={`px-5 py-3 text-xs ${inv.status === "Overdue" ? "text-red-600" : "text-slate-500"}`} style={{ fontWeight: inv.status === "Overdue" ? 600 : 400 }}>{inv.due}</td>
                  <td className="px-5 py-3"><StatusBadge status={inv.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-indigo-600 hover:text-indigo-700" style={{ fontWeight: 500 }}>View</button>
                      {inv.status !== "Paid" && (
                        <button className="text-xs text-green-600 hover:text-green-700" style={{ fontWeight: 500 }}>Record Payment</button>
                      )}
                      <button className="text-xs text-slate-500 hover:text-slate-600">
                        <Download size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-border">
          <div className="flex items-center gap-6 text-xs">
            <span className="text-slate-500">Total Billed: <span className="text-slate-800" style={{ fontWeight: 700 }}>₹{invoices.reduce((a, i) => a + i.amount, 0).toLocaleString()}</span></span>
            <span className="text-slate-500">Collected: <span className="text-green-700" style={{ fontWeight: 700 }}>₹{invoices.filter(i => i.status === "Paid").reduce((a, i) => a + i.amount, 0).toLocaleString()}</span></span>
            <span className="text-slate-500">Outstanding: <span className="text-red-600" style={{ fontWeight: 700 }}>₹{(pendingAmount + overdueAmount).toLocaleString()}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
