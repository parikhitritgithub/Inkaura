import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from "recharts";
import {
  DollarSign, TrendingUp, TrendingDown, AlertCircle, Download,
  Plus, CheckCircle, Clock, XCircle, RefreshCw, Save, X,
  User, Calendar, FileText, Send, Package, Edit2, Eye, Trash2
} from "lucide-react";
import { api, supabase } from "../server/api";

// Types
interface Invoice {
  id: string;
  client: string;
  amount: number;
  due: string;
  issued: string;
  status: "Paid" | "Pending" | "Overdue";
  quotationId?: string;
  productionJobId?: string;
  notes?: string;
}

interface MonthlyData {
  month: string;
  revenue: number;
  expense: number;
}

interface ExpenseCategory {
  category: string;
  amount: number;
  pct: number;
}

// Colors
const expenseColors = ["bg-indigo-500", "bg-purple-500", "bg-amber-500", "bg-green-500", "bg-sky-500", "bg-slate-400"];
const pieColors = ["#4f46e5", "#8b5cf6", "#f59e0b", "#10b981", "#0ea5e9", "#94a3b8"];

// Invoice Status Options
const INVOICE_STATUS_OPTIONS = ["Paid", "Pending", "Overdue"] as const;

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
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs ${s[status] || "bg-slate-50 text-slate-600 border-slate-200"}`} style={{ fontWeight: 500 }}>
      {icons[status]} {status}
    </span>
  );
}

export function FinanceDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [revenueMonthly, setRevenueMonthly] = useState<MonthlyData[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<ExpenseCategory[]>([]);

  // Summary stats
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [margin, setMargin] = useState("0");
  const [pendingAmount, setPendingAmount] = useState(0);
  const [overdueAmount, setOverdueAmount] = useState(0);

  // Create Invoice Modal State
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [creating, setCreating] = useState(false);
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
  const [productionJobs, setProductionJobs] = useState<{
    id: string;
    product: string;
    customer: string;
    value: number;
    quantity: number;
    status: string;
    quotationId: string;
  }[]>([]);
  const [invoiceForm, setInvoiceForm] = useState({
    customerId: "",
    productionJobId: "",
    amount: 0,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: "",
    manualAmount: false,
  });

  // View Invoice Modal State
  const [showViewInvoice, setShowViewInvoice] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  // Status Update State
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadFinanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const productionJobsData = await api.getProductionJobs();
      const quotations = await api.getQuotations();

      const monthlyMap: Record<string, { revenue: number; expense: number }> = {};
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      months.forEach(m => {
        monthlyMap[m] = { revenue: 0, expense: 0 };
      });

      productionJobsData.forEach(job => {
        const createdDate = new Date(job.createdDate);
        const monthIndex = createdDate.getMonth();
        const monthName = months[monthIndex] || "Jan";

        if (monthlyMap[monthName]) {
          monthlyMap[monthName].revenue += job.value || 0;
          monthlyMap[monthName].expense += (job.value || 0) * 0.65;
        }
      });

      quotations.forEach(q => {
        if (q.status === "Approved" || q.status === "Sent") {
          const date = new Date(q.date);
          const monthIndex = date.getMonth();
          const monthName = months[monthIndex] || "Jan";

          if (monthlyMap[monthName]) {
            monthlyMap[monthName].revenue += q.commercials.total || 0;
            monthlyMap[monthName].expense += (q.commercials.total || 0) * 0.6;
          }
        }
      });

      const monthlyData: MonthlyData[] = months.map(month => ({
        month,
        revenue: Math.round(monthlyMap[month]?.revenue || 0),
        expense: Math.round(monthlyMap[month]?.expense || 0),
      }));

      setRevenueMonthly(monthlyData);

      const rev = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
      const exp = monthlyData.reduce((sum, m) => sum + m.expense, 0);
      const profit = rev - exp;

      setTotalRevenue(rev);
      setTotalExpense(exp);
      setNetProfit(profit);
      setMargin(rev > 0 ? ((profit / rev) * 100).toFixed(1) : "0");

      const generatedInvoices: Invoice[] = productionJobsData.slice(0, 7).map((job, index) => {
        const statuses: ("Paid" | "Pending" | "Overdue")[] = ["Paid", "Pending", "Overdue", "Paid", "Pending", "Overdue", "Paid"];
        const dueDate = new Date(job.dueDate);
        dueDate.setDate(dueDate.getDate() + 15);

        return {
          id: `INV-${String(1400 + index).padStart(4, '0')}`,
          client: job.customer,
          amount: job.value || Math.round(job.quantity * 50 + Math.random() * 10000),
          issued: new Date(job.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          due: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: statuses[index % statuses.length],
          quotationId: job.quotationId,
          productionJobId: job.id,
          notes: `Invoice for ${job.product} - ${job.quantity} units`,
        };
      });

      setInvoices(generatedInvoices);

      const pending = generatedInvoices
        .filter(i => i.status === "Pending")
        .reduce((sum, i) => sum + i.amount, 0);
      const overdue = generatedInvoices
        .filter(i => i.status === "Overdue")
        .reduce((sum, i) => sum + i.amount, 0);

      setPendingAmount(pending);
      setOverdueAmount(overdue);

      const totalExp = monthlyData.reduce((sum, m) => sum + m.expense, 0);
      if (totalExp > 0) {
        const expenseCategories: ExpenseCategory[] = [
          { category: "Raw Materials", amount: Math.round(totalExp * 0.48), pct: 0 },
          { category: "Labour", amount: Math.round(totalExp * 0.24), pct: 0 },
          { category: "Electricity", amount: Math.round(totalExp * 0.10), pct: 0 },
          { category: "Maintenance", amount: Math.round(totalExp * 0.075), pct: 0 },
          { category: "Transport", amount: Math.round(totalExp * 0.05), pct: 0 },
          { category: "Others", amount: Math.round(totalExp * 0.055), pct: 0 },
        ];

        expenseCategories.forEach(cat => {
          cat.pct = Math.round((cat.amount / totalExp) * 100);
        });

        setExpenses(expenseCategories);
      } else {
        setExpenses([
          { category: "Raw Materials", amount: 82000, pct: 48 },
          { category: "Labour", amount: 41000, pct: 24 },
          { category: "Electricity", amount: 17100, pct: 10 },
          { category: "Maintenance", amount: 12825, pct: 7.5 },
          { category: "Transport", amount: 8550, pct: 5 },
          { category: "Others", amount: 9525, pct: 5.5 },
        ]);
      }

    } catch (err) {
      console.error("Failed to load finance data:", err);
      setError("Failed to load financial data. Please try again.");
      setDefaultData();
    } finally {
      setLoading(false);
    }
  };

  const setDefaultData = () => {
    const defaultMonthly = [
      { month: "Jan", revenue: 182000, expense: 124000 },
      { month: "Feb", revenue: 195000, expense: 131000 },
      { month: "Mar", revenue: 168000, expense: 118000 },
      { month: "Apr", revenue: 221000, expense: 145000 },
      { month: "May", revenue: 247000, expense: 162000 },
      { month: "Jun", revenue: 263000, expense: 171000 },
    ];
    setRevenueMonthly(defaultMonthly);

    const rev = defaultMonthly.reduce((sum, m) => sum + m.revenue, 0);
    const exp = defaultMonthly.reduce((sum, m) => sum + m.expense, 0);
    setTotalRevenue(rev);
    setTotalExpense(exp);
    setNetProfit(rev - exp);
    setMargin(((rev - exp) / rev * 100).toFixed(1));

    setInvoices([
      { id: "INV-0142", client: "Apex Beverages Ltd.", amount: 79650, due: "Jun 22, 2026", issued: "Jun 16, 2026", status: "Pending", notes: "Label printing order" },
      { id: "INV-0141", client: "Sunrise Pharma", amount: 236000, due: "Jun 28, 2026", issued: "Jun 14, 2026", status: "Pending", notes: "Blister packaging" },
      { id: "INV-0140", client: "Metro Retail Group", amount: 134520, due: "Jun 19, 2026", issued: "Jun 13, 2026", status: "Overdue", notes: "Retail packaging" },
      { id: "INV-0139", client: "FreshFarm Foods", amount: 53100, due: "Jun 10, 2026", issued: "Jun 4, 2026", status: "Paid", notes: "Food labels" },
      { id: "INV-0138", client: "Himalaya Naturals", amount: 183300, due: "Jun 8, 2026", issued: "Jun 2, 2026", status: "Paid", notes: "Natural products packaging" },
    ]);

    setPendingAmount(315650);
    setOverdueAmount(134520);

    setExpenses([
      { category: "Raw Materials", amount: 82000, pct: 48 },
      { category: "Labour", amount: 41000, pct: 24 },
      { category: "Electricity", amount: 17100, pct: 10 },
      { category: "Maintenance", amount: 12825, pct: 7.5 },
      { category: "Transport", amount: 8550, pct: 5 },
      { category: "Others", amount: 9525, pct: 5.5 },
    ]);
  };

  // Load dropdown data for create invoice
  const loadDropdownData = async () => {
    try {
      console.log("🔄 Loading dropdown data...");

      const customersData = await api.getCustomers();
      console.log("✅ Customers loaded:", customersData.length);
      setCustomers(customersData.map(c => ({ id: c.id, name: c.name })));

      const jobsData = await api.getProductionJobs();
      console.log("✅ Production jobs loaded:", jobsData.length);

      setProductionJobs(jobsData.map(j => ({
        id: j.id,
        product: j.product,
        customer: j.customer,
        value: j.value || 0,
        quantity: j.quantity || 0,
        status: j.status,
        quotationId: j.quotationId,
      })));
    } catch (err) {
      console.error("❌ Failed to load dropdown data:", err);
    }
  };

  // Calculate estimated amount from job
  const calculateEstimatedAmount = (job: any): number => {
    if (job.value && job.value > 0) {
      return job.value;
    }
    if (job.quantity && job.quantity > 0) {
      const perUnitRate = 50;
      return job.quantity * perUnitRate;
    }
    return 0;
  };

  // Handle customer selection - filter jobs
  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    console.log("👤 Customer selected:", customer?.name);

    setInvoiceForm({
      ...invoiceForm,
      customerId,
      productionJobId: "",
      amount: 0,
      manualAmount: false,
    });
  };

  // Handle production job selection - auto-fetch amount
  const handleJobChange = (jobId: string) => {
    console.log("🔍 Job selected:", jobId);
    const job = productionJobs.find(j => j.id === jobId);

    if (job) {
      console.log("📊 Job details:", {
        id: job.id,
        product: job.product,
        value: job.value,
        quantity: job.quantity,
        status: job.status,
      });

      const estimatedAmount = calculateEstimatedAmount(job);
      console.log("💰 Estimated amount:", estimatedAmount);

      setInvoiceForm({
        ...invoiceForm,
        productionJobId: jobId,
        amount: estimatedAmount,
        manualAmount: false,
      });

      console.log("✅ Amount set to:", estimatedAmount);
    } else {
      console.log("❌ Job not found");
      setInvoiceForm({
        ...invoiceForm,
        productionJobId: jobId,
        amount: 0,
        manualAmount: false,
      });
    }
  };

  // Handle manual amount change
  const handleAmountChange = (value: number) => {
    setInvoiceForm({
      ...invoiceForm,
      amount: value,
      manualAmount: true,
    });
  };

  // Handle create invoice
  const handleCreateInvoice = async () => {
    if (!invoiceForm.customerId) {
      alert("Please select a customer");
      return;
    }
    if (!invoiceForm.productionJobId) {
      alert("Please select a production job");
      return;
    }
    if (invoiceForm.amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setCreating(true);

      const invoiceId = `INV-${String(1500 + invoices.length + 1).padStart(4, '0')}`;
      const customer = customers.find(c => c.id === invoiceForm.customerId);
      const job = productionJobs.find(j => j.id === invoiceForm.productionJobId);

      const newInvoice: Invoice = {
        id: invoiceId,
        client: customer?.name || "Unknown",
        amount: invoiceForm.amount,
        issued: new Date(invoiceForm.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        due: new Date(invoiceForm.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: "Pending",
        productionJobId: invoiceForm.productionJobId,
        notes: invoiceForm.notes || `Invoice for ${job?.product}`,
      };

      setInvoices(prev => [newInvoice, ...prev]);
      setPendingAmount(prev => prev + invoiceForm.amount);

      setInvoiceForm({
        customerId: "",
        productionJobId: "",
        amount: 0,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: "",
        manualAmount: false,
      });
      setShowCreateInvoice(false);

      alert(`Invoice ${invoiceId} created successfully for ${customer?.name}!`);

    } catch (err) {
      console.error("Failed to create invoice:", err);
      alert("Failed to create invoice. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  // Open create invoice modal
  const openCreateInvoice = () => {
    loadDropdownData();
    setShowCreateInvoice(true);
  };

  // Handle invoice status update
  const handleInvoiceStatusUpdate = async (invoiceId: string, newStatus: "Paid" | "Pending" | "Overdue") => {
    if (!confirm(`Change invoice ${invoiceId} status to "${newStatus}"?`)) return;

    try {
      setUpdatingStatus(true);

      // Update local state
      setInvoices(prev => prev.map(inv =>
        inv.id === invoiceId ? { ...inv, status: newStatus } : inv
      ));

      // Update totals
      const updatedInvoices = invoices.map(inv =>
        inv.id === invoiceId ? { ...inv, status: newStatus } : inv
      );

      const pending = updatedInvoices
        .filter(i => i.status === "Pending")
        .reduce((sum, i) => sum + i.amount, 0);
      const overdue = updatedInvoices
        .filter(i => i.status === "Overdue")
        .reduce((sum, i) => sum + i.amount, 0);

      setPendingAmount(pending);
      setOverdueAmount(overdue);

      // Here you would also update the database if you have an invoices table
      console.log(`Invoice ${invoiceId} status updated to ${newStatus}`);

    } catch (err) {
      console.error("Failed to update invoice status:", err);
      alert("Failed to update invoice status. Please try again.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Get filtered jobs based on selected customer
  const getFilteredJobs = () => {
    if (!invoiceForm.customerId) return productionJobs;
    const customer = customers.find(c => c.id === invoiceForm.customerId);
    const filtered = productionJobs.filter(j => j.customer === customer?.name);
    return filtered;
  };

  // Open view invoice modal
  const openViewInvoice = (invoice: Invoice) => {
    setViewingInvoice(invoice);
    setShowViewInvoice(true);
  };

  useEffect(() => {
    loadFinanceData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading financial data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <div className="text-red-600 text-lg mb-4">⚠️ {error}</div>
        <button
          onClick={loadFinanceData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const filteredJobs = getFilteredJobs();
  const selectedJob = productionJobs.find(j => j.id === invoiceForm.productionJobId);
  const estimatedAmount = selectedJob ? calculateEstimatedAmount(selectedJob) : 0;

  return (
    <div className="p-6 space-y-6">
      {/* View Invoice Modal */}
      {showViewInvoice && viewingInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText size={20} className="text-indigo-600" /> Invoice Details
              </h3>
              <button
                onClick={() => setShowViewInvoice(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-indigo-600">{viewingInvoice.id}</p>
                    <StatusBadge status={viewingInvoice.status} />
                  </div>
                  <p className="text-sm text-slate-500 mt-1">Client: {viewingInvoice.client}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Amount</p>
                  <p className="text-2xl font-bold text-slate-900">₹{viewingInvoice.amount.toLocaleString()}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Invoice ID</p>
                  <p className="text-sm font-semibold text-slate-900">{viewingInvoice.id}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Client</p>
                  <p className="text-sm font-semibold text-slate-900">{viewingInvoice.client}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Amount</p>
                  <p className="text-sm font-semibold text-slate-900">₹{viewingInvoice.amount.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Issue Date</p>
                  <p className="text-sm font-semibold text-slate-900">{viewingInvoice.issued}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Due Date</p>
                  <p className={`text-sm font-semibold ${viewingInvoice.status === "Overdue" ? "text-red-600" : "text-slate-900"}`}>
                    {viewingInvoice.due}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Status</p>
                  <StatusBadge status={viewingInvoice.status} />
                </div>
              </div>

              {/* Notes */}
              {viewingInvoice.notes && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Notes</p>
                  <p className="text-sm text-slate-700 mt-1">{viewingInvoice.notes}</p>
                </div>
              )}

              {/* Production Job Reference */}
              {viewingInvoice.productionJobId && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Production Job Reference</p>
                  <p className="text-sm font-semibold text-indigo-600 mt-1">{viewingInvoice.productionJobId}</p>
                </div>
              )}

              {/* Status Update Actions */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-700 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {INVOICE_STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setShowViewInvoice(false);
                        handleInvoiceStatusUpdate(viewingInvoice.id, status);
                      }}
                      disabled={status === viewingInvoice.status || updatingStatus}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${status === viewingInvoice.status
                          ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-default'
                          : status === 'Paid'
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            : status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                              : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      Mark as {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showCreateInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText size={20} className="text-indigo-600" /> Create Invoice
              </h3>
              <button
                onClick={() => setShowCreateInvoice(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Customer */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Customer <span className="text-red-500">*</span>
                </label>
                <select
                  value={invoiceForm.customerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                >
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Production Job */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Production Job <span className="text-red-500">*</span>
                </label>
                <select
                  value={invoiceForm.productionJobId}
                  onChange={(e) => handleJobChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                >
                  <option value="">Select Production Job</option>
                  {filteredJobs.length === 0 ? (
                    <option value="" disabled>No jobs found for this customer</option>
                  ) : (
                    filteredJobs.map((j) => {
                      const estAmount = calculateEstimatedAmount(j);
                      return (
                        <option key={j.id} value={j.id}>
                          {j.id} - {j.product}
                          {estAmount > 0 ? ` (Est. ₹${estAmount.toLocaleString()})` : ' (No value set)'}
                          - {j.status}
                        </option>
                      );
                    })
                  )}
                </select>
                {invoiceForm.customerId && filteredJobs.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    No production jobs found for this customer
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={invoiceForm.amount || ''}
                    onChange={(e) => handleAmountChange(parseFloat(e.target.value) || 0)}
                    placeholder={invoiceForm.productionJobId ? "Amount auto-filled from job" : "Select a job to auto-fill amount"}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  />
                  {invoiceForm.productionJobId && !invoiceForm.manualAmount && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Auto-filled</span>
                    </div>
                  )}
                  {invoiceForm.productionJobId && invoiceForm.manualAmount && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Manual</span>
                    </div>
                  )}
                </div>
                {invoiceForm.productionJobId && (
                  <div className="mt-1">
                    {estimatedAmount > 0 && !invoiceForm.manualAmount && (
                      <p className="text-xs text-green-600">
                        ✅ Estimated amount: ₹{estimatedAmount.toLocaleString()}
                        {selectedJob?.value === 0 ? ' (calculated from quantity)' : ''}
                      </p>
                    )}
                    {estimatedAmount > 0 && invoiceForm.manualAmount && (
                      <p className="text-xs text-slate-400">
                        💡 Estimated amount: ₹{estimatedAmount.toLocaleString()}
                        <button
                          className="text-indigo-600 hover:text-indigo-800 ml-1 underline"
                          onClick={() => {
                            setInvoiceForm({
                              ...invoiceForm,
                              amount: estimatedAmount,
                              manualAmount: false,
                            });
                          }}
                        >
                          Use estimated
                        </button>
                      </p>
                    )}
                    {estimatedAmount === 0 && (
                      <p className="text-xs text-amber-600">
                        ⚠️ No value set for this job. Please enter amount manually.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Issue Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Issue Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={invoiceForm.issueDate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, issueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                <textarea
                  value={invoiceForm.notes}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })}
                  placeholder="Add any additional notes..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none"
                />
              </div>

              {/* Job Details Summary */}
              {selectedJob && (
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <p className="text-xs font-medium text-slate-700 mb-2">Job Details</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500">Job ID:</span>
                      <span className="text-slate-700 font-medium ml-1">{selectedJob.id}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Product:</span>
                      <span className="text-slate-700 font-medium ml-1">{selectedJob.product}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Quantity:</span>
                      <span className="text-slate-700 font-medium ml-1">
                        {selectedJob.quantity?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Status:</span>
                      <span className="text-slate-700 font-medium ml-1">{selectedJob.status}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500">Quotation:</span>
                      <span className="text-slate-700 font-medium ml-1">{selectedJob.quotationId || 'N/A'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500">Estimated Amount:</span>
                      <span className="text-indigo-600 font-medium ml-1">
                        ₹{calculateEstimatedAmount(selectedJob).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={() => setShowCreateInvoice(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateInvoice}
                disabled={creating}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {creating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Create Invoice
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Finance & Reports</h1>
          <p className="text-slate-500 text-sm mt-0.5">Financial year 2025–26 · January to June 2026</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadFinanceData}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw size={12} /> Refresh
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={12} /> Export P&L
          </button>
          <button
            onClick={openCreateInvoice}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-white transition-colors hover:bg-indigo-700"
            style={{ background: "#4f46e5", fontWeight: 500 }}
          >
            <Plus size={12} /> Create Invoice
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue (H1)", value: `₹${(totalRevenue / 100000).toFixed(1)}L`, change: "+12.4% YoY", up: true, icon: <TrendingUp size={16} />, color: "text-indigo-600 bg-indigo-50" },
          { label: "Net Profit", value: `₹${(netProfit / 100000).toFixed(1)}L`, change: `${margin}% margin`, up: Number(margin) > 0, icon: <DollarSign size={16} />, color: "text-green-600 bg-green-50" },
          { label: "Pending Invoices", value: `₹${(pendingAmount / 100000).toFixed(1)}L`, change: `${invoices.filter(i => i.status === "Pending").length} invoices`, up: false, icon: <Clock size={16} />, color: "text-amber-600 bg-amber-50" },
          { label: "Overdue Amount", value: `₹${(overdueAmount / 100000).toFixed(1)}L`, change: `${invoices.filter(i => i.status === "Overdue").length} invoices`, up: false, icon: <AlertCircle size={16} />, color: "text-red-600 bg-red-50" },
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
          <h3 className="text-slate-900 text-sm mb-4" style={{ fontWeight: 600 }}>Expense Breakdown</h3>
          <div className="space-y-3">
            {expenses.map((exp, i) => (
              <div key={exp.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">{exp.category}</span>
                  <span className="text-xs text-slate-800" style={{ fontWeight: 600 }}>₹{(exp.amount / 1000).toFixed(0)}k ({exp.pct}%)</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${expenseColors[i]}`} style={{ width: `${Math.min(exp.pct * 2, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600" style={{ fontWeight: 500 }}>Total Expenses</span>
              <span className="text-slate-900" style={{ fontWeight: 700 }}>₹{(totalExpense / 1000).toFixed(0)}k</span>
            </div>
            <div className="flex justify-between text-xs mt-1.5">
              <span className="text-slate-600" style={{ fontWeight: 500 }}>Net Profit</span>
              <span className="text-green-600" style={{ fontWeight: 700 }}>₹{(netProfit / 1000).toFixed(0)}k ({margin}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Management */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Invoice Management</h3>
          <div className="flex gap-3">
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
                      {/* Status Dropdown */}
                      <select
                        value={inv.status}
                        onChange={(e) => handleInvoiceStatusUpdate(inv.id, e.target.value as "Paid" | "Pending" | "Overdue")}
                        className="text-xs border border-slate-200 rounded px-1.5 py-1 bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 max-w-[90px]"
                        disabled={updatingStatus}
                      >
                        {INVOICE_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      {/* View Button */}
                      <button
                        onClick={() => openViewInvoice(inv)}
                        className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                        style={{ fontWeight: 500 }}
                      >
                        <Eye size={12} /> View
                      </button>

                      {inv.status !== "Paid" && (
                        <button className="text-xs text-green-600 hover:text-green-700" style={{ fontWeight: 500 }}>
                          Record Payment
                        </button>
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