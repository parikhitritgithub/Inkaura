import { useState } from "react";
import { AlertTriangle, Package, Plus, Search, TrendingDown, BarChart2, RefreshCw } from "lucide-react";

type Category = "All" | "Paper" | "Ink" | "Plate" | "Consumables";

const inventory = [
  { id: "INV-001", item: "Art Paper 130gsm (SRA3)", category: "Paper", current: 8, min: 50, max: 200, unit: "reams", unitCost: 850, supplier: "ITC Papercrafts", lastOrder: "Jun 1, 2026" },
  { id: "INV-002", item: "Art Card 350gsm (SRA3)", category: "Paper", current: 45, min: 30, max: 150, unit: "reams", unitCost: 1200, supplier: "ITC Papercrafts", lastOrder: "Jun 10, 2026" },
  { id: "INV-003", item: "Uncoated Bond 80gsm", category: "Paper", current: 120, min: 40, max: 300, unit: "reams", unitCost: 450, supplier: "JK Paper", lastOrder: "May 28, 2026" },
  { id: "INV-004", item: "Cyan Ink (Process)", category: "Ink", current: 12, min: 25, max: 80, unit: "kg", unitCost: 4200, supplier: "Sun Chemical", lastOrder: "Jun 5, 2026" },
  { id: "INV-005", item: "Magenta Ink (Process)", category: "Ink", current: 18, min: 25, max: 80, unit: "kg", unitCost: 4200, supplier: "Sun Chemical", lastOrder: "Jun 5, 2026" },
  { id: "INV-006", item: "Yellow Ink (Process)", category: "Ink", current: 35, min: 25, max: 80, unit: "kg", unitCost: 3800, supplier: "Sun Chemical", lastOrder: "Jun 5, 2026" },
  { id: "INV-007", item: "Black Ink (Process)", category: "Ink", current: 52, min: 30, max: 100, unit: "kg", unitCost: 2800, supplier: "Sun Chemical", lastOrder: "May 20, 2026" },
  { id: "INV-008", item: "CTP Plate A2 (0.3mm)", category: "Plate", current: 3, min: 10, max: 50, unit: "pcs", unitCost: 1800, supplier: "Agfa Graphics", lastOrder: "Jun 8, 2026" },
  { id: "INV-009", item: "CTP Plate A1 (0.3mm)", category: "Plate", current: 22, min: 10, max: 50, unit: "pcs", unitCost: 2400, supplier: "Agfa Graphics", lastOrder: "Jun 8, 2026" },
  { id: "INV-010", item: "Lamination Film Gloss 27mic", category: "Consumables", current: 6, min: 10, max: 30, unit: "rolls", unitCost: 3200, supplier: "Cosmo Films", lastOrder: "Jun 3, 2026" },
  { id: "INV-011", item: "UV Varnish (Spot)", category: "Consumables", current: 28, min: 15, max: 60, unit: "litres", unitCost: 1500, supplier: "Royal Coatings", lastOrder: "Jun 1, 2026" },
  { id: "INV-012", item: "Blanket Offset (SM52)", category: "Consumables", current: 4, min: 4, max: 12, unit: "pcs", unitCost: 8500, supplier: "Prisco Group", lastOrder: "May 15, 2026" },
];

function getStockStatus(current: number, min: number) {
  const pct = current / min;
  if (current === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700 border-red-200", barColor: "bg-red-500" };
  if (pct < 0.5) return { label: "Critical Low", color: "bg-red-50 text-red-700 border-red-200", barColor: "bg-red-500" };
  if (pct < 1) return { label: "Low Stock", color: "bg-amber-50 text-amber-700 border-amber-200", barColor: "bg-amber-500" };
  return { label: "In Stock", color: "bg-green-50 text-green-700 border-green-200", barColor: "bg-green-500" };
}

export function InventoryManagement() {
  const [category, setCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");

  const filtered = inventory.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      item.item.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = inventory.filter((i) => i.current < i.min).length;
  const totalValue = inventory.reduce((a, i) => a + i.current * i.unitCost, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Inventory Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">{inventory.length} items · {lowStockCount} low stock alerts</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <RefreshCw size={12} /> Issue Material
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-white transition-colors" style={{ background: "#4f46e5", fontWeight: 500 }}>
            <Plus size={12} /> Add Item
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Items", value: inventory.length, icon: <Package size={16} />, color: "text-indigo-600 bg-indigo-50" },
          { label: "Low Stock Alerts", value: lowStockCount, icon: <AlertTriangle size={16} />, color: "text-amber-600 bg-amber-50" },
          { label: "Out of Stock", value: inventory.filter(i => i.current === 0).length, icon: <TrendingDown size={16} />, color: "text-red-600 bg-red-50" },
          { label: "Inventory Value", value: `₹${(totalValue / 100000).toFixed(1)}L`, icon: <BarChart2 size={16} />, color: "text-green-600 bg-green-50" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
            <p className="text-slate-900 mb-0.5" style={{ fontSize: "1.25rem", fontWeight: 700 }}>{s.value}</p>
            <p className="text-slate-600 text-xs" style={{ fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Low stock alert strip */}
      {lowStockCount > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
          <p className="text-amber-800 text-sm flex-1">
            <span style={{ fontWeight: 600 }}>{lowStockCount} items</span> are below minimum stock level. Consider reordering immediately.
          </p>
          <button className="text-xs text-amber-700 border border-amber-300 px-3 py-1 rounded-lg hover:bg-amber-100 transition-colors flex-shrink-0" style={{ fontWeight: 500 }}>
            Reorder All
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-border flex-wrap">
          <div className="relative flex-1 min-w-44">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inventory..."
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            {(["All", "Paper", "Ink", "Plate", "Consumables"] as Category[]).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 text-xs transition-colors ${category === c ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
                style={{ fontWeight: category === c ? 500 : 400 }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-border">
                {["Item", "Category", "Current Stock", "Min / Max", "Stock Level", "Unit Cost", "Total Value", "Supplier", "Status"].map((h) => (
                  <th key={h} className="text-left text-xs text-slate-500 px-4 py-2.5 whitespace-nowrap" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const status = getStockStatus(item.current, item.min);
                const fillPct = Math.min((item.current / item.max) * 100, 100);
                return (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-slate-800 text-xs" style={{ fontWeight: 500 }}>{item.item}</p>
                      <p className="text-slate-400 text-xs">{item.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        item.category === "Paper" ? "bg-indigo-50 text-indigo-700" :
                        item.category === "Ink" ? "bg-purple-50 text-purple-700" :
                        item.category === "Plate" ? "bg-sky-50 text-sky-700" :
                        "bg-slate-100 text-slate-600"
                      }`} style={{ fontWeight: 500 }}>{item.category}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-800 text-xs" style={{ fontWeight: 700 }}>
                      {item.current} {item.unit}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{item.min} / {item.max} {item.unit}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className={`h-full rounded-full ${status.barColor}`} style={{ width: `${fillPct}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{Math.round(fillPct)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">₹{item.unitCost.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-800 text-xs" style={{ fontWeight: 600 }}>
                      ₹{(item.current * item.unitCost).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{item.supplier}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded border text-xs ${status.color}`} style={{ fontWeight: 500 }}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-border">
          <p className="text-xs text-slate-500">Showing {filtered.length} of {inventory.length} items</p>
          <button className="text-xs text-indigo-600 hover:text-indigo-700" style={{ fontWeight: 500 }}>Export to Excel</button>
        </div>
      </div>
    </div>
  );
}
