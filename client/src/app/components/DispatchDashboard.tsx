import { useState } from "react";
import { Truck, Package, MapPin, Phone, CheckCircle, Clock, AlertCircle, Navigation } from "lucide-react";

const readyForDispatch = [
  { id: "JB-0089", client: "TechPack Industries", address: "Plot 45, MIDC Bhosari, Pune - 411026", items: "Corrugated Box (2,000 pcs)", weight: "280 kg", contact: "Raman Gupta", phone: "+91 98765 43210", scheduledTime: "2:00 PM" },
  { id: "JB-0092", client: "FreshFarm Foods", address: "Survey 112, Vashi, Navi Mumbai - 400703", items: "Flexible Pack (10,000 units)", weight: "45 kg", contact: "Suresh Iyer", phone: "+91 99001 12345", scheduledTime: "4:30 PM" },
  { id: "JB-0083", client: "Himalaya Naturals", address: "B-48, Industrial Area, Kolkata - 700090", items: "Label Roll (50 reels)", weight: "120 kg", contact: "Anita Bose", phone: "+91 97305 88821", scheduledTime: "Tomorrow 10:00 AM" },
];

const inTransit = [
  { id: "JB-0086", client: "Sunrise Pharma", driver: "Ravi Patil", vehicle: "MH-12 AB 4521", departed: "09:30 AM", eta: "02:45 PM", status: "In Transit", location: "Khopoli, NH-48", progress: 65 },
  { id: "JB-0084", client: "Metro Retail Group", driver: "Manoj Tiwari", vehicle: "MH-04 CD 8832", departed: "08:00 AM", eta: "12:30 PM", status: "Delivered", location: "Destination", progress: 100 },
  { id: "JB-0081", client: "Apex Beverages Ltd.", driver: "Sanjay Kulkarni", vehicle: "MH-15 EF 2231", departed: "Yesterday 06:00 PM", eta: "Today 10:00 AM", status: "Delayed", location: "Igatpuri (Breakdown)", progress: 40 },
];

const vehicles = [
  { reg: "MH-12 AB 4521", type: "Tempo (1 ton)", driver: "Ravi Patil", status: "In Transit", job: "JB-0086" },
  { reg: "MH-04 CD 8832", type: "Mini Truck (2 ton)", driver: "Manoj Tiwari", status: "Available", job: "—" },
  { reg: "MH-15 EF 2231", type: "Tempo (1 ton)", driver: "Sanjay Kulkarni", status: "Breakdown", job: "JB-0081" },
  { reg: "MH-08 GH 9900", type: "Large Truck (5 ton)", driver: "Deepak Rao", status: "Available", job: "—" },
];

const vehicleStatusColors: Record<string, string> = {
  "In Transit": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Available": "bg-green-50 text-green-700 border-green-200",
  "Breakdown": "bg-red-50 text-red-700 border-red-200",
  "Scheduled": "bg-amber-50 text-amber-700 border-amber-200",
};

const deliveryStatusColors: Record<string, string> = {
  "In Transit": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Delivered": "bg-green-50 text-green-700 border-green-200",
  "Delayed": "bg-red-50 text-red-700 border-red-200",
};

