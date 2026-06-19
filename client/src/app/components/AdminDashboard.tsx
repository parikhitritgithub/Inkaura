import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Briefcase, CheckCircle, Clock, DollarSign, AlertTriangle,
  TrendingUp, TrendingDown, Users, ArrowRight, Cog, UserCheck,
  FlaskConical, Package, Truck, FileText, ShieldCheck, Box
} from "lucide-react";

const revenueData = [
  { month: "Jan", revenue: 182000, target: 160000 },
  { month: "Feb", revenue: 195000, target: 175000 },
  { month: "Mar", revenue: 168000, target: 180000 },
  { month: "Apr", revenue: 221000, target: 190000 },
  { month: "May", revenue: 247000, target: 210000 },
  { month: "Jun", revenue: 263000, target: 230000 },
  { month: "Jul", revenue: 278000, target: 245000 },
];

const jobsByType = [
  { type: "Offset", count: 45 },
  { type: "Digital", count: 32 },
  { type: "Screen",  count: 18 },
  { type: "Flexo",   count: 12 },
  { type: "Gravure", count: 8 },
];

const statusDistribution = [
  { name: "Completed",   value: 142, color: "#10b981" },
  { name: "In Progress", value: 48,  color: "#6366f1" },
  { name: "Pending QC",  value: 22,  color: "#f59e0b" },
  { name: "Pending",     value: 31,  color: "#e2e8f0" },
];

const recentJobs = [
  { id: "JB-0094", client: "Apex Beverages Ltd.",  type: "Label Printing",  status: "In Progress", priority: "High",   due: "Jun 20, 2026", value: "₹84,500" },
  { id: "JB-0093", client: "Metro Retail Group",   type: "Carton Box",      status: "QC Pending",  priority: "Medium", due: "Jun 19, 2026", value: "₹1,32,000" },
  { id: "JB-0092", client: "FreshFarm Foods",      type: "Flexible Pack",   status: "Completed",   priority: "Low",    due: "Jun 18, 2026", value: "₹67,250" },
  { id: "JB-0091", client: "Sunrise Pharma",       type: "Blister Pack",    status: "In Progress", priority: "High",   due: "Jun 22, 2026", value: "₹2,18,000" },
  { id: "JB-0090", client: "Classic Gifts Co.",    type: "Gift Box",        status: "Pending",     priority: "Low",    due: "Jun 25, 2026", value: "₹45,000" },
];

const lowStockItems = [
  { item: "Cyan Ink (Process)",      current: 12, min: 25, unit: "kg"    },
  { item: "Art Paper 130gsm",        current: 8,  min: 50, unit: "reams" },
  { item: "Magenta Ink (Process)",   current: 18, min: 25, unit: "kg"    },
  { item: "Printing Plate CTP A2",   current: 3,  min: 10, unit: "pcs"   },
];

const userRoles = [
  { role: "Admin",            users: 2,  icon: <UserCheck size={13} />,  color: "bg-indigo-100 text-indigo-700" },
  { role: "Sales Executive",  users: 5,  icon: <Users size={13} />,      color: "bg-green-100 text-green-700" },
  { role: "Supervisor",       users: 3,  icon: <ClipboardCheck size={13} />, color: "bg-amber-100 text-amber-700" },
  { role: "Machine Operator", users: 12, icon: <Cog size={13} />,        color: "bg-blue-100 text-blue-700" },
  { role: "Inventory Mgr",    users: 2,  icon: <Package size={13} />,    color: "bg-purple-100 text-purple-700" },
  { role: "QC Team",          users: 4,  icon: <ShieldCheck size={13} />, color: "bg-sky-100 text-sky-700" },
  { role: "Finance",          users: 3,  icon: <DollarSign size={13} />, color: "bg-rose-100 text-rose-700" },
];

