import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Briefcase, CheckCircle, Clock, DollarSign, AlertTriangle,
  TrendingUp, TrendingDown, Users, ArrowRight, Cog, UserCheck,
  FlaskConical, Package, Truck, FileText, ShieldCheck, Box, ClipboardCheck
} from "lucide-react";

// Predefined colors for charts and pipelines
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#eab308'];

// Utility to pick pipeline stage colors and icons
const getStageStyles = (label: string) => {
  const styles: Record<string, { icon: any; color: string }> = {
    'Inquiry': { icon: <Users size={13} />, color: "bg-slate-400" },
    'Estimation': { icon: <FileText size={13} />, color: "bg-indigo-400" },
    'Quotation': { icon: <FileText size={13} />, color: "bg-indigo-500" },
    'Sample': { icon: <FlaskConical size={13} />, color: "bg-indigo-600" },
    'Approval': { icon: <CheckCircle size={13} />, color: "bg-violet-500" },
    'Advance Pmt': { icon: <DollarSign size={13} />, color: "bg-violet-600" },
    'Job Order': { icon: <Briefcase size={13} />, color: "bg-blue-500" },
    'Production': { icon: <Cog size={13} />, color: "bg-cyan-500" },
    'QC': { icon: <ShieldCheck size={13} />, color: "bg-teal-500" },
    'Packaging': { icon: <Box size={13} />, color: "bg-emerald-500" },
    'Dispatch': { icon: <Truck size={13} />, color: "bg-green-500" },
    'Invoice': { icon: <FileText size={13} />, color: "bg-orange-500" },
    'Payment': { icon: <DollarSign size={13} />, color: "bg-rose-400" },
    'Closure': { icon: <CheckCircle size={13} />, color: "bg-pink-500" },
  };
  return styles[label] || { icon: <Clock size={13} />, color: "bg-slate-300" };
};

// Utility to pick role icons
const getRoleStyles = (role: string) => {
  const styles: Record<string, { icon: any; color: string }> = {
    'Admin': { icon: <UserCheck size={13} />, color: "bg-indigo-100 text-indigo-700" },
    'Sales Executive': { icon: <Users size={13} />, color: "bg-green-100 text-green-700" },
    'Supervisor': { icon: <ClipboardCheck size={13} />, color: "bg-amber-100 text-amber-700" },
    'Machine Operator': { icon: <Cog size={13} />, color: "bg-blue-100 text-blue-700" },
    'Inventory Mgr': { icon: <Package size={13} />, color: "bg-purple-100 text-purple-700" },
    'QC Team': { icon: <ShieldCheck size={13} />, color: "bg-sky-100 text-sky-700" },
    'Finance': { icon: <DollarSign size={13} />, color: "bg-rose-100 text-rose-700" },
  };
  return styles[role] || { icon: <Users size={13} />, color: "bg-slate-100 text-slate-700" };
};

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "In Progress": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "In Production": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Completed":   "bg-green-50 text-green-700 border-green-200",
    "Delivered":   "bg-emerald-50 text-emerald-700 border-emerald-200",
    "QC Pending":  "bg-amber-50 text-amber-700 border-amber-200",
    "Pending":     "bg-slate-100 text-slate-600 border-slate-200",
    "Dispatch Pending": "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${styles[status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`} style={{ fontWeight: 500 }}>
      {status || "Unknown"}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const p = priority || "Medium";
  const c: Record<string, string> = { High: "text-red-600", Medium: "text-amber-600", Low: "text-slate-400" };
  return <span className={`text-xs ${c[p]}`} style={{ fontWeight: 600 }}>{p}</span>;
}

