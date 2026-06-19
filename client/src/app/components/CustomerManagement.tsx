import { useState } from "react";
import { Plus, Search, Filter, Mail, Phone, MapPin, X, ChevronDown, Eye, Edit2, Trash2 } from "lucide-react";

const customers = [
  { id: "CU-001", name: "Rajiv Sharma", company: "Apex Beverages Ltd.", email: "rajiv@apexbev.com", phone: "+91 98201 44512", city: "Mumbai", orders: 24, revenue: "₹8,42,500", since: "Mar 2023", status: "Active" },
  { id: "CU-002", name: "Priya Nair", company: "Metro Retail Group", email: "priya@metro.in", phone: "+91 97305 28410", city: "Delhi", orders: 18, revenue: "₹5,18,000", since: "Jul 2023", status: "Active" },
  { id: "CU-003", name: "Ankit Verma", company: "FreshFarm Foods", email: "ankit@freshfarm.in", phone: "+91 99001 55321", city: "Pune", orders: 12, revenue: "₹3,67,250", since: "Jan 2024", status: "Active" },
  { id: "CU-004", name: "Sunita Kapoor", company: "Sunrise Pharma", email: "sunita@sunrisepharma.com", phone: "+91 98765 12300", city: "Ahmedabad", orders: 31, revenue: "₹12,18,000", since: "Nov 2022", status: "Active" },
  { id: "CU-005", name: "Mohit Gupta", company: "Classic Gifts Co.", email: "mohit@classicgifts.in", phone: "+91 98450 67890", city: "Chennai", orders: 6, revenue: "₹1,45,000", since: "Feb 2024", status: "Inactive" },
  { id: "CU-006", name: "Deepa Menon", company: "TechPack Industries", email: "deepa@techpack.com", phone: "+91 99712 33400", city: "Bangalore", orders: 22, revenue: "₹7,98,500", since: "May 2023", status: "Active" },
  { id: "CU-007", name: "Arjun Pillai", company: "Himalaya Naturals", email: "arjun@himalaya.in", phone: "+91 98001 22133", city: "Kolkata", orders: 15, revenue: "₹4,55,000", since: "Aug 2023", status: "Active" },
  { id: "CU-008", name: "Kavita Joshi", company: "PrintMart Pvt. Ltd.", email: "kavita@printmart.in", phone: "+91 99550 18800", city: "Hyderabad", orders: 9, revenue: "₹2,10,000", since: "Apr 2024", status: "Active" },
];

interface AddCustomerFormProps {
  onClose: () => void;
}

function AddCustomerForm({ onClose }: AddCustomerFormProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>Add New Customer</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-600 mb-1.5" style={{ fontWeight: 500 }}>First Name</label>
              <input className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="First name" />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1.5" style={{ fontWeight: 500 }}>Last Name</label>
              <input className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="Last name" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1.5" style={{ fontWeight: 500 }}>Company Name</label>
            <input className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="Company Pvt. Ltd." />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1.5" style={{ fontWeight: 500 }}>Email Address</label>
            <input type="email" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="email@company.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-600 mb-1.5" style={{ fontWeight: 500 }}>Phone Number</label>
              <input className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="+91 XXXXX XXXXX" />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1.5" style={{ fontWeight: 500 }}>City</label>
              <input className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="City" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1.5" style={{ fontWeight: 500 }}>Billing Address</label>
            <textarea className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none" rows={2} placeholder="Full billing address" />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1.5" style={{ fontWeight: 500 }}>Credit Limit (₹)</label>
            <input type="number" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="500000" />
          </div>
        </div>
        <div className="flex gap-2 justify-end px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm rounded-lg text-white transition-colors" style={{ background: "#4f46e5", fontWeight: 500 }}>
            Create Customer
          </button>
        </div>
      </div>
    </div>
  );
}

export function CustomerManagement() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = customers.filter(
    (c) =>
      (statusFilter === "All" || c.status === statusFilter) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      {showForm && <AddCustomerForm onClose={() => setShowForm(false)} />}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Customer Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">{customers.length} customers · {customers.filter(c => c.status === "Active").length} active</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg text-white transition-colors"
          style={{ background: "#4f46e5", fontWeight: 500 }}
        >
          <Plus size={14} /> Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: "178", sub: "+5 this month" },
          { label: "Active", value: "162", sub: "91% retention rate" },
          { label: "Total Revenue", value: "₹1.2Cr", sub: "All time" },
          { label: "Avg. Order Value", value: "₹87,500", sub: "Per order" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-slate-900 mb-0.5" style={{ fontSize: "1.25rem", fontWeight: 700 }}>{s.value}</p>
            <p className="text-slate-700 text-xs" style={{ fontWeight: 500 }}>{s.label}</p>
            <p className="text-slate-400 text-xs mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-border flex-wrap">
          <div className="relative flex-1 min-w-44">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            {["All", "Active", "Inactive"].map((f) => (
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
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={12} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-border">
                {["Customer", "Company", "Contact", "City", "Orders", "Revenue", "Since", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs text-slate-500 px-5 py-2.5 whitespace-nowrap" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs flex-shrink-0" style={{ fontWeight: 600 }}>
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-slate-800 text-xs whitespace-nowrap" style={{ fontWeight: 500 }}>{c.name}</p>
                        <p className="text-slate-400 text-xs">{c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600 text-xs whitespace-nowrap">{c.company}</td>
                  <td className="px-5 py-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Mail size={10} /> {c.email}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Phone size={10} /> {c.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><MapPin size={10} /> {c.city}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-800 text-xs" style={{ fontWeight: 600 }}>{c.orders}</td>
                  <td className="px-5 py-3 text-slate-800 text-xs" style={{ fontWeight: 600 }}>{c.revenue}</td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{c.since}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${c.status === "Active" ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-100 text-slate-500 border-slate-200"}`} style={{ fontWeight: 500 }}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-slate-400 hover:text-indigo-600 transition-colors"><Eye size={14} /></button>
                      <button className="text-slate-400 hover:text-amber-600 transition-colors"><Edit2 size={14} /></button>
                      <button className="text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-border">
          <p className="text-xs text-slate-500">Showing {filtered.length} of {customers.length} customers</p>
          <div className="flex gap-1">
            {[1, 2, 3].map((p) => (
              <button key={p} className={`w-6 h-6 rounded text-xs ${p === 1 ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