// Workflow stages for pipeline visualization
const workflowStages = [
  { step: 1,  label: "Inquiry",        icon: <Users size={13} />,        count: 8,  color: "bg-slate-400" },
  { step: 2,  label: "Requirement",    icon: <FileText size={13} />,     count: 6,  color: "bg-indigo-400" },
  { step: 3,  label: "Estimation",     icon: <DollarSign size={13} />,   count: 5,  color: "bg-indigo-500" },
  { step: 4,  label: "Quotation",      icon: <FileText size={13} />,     count: 9,  color: "bg-indigo-600" },
  { step: 5,  label: "Approval",       icon: <CheckCircle size={13} />,  count: 4,  color: "bg-violet-500" },
  { step: 6,  label: "Advance Pmt",    icon: <DollarSign size={13} />,   count: 3,  color: "bg-violet-600" },
  { step: 7,  label: "Job Order",      icon: <Briefcase size={13} />,    count: 12, color: "bg-blue-500" },
  { step: 8,  label: "Sample Prod.",   icon: <FlaskConical size={13} />, count: 5,  color: "bg-cyan-500" },
  { step: 9,  label: "QC Sample",      icon: <ShieldCheck size={13} />,  count: 3,  color: "bg-teal-500" },
  { step: 10, label: "Cust. Approval", icon: <UserCheck size={13} />,    count: 2,  color: "bg-emerald-500" },
  { step: 11, label: "Production",     icon: <Cog size={13} />,          count: 18, color: "bg-green-500" },
  { step: 12, label: "Quality Check",  icon: <ShieldCheck size={13} />,  count: 7,  color: "bg-lime-500" },
  { step: 13, label: "Packaging",      icon: <Box size={13} />,          count: 4,  color: "bg-yellow-500" },
  { step: 14, label: "Dispatch",       icon: <Truck size={13} />,        count: 6,  color: "bg-orange-500" },
  { step: 15, label: "Invoice",        icon: <FileText size={13} />,     count: 8,  color: "bg-red-400" },
  { step: 16, label: "Final Pmt",      icon: <DollarSign size={13} />,   count: 5,  color: "bg-rose-500" },
  { step: 17, label: "Closure",        icon: <CheckCircle size={13} />,  count: 142, color: "bg-pink-500" },
];

// Import omitted — used for role icons only
import { ClipboardCheck } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "In Progress": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Completed":   "bg-green-50 text-green-700 border-green-200",
    "QC Pending":  "bg-amber-50 text-amber-700 border-amber-200",
    "Pending":     "bg-slate-100 text-slate-600 border-slate-200",
    "Dispatched":  "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${styles[status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`} style={{ fontWeight: 500 }}>
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const c: Record<string, string> = { High: "text-red-600", Medium: "text-amber-600", Low: "text-slate-400" };
  return <span className={`text-xs ${c[priority]}`} style={{ fontWeight: 600 }}>{priority}</span>;
}

const kpiCards = [
  { label: "Total Jobs (Month)",   value: "243",    change: "+18.4%",      up: true,  icon: <Briefcase size={16} />,     color: "bg-indigo-50 text-indigo-600",  border: "border-indigo-100" },
  { label: "Active Jobs",          value: "48",     change: "+6 today",    up: true,  icon: <Clock size={16} />,          color: "bg-amber-50 text-amber-600",    border: "border-amber-100" },
  { label: "Completed Jobs",       value: "142",    change: "+12.1%",      up: true,  icon: <CheckCircle size={16} />,    color: "bg-green-50 text-green-600",    border: "border-green-100" },
  { label: "Revenue (MTD)",        value: "₹26.3L", change: "+9.6%",       up: true,  icon: <DollarSign size={16} />,    color: "bg-purple-50 text-purple-600",  border: "border-purple-100" },
  { label: "Pending Payments",     value: "₹8.4L",  change: "14 invoices", up: false, icon: <AlertTriangle size={16} />, color: "bg-red-50 text-red-600",        border: "border-red-100" },
  { label: "Total Customers",      value: "178",    change: "+5 this month", up: true, icon: <Users size={16} />,        color: "bg-sky-50 text-sky-600",        border: "border-sky-100" },
];

