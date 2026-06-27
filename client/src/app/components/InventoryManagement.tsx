import { useState, useEffect } from "react";
import { AlertTriangle, Package, Plus, Search, TrendingDown, BarChart2, RefreshCw, Edit, Trash2, Save, X, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "../server/api";

type Category = "All" | "Paper" | "Ink" | "Plate" | "Consumables";

interface InventoryItem {
  id: number;
  item: string;
  category: string;
  current: number;
  min: number;
  max: number;
  unit: string;
  unitcost: number;
  supplier: string;
  lastorder?: string;
  created_at?: string;
  updated_at?: string;
}

interface ToastMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

function getStockStatus(current: number, min: number) {
  const pct = current / min;
  if (current === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700 border-red-200", barColor: "bg-red-500" };
  if (pct < 0.5) return { label: "Critical Low", color: "bg-red-50 text-red-700 border-red-200", barColor: "bg-red-500" };
  if (pct < 1) return { label: "Low Stock", color: "bg-amber-50 text-amber-700 border-amber-200", barColor: "bg-amber-500" };
  return { label: "In Stock", color: "bg-green-50 text-green-700 border-green-200", barColor: "bg-green-500" };
}

export function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [formData, setFormData] = useState({
    item: "",
    category: "Paper" as Category,
    current: 0,
    min: 0,
    max: 0,
    unit: "",
    unitcost: 0,
    supplier: "",
    lastorder: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Load inventory from Supabase
  const loadInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('item');

      if (error) throw error;
      if (data) {
        setInventory(data);
      }
    } catch (err) {
      console.error("Failed to load inventory:", err);
      setError("Failed to load inventory. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // Subscribe to real-time changes
  useEffect(() => {
    const subscription = supabase
      .channel('inventory_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory',
        },
        (payload) => {
          console.log('Inventory change:', payload);
          loadInventory();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const filtered = inventory.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      item.item.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const lowStockCount = inventory.filter((i) => i.current < i.min).length;
  const outOfStockCount = inventory.filter((i) => i.current === 0).length;
  const totalValue = inventory.reduce((a, i) => a + i.current * i.unitcost, 0);

  // Handle Add/Update Inventory
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.item.trim()) {
      setToast({ type: 'error', message: "Please enter the item name" });
      return;
    }
    if (!formData.unit.trim()) {
      setToast({ type: 'error', message: "Please enter the unit" });
      return;
    }
    if (formData.current < 0) {
      setToast({ type: 'error', message: "Current stock cannot be negative" });
      return;
    }
    if (formData.min < 0) {
      setToast({ type: 'error', message: "Minimum stock cannot be negative" });
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        item: formData.item.trim(),
        category: formData.category,
        current: formData.current,
        min: formData.min,
        max: formData.max,
        unit: formData.unit.trim(),
        unitcost: formData.unitcost,
        supplier: formData.supplier?.trim() || null,
        lastorder: formData.lastorder || null,
        updated_at: new Date().toISOString(),
      };

      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('inventory')
          .update(payload)
          .eq('id', editingItem.id);

        if (error) throw error;
        setToast({ type: 'success', message: "✅ Inventory item updated successfully!" });
      } else {
        // Add new item
        const { error } = await supabase
          .from('inventory')
          .insert([{
            ...payload,
            created_at: new Date().toISOString(),
          }]);

        if (error) throw error;
        setToast({ type: 'success', message: "✅ Inventory item added successfully!" });
      }

      // Reset form and close modal
      setFormData({
        item: "",
        category: "Paper",
        current: 0,
        min: 0,
        max: 0,
        unit: "",
        unitcost: 0,
        supplier: "",
        lastorder: "",
      });
      setEditingItem(null);
      setShowAddModal(false);
      await loadInventory();
    } catch (err) {
      console.error("Failed to save inventory item:", err);
      setToast({ type: 'error', message: "❌ Failed to save inventory item. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this inventory item? This action cannot be undone.")) return;

    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setToast({ type: 'success', message: "✅ Inventory item deleted successfully!" });
      await loadInventory();
    } catch (err) {
      console.error("Failed to delete inventory item:", err);
      setToast({ type: 'error', message: "❌ Failed to delete inventory item. Please try again." });
    }
  };

  // Open edit modal
  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      item: item.item,
      category: item.category as Category,
      current: item.current,
      min: item.min,
      max: item.max,
      unit: item.unit,
      unitcost: item.unitcost,
      supplier: item.supplier || "",
      lastorder: item.lastorder || "",
    });
    setShowAddModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      item: "",
      category: "Paper",
      current: 0,
      min: 0,
      max: 0,
      unit: "",
      unitcost: 0,
      supplier: "",
      lastorder: "",
    });
    setEditingItem(null);
    setShowAddModal(false);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Item', 'Category', 'Current Stock', 'Min Stock', 'Max Stock', 'Unit', 'Unit Cost', 'Total Value', 'Supplier'];
    const rows = filtered.map(item => [
      item.item,
      item.category,
      item.current,
      item.min,
      item.max,
      item.unit,
      item.unitcost,
      (item.current * item.unitcost).toFixed(2),
      item.supplier
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setToast({ type: 'success', message: "✅ Inventory exported successfully!" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in ${toast.type === 'success' ? 'bg-green-50 border border-green-200' :
            toast.type === 'error' ? 'bg-red-50 border border-red-200' :
              'bg-blue-50 border border-blue-200'
          }`}>
          {toast.type === 'success' && <CheckCircle size={20} className="text-green-600" />}
          {toast.type === 'error' && <XCircle size={20} className="text-red-600" />}
          {toast.type === 'info' && <AlertTriangle size={20} className="text-blue-600" />}
          <span className={`text-sm ${toast.type === 'success' ? 'text-green-800' :
              toast.type === 'error' ? 'text-red-800' :
                'text-blue-800'
            }`}>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Package size={20} className="text-indigo-600" />
                {editingItem ? "Edit Inventory Item" : "Add New Inventory Item"}
              </h3>
              <button onClick={resetForm} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.item}
                    onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                    placeholder="e.g., Art Paper 130gsm"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                    required
                  >
                    <option value="Paper">Paper</option>
                    <option value="Ink">Ink</option>
                    <option value="Plate">Plate</option>
                    <option value="Consumables">Consumables</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g., reams, kg, pcs"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Current Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.current}
                    onChange={(e) => setFormData({ ...formData, current: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Minimum Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.min}
                    onChange={(e) => setFormData({ ...formData, min: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Maximum Stock</label>
                  <input
                    type="number"
                    value={formData.max}
                    onChange={(e) => setFormData({ ...formData, max: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unit Cost (₹)</label>
                  <input
                    type="number"
                    value={formData.unitcost}
                    onChange={(e) => setFormData({ ...formData, unitcost: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Order Date</label>
                  <input
                    type="date"
                    value={formData.lastorder}
                    onChange={(e) => setFormData({ ...formData, lastorder: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="e.g., ITC Papercrafts"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4 mt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {submitting ? "Saving..." : editingItem ? "Update Item" : "Add Item"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Inventory Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">{inventory.length} items · {lowStockCount} low stock alerts</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadInventory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw size={12} /> Refresh
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <BarChart2 size={12} /> Export CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-white transition-colors hover:bg-indigo-700"
            style={{ background: "#4f46e5", fontWeight: 500 }}
          >
            <Plus size={12} /> Add Item
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Items", value: inventory.length, icon: <Package size={16} />, color: "text-indigo-600 bg-indigo-50" },
          { label: "Low Stock Alerts", value: lowStockCount, icon: <AlertTriangle size={16} />, color: "text-amber-600 bg-amber-50" },
          { label: "Out of Stock", value: outOfStockCount, icon: <TrendingDown size={16} />, color: "text-red-600 bg-red-50" },
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
          <button
            onClick={() => {
              const lowStockItems = inventory.filter(i => i.current < i.min);
              alert(`Items to reorder:\n${lowStockItems.map(i => `- ${i.item}: ${i.current} ${i.unit} (Min: ${i.min})`).join('\n')}`);
            }}
            className="text-xs text-amber-700 border border-amber-300 px-3 py-1 rounded-lg hover:bg-amber-100 transition-colors flex-shrink-0"
            style={{ fontWeight: 500 }}
          >
            View Reorder List
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X size={14} />
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
          <span className="text-xs text-slate-400 ml-auto">
            Showing {filtered.length} items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-border">
                {["Item", "Category", "Current Stock", "Min / Max", "Stock Level", "Unit Cost", "Total Value", "Supplier", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs text-slate-500 px-4 py-2.5 whitespace-nowrap" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => {
                const status = getStockStatus(item.current, item.min);
                const fillPct = Math.min((item.current / item.max) * 100, 100);
                return (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-slate-800 text-xs" style={{ fontWeight: 500 }}>{item.item}</p>
                      <p className="text-slate-400 text-xs">#{item.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${item.category === "Paper" ? "bg-indigo-50 text-indigo-700" :
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
                    <td className="px-4 py-3 text-slate-600 text-xs">₹{item.unitcost.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-800 text-xs" style={{ fontWeight: 600 }}>
                      ₹{(item.current * item.unitcost).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{item.supplier || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded border text-xs ${status.color}`} style={{ fontWeight: 500 }}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-border">
          <p className="text-xs text-slate-500">
            Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filtered.length)} of {filtered.length} items
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-xs text-slate-500">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}