export function DispatchDashboard() {
  const [selectedDispatch, setSelectedDispatch] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Dispatch Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Today's dispatch schedule — June 17, 2026</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            Delivery Report
          </button>
          <button className="px-3 py-1.5 text-xs rounded-lg text-white transition-colors" style={{ background: "#4f46e5", fontWeight: 500 }}>
            Schedule Dispatch
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Ready for Dispatch", value: readyForDispatch.length, icon: <Package size={16} />, color: "text-amber-600 bg-amber-50" },
          { label: "In Transit", value: inTransit.filter(d => d.status === "In Transit").length, icon: <Truck size={16} />, color: "text-indigo-600 bg-indigo-50" },
          { label: "Delivered Today", value: 1, icon: <CheckCircle size={16} />, color: "text-green-600 bg-green-50" },
          { label: "Delayed Deliveries", value: 1, icon: <AlertCircle size={16} />, color: "text-red-600 bg-red-50" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
            <p className="text-slate-900 mb-0.5" style={{ fontSize: "1.25rem", fontWeight: 700 }}>{s.value}</p>
            <p className="text-slate-600 text-xs" style={{ fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Ready for Dispatch */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Ready for Dispatch</h3>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>{readyForDispatch.length} orders</span>
          </div>
          <div className="divide-y divide-slate-50">
            {readyForDispatch.map((order) => (
              <div key={order.id} className="p-5 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="text-indigo-600 text-xs" style={{ fontWeight: 600 }}>{order.id}</p>
                    <p className="text-slate-800 text-xs mt-0.5" style={{ fontWeight: 700 }}>{order.client}</p>
                    <p className="text-slate-500 text-xs">{order.items}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-slate-400 text-xs">Scheduled</p>
                    <p className="text-slate-700 text-xs" style={{ fontWeight: 600 }}>{order.scheduledTime}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1"><MapPin size={10} /> <span className="truncate">{order.address}</span></span>
                  <span className="flex items-center gap-1"><Package size={10} /> {order.weight}</span>
                  <span className="flex items-center gap-1"><Phone size={10} /> {order.contact}</span>
                  <span className="flex items-center gap-1"><Phone size={10} /> {order.phone}</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 text-xs text-slate-600 border border-slate-200 rounded-lg py-1.5 hover:bg-slate-100 transition-colors" style={{ fontWeight: 500 }}>
                    Assign Vehicle
                  </button>
                  <button className="flex-1 text-xs text-white rounded-lg py-1.5 transition-colors" style={{ background: "#6d28d9", fontWeight: 500 }}>
                    Confirm Dispatch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In Transit */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Delivery Tracking</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {inTransit.map((delivery) => (
              <div key={delivery.id} className="p-5 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-indigo-600 text-xs" style={{ fontWeight: 600 }}>{delivery.id}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded border ${deliveryStatusColors[delivery.status]}`} style={{ fontWeight: 500 }}>
                        {delivery.status}
                      </span>
                    </div>
                    <p className="text-slate-800 text-xs" style={{ fontWeight: 600 }}>{delivery.client}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-400">ETA</p>
                    <p className={`text-xs ${delivery.status === "Delayed" ? "text-red-600" : "text-slate-700"}`} style={{ fontWeight: 600 }}>
                      {delivery.eta}
                    </p>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">Route progress</span>
                    <span className="text-slate-600" style={{ fontWeight: 600 }}>{delivery.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${delivery.status === "Delayed" ? "bg-red-400" : delivery.status === "Delivered" ? "bg-green-500" : "bg-indigo-500"}`}
                      style={{ width: `${delivery.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Navigation size={10} /> {delivery.location}</span>
                  <span className="flex items-center gap-1"><Truck size={10} /> {delivery.vehicle}</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> Dep: {delivery.departed}</span>
                </div>
                {delivery.status === "Delayed" && (
                  <div className="mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-red-700 text-xs" style={{ fontWeight: 500 }}>⚠ Vehicle breakdown reported. Rescue team dispatched.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vehicle Fleet */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Vehicle Fleet Status</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-border">
                {["Registration", "Type", "Driver", "Current Status", "Assigned Job"].map((h) => (
                  <th key={h} className="text-left text-xs text-slate-500 px-5 py-2.5" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.reg} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 text-slate-800 text-xs" style={{ fontWeight: 600 }}>{v.reg}</td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{v.type}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs" style={{ fontWeight: 600 }}>
                        {v.driver.charAt(0)}
                      </div>
                      <span className="text-slate-700 text-xs">{v.driver}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded border text-xs ${vehicleStatusColors[v.status]}`} style={{ fontWeight: 500 }}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-indigo-600 text-xs" style={{ fontWeight: v.job !== "—" ? 600 : 400 }}>{v.job}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