export function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Wednesday, June 18, 2026 · PrintFlow ERP Enterprise</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            Export Report
          </button>
          <button className="px-3 py-1.5 text-xs rounded-lg text-white transition-colors" style={{ background: "#4f46e5", fontWeight: 500 }}>
            + New Job Order
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((card) => (
          <div key={card.label} className={`bg-card rounded-xl border p-4 ${card.border}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.color}`}>{card.icon}</div>
              {card.up ? <TrendingUp size={13} className="text-green-500" /> : <TrendingDown size={13} className="text-red-400" />}
            </div>
            <p className="text-slate-900 mb-0.5" style={{ fontSize: "1.35rem", fontWeight: 700 }}>{card.value}</p>
            <p className="text-slate-500 text-xs mb-1 leading-tight">{card.label}</p>
            <p className={`text-xs ${card.up ? "text-green-600" : "text-red-500"}`} style={{ fontWeight: 500 }}>{card.change}</p>
          </div>
        ))}
      </div>

      {/* Business Workflow Pipeline */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>Business Workflow Pipeline</h3>
            <p className="text-slate-400 text-xs mt-0.5">Live job count at each stage of the production lifecycle</p>
          </div>
          <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg" style={{ fontWeight: 500 }}>
            17 stages · 243 active jobs
          </span>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="flex items-stretch gap-0 min-w-max">
            {workflowStages.map((stage, idx) => (
              <div key={stage.step} className="flex items-stretch">
                <div className="flex flex-col items-center w-20 group cursor-pointer">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white mb-1.5 transition-transform group-hover:scale-110 ${stage.color}`}>
                    {stage.icon}
                  </div>
                  <span className="text-slate-800 text-xs leading-tight text-center" style={{ fontWeight: 700, fontSize: "11px" }}>{stage.count}</span>
                  <span className="text-slate-400 text-center leading-tight mt-0.5" style={{ fontSize: "9px", fontWeight: 500 }}>{stage.label}</span>
                </div>
                {idx < workflowStages.length - 1 && (
                  <div className="flex items-center self-start mt-4 mx-0.5">
                    <div className="w-4 h-px bg-slate-200" />
                    <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Revenue Overview</h3>
              <p className="text-slate-400 text-xs mt-0.5">Monthly revenue vs target (₹)</p>
            </div>
            <select className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-600 bg-white focus:outline-none">
              <option>Last 7 months</option>
              <option>Last 12 months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }} formatter={(v: number) => [`₹${(v / 1000).toFixed(1)}k`, ""]} />
              <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
              <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={1.5} fill="none" strokeDasharray="4 4" name="Target" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Job Status Pie */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="mb-3">
            <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Job Status Distribution</h3>
            <p className="text-slate-400 text-xs mt-0.5">Current month breakdown</p>
          </div>
          <ResponsiveContainer width="100%" height={155}>
            <PieChart>
              <Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={2} dataKey="value">
                {statusDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-1">
            {statusDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="text-slate-800" style={{ fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Jobs by Type */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-slate-900 text-sm mb-4" style={{ fontWeight: 600 }}>Jobs by Print Type</h3>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={jobsByType} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="type" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
              <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Jobs" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Jobs */}
        <div className="xl:col-span-2 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Recent Jobs</h3>
            <button className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 transition-colors">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Job ID", "Client", "Type", "Priority", "Due Date", "Value", "Status"].map((h) => (
                    <th key={h} className="text-left text-xs text-slate-400 pb-2 pr-4 whitespace-nowrap" style={{ fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => (
                  <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 pr-4 text-indigo-600 text-xs" style={{ fontWeight: 600 }}>{job.id}</td>
                    <td className="py-2.5 pr-4 text-slate-800 text-xs whitespace-nowrap" style={{ fontWeight: 500 }}>{job.client}</td>
                    <td className="py-2.5 pr-4 text-slate-500 text-xs whitespace-nowrap">{job.type}</td>
                    <td className="py-2.5 pr-4"><PriorityBadge priority={job.priority} /></td>
                    <td className="py-2.5 pr-4 text-slate-500 text-xs whitespace-nowrap">{job.due}</td>
                    <td className="py-2.5 pr-4 text-slate-800 text-xs" style={{ fontWeight: 600 }}>{job.value}</td>
                    <td className="py-2.5"><StatusBadge status={job.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Management + Low Stock Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* User Roles */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>User Management</h3>
            <button className="text-xs text-indigo-600 border border-indigo-200 px-2.5 py-1 rounded-lg hover:bg-indigo-50 transition-colors" style={{ fontWeight: 500 }}>
              Manage Roles
            </button>
          </div>
          <div className="space-y-2">
            {userRoles.map((r) => (
              <div key={r.role} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${r.color}`}>
                  {r.icon}
                </div>
                <span className="flex-1 text-xs text-slate-700" style={{ fontWeight: 500 }}>{r.role}</span>
                <span className="text-xs text-slate-500">{r.users} users</span>
                <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.min((r.users / 12) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Total active users</span>
            <span className="text-slate-900" style={{ fontWeight: 700 }}>{userRoles.reduce((a, r) => a + r.users, 0)} users</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-card rounded-xl border border-amber-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={15} className="text-amber-500" />
            <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Low Stock Alerts</h3>
            <span className="ml-auto text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              {lowStockItems.length} items
            </span>
          </div>
          <div className="space-y-3">
            {lowStockItems.map((item) => {
              const pct = Math.round((item.current / item.min) * 100);
              return (
                <div key={item.item} className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <div className="flex items-end justify-between mb-1.5">
                    <p className="text-slate-800 text-xs" style={{ fontWeight: 600 }}>{item.item}</p>
                    <span className="text-amber-700 text-xs" style={{ fontWeight: 600 }}>{item.current} {item.unit}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex-1 h-1.5 rounded-full bg-amber-200 overflow-hidden">
                      <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <span className="text-slate-400 text-xs">Min: {item.min}</span>
                  </div>
                  <button className="text-xs text-amber-700 border border-amber-300 px-2 py-0.5 rounded hover:bg-amber-100 transition-colors" style={{ fontWeight: 500 }}>
                    Raise Purchase Request
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
