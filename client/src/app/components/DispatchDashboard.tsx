import { useState, useEffect } from "react";
import { Package, MapPin, Phone, CheckCircle, RefreshCw } from "lucide-react";
import { supabase, api } from "../../server/api";

interface DispatchOrder {
  id: string;
  client: string;
  address: string;
  items: string;
  contact: string;
  phone: string;
  scheduledTime: string;
}

interface DeliveredOrder {
  id: string;
  client: string;
  dispatchDate: string;
  status: string;
  location: string;
}

interface DashboardData {
  readyForDispatch: DispatchOrder[];
  delivered: DeliveredOrder[];
  kpis: {
    readyCount: number;
    deliveredCount: number;
  };
}

export function DispatchDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.rpc("get_dispatch_dashboard");

      if (error) {
        console.error("Error fetching dispatch dashboard:", error);
      } else if (result) {
        setData(result as DashboardData);
      }
    } catch (err) {
      console.error("Error fetching dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMarkDelivered = async (orderId: string) => {
    if (!confirm(`Are you sure you want to dispatch order ${orderId}?`)) return;

    setProcessingId(orderId);

    try {
      // Get current employee
      const emp = await api.getCurrentEmployee();
      const empId = emp?.employee_id || 1;

      // Use the API method to dispatch
      await api.dispatchProductionOrder(orderId, empId);

      alert(`✅ Order ${orderId} dispatched successfully!`);
      fetchDashboardData(); // Refresh UI
    } catch (error) {
      console.error("Error dispatching order:", error);
      alert(`Failed to dispatch order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading || !data) {
    return (
      <div className="p-6 flex items-center justify-center h-full text-slate-500">
        Loading Dispatch Dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Dispatch Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage ready orders and deliveries</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            disabled={loading}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={() => alert("Delivery Report generation will be available in the Reports module.")}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Delivery Report
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        {[
          { label: "Ready for Dispatch", value: data.kpis.readyCount, icon: <Package size={16} />, color: "text-amber-600 bg-amber-50" },
          { label: "Total Delivered", value: data.kpis.deliveredCount, icon: <CheckCircle size={16} />, color: "text-green-600 bg-green-50" },
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
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>{data.readyForDispatch.length} orders</span>
          </div>
          <div className="divide-y divide-slate-50">
            {data.readyForDispatch.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No orders waiting for dispatch.</div>
            ) : (
              data.readyForDispatch.map((order) => (
                <div key={order.id} className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="text-indigo-600 text-xs" style={{ fontWeight: 600 }}>{order.id}</p>
                      <p className="text-slate-800 text-xs mt-0.5" style={{ fontWeight: 700 }}>{order.client}</p>
                      <p className="text-slate-500 text-xs">{order.items}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1.5"><MapPin size={12} /> <span className="truncate">{order.address}</span></span>
                    <span className="flex items-center gap-1.5"><Phone size={12} /> {order.contact} ({order.phone})</span>
                  </div>
                  <button
                    onClick={() => handleMarkDelivered(order.id)}
                    disabled={processingId === order.id}
                    className="w-full flex items-center justify-center gap-2 text-xs text-white rounded-lg py-2 transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: "#4f46e5", fontWeight: 500 }}
                  >
                    {processingId === order.id ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Dispatch</>
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Delivered */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Delivered Orders</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {data.delivered.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No delivered orders found.</div>
            ) : (
              data.delivered.map((delivery) => (
                <div key={delivery.id} className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-indigo-600 text-xs" style={{ fontWeight: 600 }}>{delivery.id}</p>
                        <span className="text-xs px-1.5 py-0.5 rounded border bg-green-50 text-green-700 border-green-200" style={{ fontWeight: 500 }}>
                          Delivered
                        </span>
                      </div>
                      <p className="text-slate-800 text-xs" style={{ fontWeight: 600 }}>{delivery.client}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-slate-400">Date</p>
                      <p className="text-xs text-slate-700" style={{ fontWeight: 600 }}>
                        {delivery.dispatchDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-green-600 mt-3 pt-3 border-t border-slate-100">
                    <CheckCircle size={14} />
                    <span style={{ fontWeight: 500 }}>Successfully delivered</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}