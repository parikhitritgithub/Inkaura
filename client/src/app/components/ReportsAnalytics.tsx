import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ComposedChart } from "recharts";
import { TrendingUp, Users, Briefcase, Cpu, Download, Target, DollarSign, Clock, Wrench } from "lucide-react";

const financialData = [
  { month: "Jan", revenue: 45000, cost: 28000, profit: 17000 },
  { month: "Feb", revenue: 52000, cost: 31000, profit: 21000 },
  { month: "Mar", revenue: 48000, cost: 30000, profit: 18000 },
  { month: "Apr", revenue: 61000, cost: 35000, profit: 26000 },
  { month: "May", revenue: 59000, cost: 33000, profit: 26000 },
  { month: "Jun", revenue: 68000, cost: 38000, profit: 30000 },
];

const jobsData = [
  { status: "Completed On-Time", value: 315, color: "#10b981" },
  { status: "Completed Late", value: 25, color: "#f59e0b" },
  { status: "In Progress", value: 120, color: "#4f46e5" },
  { status: "Delayed/Error", value: 15, color: "#ef4444" },
];

const machineROI = [
  { machine: "PM-1", util: 85, maintenance: 1200, revenueGen: 24000 },
  { machine: "PM-2", util: 62, maintenance: 4500, revenueGen: 15000 },
  { machine: "PM-3", util: 78, maintenance: 800,  revenueGen: 28000 },
  { machine: "DG-1", util: 92, maintenance: 2100, revenueGen: 35000 },
  { machine: "DG-2", util: 45, maintenance: 500,  revenueGen: 12000 },
];

export function ReportsAnalytics() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Reports & Analytics</h1>
          <p className="text-slate-500 text-sm mt-0.5">Executive overview, financial margins, and operational KPIs</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-white" style={{ background: "#4f46e5", fontWeight: 500 }}>
          <Download size={13} /> Export PDF Report
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Net Revenue (YTD)", value: "$333,000", icon: <TrendingUp size={16} />, color: "text-emerald-600 bg-emerald-50", trend: "+14.5% YoY" },
          { label: "Profit Margin", value: "38.5%", icon: <DollarSign size={16} />, color: "text-blue-600 bg-blue-50", trend: "+2.1% MoM" },
          { label: "OTIF Rate", value: "92.4%", icon: <Target size={16} />, color: "text-indigo-600 bg-indigo-50", trend: "-1.2% MoM" },
          { label: "Avg Turnaround", value: "4.2 Days", icon: <Clock size={16} />, color: "text-purple-600 bg-purple-50", trend: "-0.5 Days" },
          { label: "Maint. Costs", value: "$9,100", icon: <Wrench size={16} />, color: "text-red-600 bg-red-50", trend: "+12% MoM" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>{s.icon}</div>
              <span className={`text-[10px] font-bold ${s.trend.startsWith('-') && s.label !== "Avg Turnaround" ? 'text-red-500' : 'text-emerald-500'}`}>{s.trend}</span>
            </div>
            <p className="text-slate-900 mb-0.5" style={{ fontSize: "1.25rem", fontWeight: 700 }}>{s.value}</p>
            <p className="text-slate-600 text-xs" style={{ fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Revenue vs Cost Analysis */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Financial Performance: Revenue vs Costs vs Profit</h3>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">Last 6 Months</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={financialData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} formatter={(value: number) => [`$${value.toLocaleString()}`]} />
              <Bar dataKey="revenue" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Gross Revenue" barSize={24} />
              <Bar dataKey="cost" fill="#f87171" radius={[4, 4, 0, 0]} name="Op. Costs" barSize={24} />
              <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981", r: 4 }} activeDot={{ r: 6 }} name="Net Profit" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Machine ROI Analysis */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-slate-900 text-sm mb-4" style={{ fontWeight: 600 }}>Machine ROI & Operational Costs</h3>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={machineROI} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="machine" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
              <Bar yAxisId="left" dataKey="revenueGen" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Revenue Generated" barSize={20} />
              <Bar yAxisId="left" dataKey="maintenance" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Maintenance Cost" barSize={20} />
              <Line yAxisId="right" type="monotone" dataKey="util" stroke="#8b5cf6" strokeWidth={2} name="Utilization %" dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* OTIF & Job Status Overview */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-slate-900 text-sm mb-4" style={{ fontWeight: 600 }}>Delivery Performance (OTIF)</h3>
          <div className="flex flex-col md:flex-row items-center h-[200px]">
            <div className="w-full md:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jobsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {jobsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-3 mt-4 md:mt-0">
              {jobsData.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-slate-600">{item.status}</span>
                  </div>
                  <span className="text-sm text-slate-900" style={{ fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Customers Activity */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Top Customers (Revenue & Volume)</h3>
            <span className="flex items-center gap-1 text-xs text-indigo-600 font-medium cursor-pointer hover:underline">View All <TrendingUp size={12} /></span>
          </div>
          <div className="space-y-4">
            {[
              { name: "Metro Retail Group", jobs: 12, revenue: "$45,200", trend: "+12%", otif: "98%" },
              { name: "FreshFarm Foods", jobs: 8, revenue: "$28,500", trend: "+5%", otif: "95%" },
              { name: "Apex Beverages", jobs: 6, revenue: "$18,900", trend: "-2%", otif: "88%" },
              { name: "Sunrise Pharma", jobs: 4, revenue: "$15,400", trend: "+8%", otif: "100%" },
            ].map((customer, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">{customer.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm text-slate-900" style={{ fontWeight: 600 }}>{customer.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{customer.jobs} active jobs · OTIF: <span className={customer.otif === "100%" ? "text-emerald-600 font-medium" : ""}>{customer.otif}</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-900" style={{ fontWeight: 600 }}>{customer.revenue}</p>
                  <p className={`text-xs mt-0.5 font-medium ${customer.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>{customer.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