export function AdminDashboard() {
  const [loadingKPIs, setLoadingKPIs] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);

  // States
  const [kpis, setKpis] = useState<any>({});
  const [pipeline, setPipeline] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [statusDist, setStatusDist] = useState<any[]>([]);
  const [printTypes, setPrintTypes] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [actionCenter, setActionCenter] = useState<any>({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoadingKPIs(true);
    try {
      const { data, error } = await supabase.rpc("get_admin_kpis");
      if (error) throw error;
      setKpis(data || {});
    } catch (e) {
      console.error("Failed to fetch KPIs", e);
    } finally {
      setLoadingKPIs(false);
      fetchCharts();
    }
  };

  const fetchCharts = async () => {
    setLoadingCharts(true);
    try {
      const [pipeRes, revRes, statRes, printRes, jobsRes, invRes, userRes, actRes] = await Promise.all([
        supabase.rpc("get_admin_pipeline"),
        supabase.rpc("get_admin_revenue_trend"),
        supabase.rpc("get_admin_job_status"),
        supabase.rpc("get_admin_print_types"),
        supabase.rpc("get_recent_jobs"),
        supabase.rpc("get_inventory_alerts"),
        supabase.rpc("get_user_role_overview"),
        supabase.rpc("get_admin_action_center")
      ]);

      setPipeline(pipeRes.data || []);
      setRevenueData(revRes.data || []);
      setStatusDist(statRes.data || []);
      setPrintTypes(printRes.data || []);
      setRecentJobs(jobsRes.data || []);
      setInventoryAlerts(invRes.data || []);
      setUserRoles(userRes.data || []);
      setActionCenter(actRes.data || {});
    } catch (e) {
      console.error("Failed to fetch charts", e);
    } finally {
      setLoadingCharts(false);
    }
  };

  const formatCurrency = (val: number) => `₹${(val || 0).toLocaleString()}`;
  const kpiList = [
    { label: "Revenue (MTD)",        value: formatCurrency(kpis.revenue_mtd), up: true,  icon: <DollarSign size={16} />,    color: "bg-purple-50 text-purple-600",  border: "border-purple-100" },
    { label: "Active Jobs",          value: kpis.active_jobs || 0,            up: true,  icon: <Clock size={16} />,         color: "bg-amber-50 text-amber-600",    border: "border-amber-100" },
    { label: "Completed Jobs",       value: kpis.completed_jobs || 0,         up: true,  icon: <CheckCircle size={16} />,   color: "bg-green-50 text-green-600",    border: "border-green-100" },
    { label: "Pending Payments",     value: formatCurrency(kpis.pending_payments), up: false, icon: <AlertTriangle size={16} />, color: "bg-red-50 text-red-600", border: "border-red-100" },
    { label: "Total Customers",      value: kpis.total_customers || 0,        up: true, icon: <Users size={16} />,          color: "bg-sky-50 text-sky-600",        border: "border-sky-100" },
    { label: "Open Quotations",      value: kpis.open_quotations || 0,        up: true, icon: <FileText size={16} />,       color: "bg-indigo-50 text-indigo-600",  border: "border-indigo-100" },
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Global Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Live Company Overview · PrintFlow ERP Enterprise</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {loadingKPIs ? (
        <div className="h-32 flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpiList.map((card) => (
            <div key={card.label} className={`bg-white rounded-xl border p-4 shadow-sm ${card.border} cursor-pointer hover:shadow-md transition-all`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.color}`}>{card.icon}</div>
                {card.up ? <TrendingUp size={13} className="text-green-500" /> : <TrendingDown size={13} className="text-red-400" />}
              </div>
              <p className="text-slate-900 mb-0.5" style={{ fontSize: "1.35rem", fontWeight: 700 }}>{card.value}</p>
              <p className="text-slate-500 text-xs mb-1 leading-tight">{card.label}</p>
            </div>
          ))}
        </div>
      )}

      {loadingCharts ? (
        <div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          {/* Business Workflow Pipeline */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>Business Workflow Pipeline</h3>
                <p className="text-slate-400 text-xs mt-0.5">Live job count at each stage of the production lifecycle</p>
              </div>
            </div>
            <div className="overflow-x-auto pb-2">
              <div className="flex items-stretch gap-0 min-w-max">
                {pipeline.length === 0 ? <span className="text-sm text-slate-500">No pipeline data</span> : pipeline.map((stage, idx) => {
                  const style = getStageStyles(stage.label);
                  return (
                    <div key={stage.step} className="flex items-stretch">
                      <div className="flex flex-col items-center w-20 group cursor-pointer">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white mb-1.5 transition-transform group-hover:scale-110 ${style.color}`}>
                          {style.icon}
                        </div>
                        <span className="text-slate-800 text-xs leading-tight text-center" style={{ fontWeight: 700, fontSize: "11px" }}>{stage.count}</span>
                        <span className="text-slate-400 text-center leading-tight mt-0.5" style={{ fontSize: "9px", fontWeight: 500 }}>{stage.label}</span>
                      </div>
                      {idx < pipeline.length - 1 && (
                        <div className="flex items-center self-start mt-4 mx-0.5">
                          <div className="w-4 h-px bg-slate-200" />
                          <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-slate-300" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Revenue Chart */}
            <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Revenue Performance</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Monthly revenue vs target (₹)</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                {revenueData.length === 0 ? <div className="h-full flex items-center justify-center text-slate-400 text-sm">No revenue data</div> : (
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
                )}
              </ResponsiveContainer>
            </div>

            {/* Job Status Pie */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="mb-3">
                <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Job Status Overview</h3>
              </div>
              <ResponsiveContainer width="100%" height={155}>
                {statusDist.length === 0 ? <div className="h-full flex items-center justify-center text-slate-400 text-sm">No status data</div> : (
                  <PieChart>
                    <Pie data={statusDist} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={2} dataKey="value" nameKey="name">
                      {statusDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
                  </PieChart>
                )}
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                {statusDist.map((item, i) => (
                  <div key={item.name || i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-slate-600 truncate max-w-[120px]" title={item.name}>{item.name || "Unknown"}</span>
                    </div>
                    <span className="text-slate-800" style={{ fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Jobs & Action Center Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Print Type Analysis */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-slate-900 text-sm mb-4" style={{ fontWeight: 600 }}>Print Type Analysis</h3>
              <ResponsiveContainer width="100%" height={170}>
                {printTypes.length === 0 ? <div className="h-full flex items-center justify-center text-slate-400 text-sm">No type data</div> : (
                  <BarChart data={printTypes} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="type" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
                    <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Jobs" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Action Center (Delayed Jobs, Approvals) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-slate-900 text-sm mb-4 flex items-center gap-2"><AlertTriangle size={16} className="text-red-500" /> Action Center</h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex justify-between items-center cursor-pointer hover:bg-red-100 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-red-800">Delayed Jobs</p>
                    <p className="text-xs text-red-600 mt-0.5">{actionCenter.delayed_jobs || 0} jobs missed delivery date</p>
                  </div>
                  <ArrowRight size={14} className="text-red-400" />
                </div>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex justify-between items-center cursor-pointer hover:bg-amber-100 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-amber-800">Pending Approvals</p>
                    <p className="text-xs text-amber-600 mt-0.5">{actionCenter.pending_approvals || 0} production orders waiting</p>
                  </div>
                  <ArrowRight size={14} className="text-amber-400" />
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex justify-between items-center cursor-pointer hover:bg-indigo-100 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-indigo-800">Pending Quotations</p>
                    <p className="text-xs text-indigo-600 mt-0.5">{actionCenter.pending_quotations || 0} quotes need review</p>
                  </div>
                  <ArrowRight size={14} className="text-indigo-400" />
                </div>
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex justify-between items-center cursor-pointer hover:bg-rose-100 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-rose-800">Overdue Collections</p>
                    <p className="text-xs text-rose-600 mt-0.5">{actionCenter.overdue_invoices || 0} unpaid overdue invoices</p>
                  </div>
                  <ArrowRight size={14} className="text-rose-400" />
                </div>
              </div>
            </div>

            {/* User Roles Overview */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Workforce Overview</h3>
              </div>
              <div className="space-y-2 overflow-y-auto max-h-[220px] custom-scrollbar">
                {userRoles.length === 0 ? <p className="text-sm text-slate-500">No user data</p> : userRoles.map((r) => {
                  const style = getRoleStyles(r.role);
                  return (
                    <div key={r.role} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${style.color}`}>
                        {style.icon}
                      </div>
                      <span className="flex-1 text-xs text-slate-700" style={{ fontWeight: 500 }}>{r.role}</span>
                      <span className="text-xs text-slate-500">{r.users} users</span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.min((r.users / 15) * 100, 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Total active users</span>
                <span className="text-slate-900" style={{ fontWeight: 700 }}>{userRoles.reduce((a, r) => a + r.users, 0)} users</span>
              </div>
            </div>
          </div>

          {/* Bottom Data Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Recent Jobs Table */}
            <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
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
                      {["Job ID", "Client", "Type", "Priority", "Expected Delivery", "Value", "Status"].map((h) => (
                        <th key={h} className="text-left text-xs text-slate-400 pb-2 pr-4 whitespace-nowrap" style={{ fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentJobs.length === 0 ? <tr><td colSpan={7} className="text-center py-4 text-slate-400">No jobs found</td></tr> : recentJobs.map((job) => (
                      <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer">
                        <td className="py-2.5 pr-4 text-indigo-600 text-xs" style={{ fontWeight: 600 }}>{job.id}</td>
                        <td className="py-2.5 pr-4 text-slate-800 text-xs whitespace-nowrap" style={{ fontWeight: 500 }}>{job.client || "Unknown Client"}</td>
                        <td className="py-2.5 pr-4 text-slate-500 text-xs whitespace-nowrap">{job.type || "N/A"}</td>
                        <td className="py-2.5 pr-4"><PriorityBadge priority={job.priority} /></td>
                        <td className="py-2.5 pr-4 text-slate-500 text-xs whitespace-nowrap">{job.due || "TBD"}</td>
                        <td className="py-2.5 pr-4 text-slate-800 text-xs" style={{ fontWeight: 600 }}>{formatCurrency(job.value)}</td>
                        <td className="py-2.5"><StatusBadge status={job.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inventory Alerts (Low Stock) */}
            <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={15} className="text-amber-500" />
                <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Low Stock Alerts</h3>
                <span className="ml-auto text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  {inventoryAlerts.length} items
                </span>
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[300px] custom-scrollbar">
                {inventoryAlerts.length === 0 ? <p className="text-sm text-slate-500">Inventory levels are healthy</p> : inventoryAlerts.map((item, idx) => {
                  const pct = Math.round((item.current / item.min) * 100);
                  return (
                    <div key={idx} className="p-3 rounded-lg bg-amber-50 border border-amber-100">
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
                        Raise Purchase Request ({item.reorder})
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
