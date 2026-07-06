// /components/QuotationViewModal.tsx
import { useState, useEffect } from "react";
import {
    X, Package, User, Calendar, DollarSign, FileText, Clock,
    CheckCircle, AlertCircle, Eye, Truck, Factory, Activity
} from "lucide-react";
import { api, QuotationData } from "../server/api";

interface QuotationViewModalProps {
    quotationId: string;
    onClose: () => void;
}

export function QuotationViewModal({ quotationId, onClose }: QuotationViewModalProps) {
    const [quotation, setQuotation] = useState<QuotationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuotation = async () => {
            try {
                setLoading(true);
                const data = await api.getQuotationById(quotationId);
                setQuotation(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load quotation');
            } finally {
                setLoading(false);
            }
        };
        if (quotationId) {
            fetchQuotation();
        }
    }, [quotationId]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-8 max-w-4xl w-full mx-4">
                    <div className="flex items-center justify-center h-32">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-slate-500">Loading quotation details...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !quotation) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-red-600">Error</h3>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>
                    <p className="text-sm text-red-600">{error || 'Quotation not found'}</p>
                </div>
            </div>
        );
    }

    // Helper to get status color
    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'Approved': 'bg-green-50 text-green-700 border-green-200',
            'Rejected': 'bg-red-50 text-red-700 border-red-200',
            'Sent': 'bg-blue-50 text-blue-700 border-blue-200',
            'Draft': 'bg-slate-50 text-slate-600 border-slate-200',
            'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
        };
        return colors[status] || 'bg-slate-50 text-slate-600 border-slate-200';
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto">
                {/* Header - Read Only Banner */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur z-10">
                    <div className="flex items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-slate-900 text-lg font-bold">{quotation.id}</h2>
                                <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">{quotation.version}</span>
                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-200 font-medium flex items-center gap-1">
                                    <Eye size={12} /> Read Only
                                </span>
                            </div>
                            <p className="text-slate-500 text-sm mt-0.5">{quotation.customer}</p>
                        </div>
                        <div className="h-8 w-px bg-slate-200 mx-2" />
                        <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${getStatusColor(quotation.status)}`} style={{ fontWeight: 500 }}>
                                {quotation.status}
                            </span>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                <User size={10} /> Owner: {quotation.owner}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Quick Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <p className="text-xs text-slate-500 mb-1">Total Value</p>
                            <p className="text-xl font-bold text-slate-900">₹{quotation.commercials.total.toLocaleString()}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <p className="text-xs text-slate-500 mb-1">Advance Required</p>
                            <p className="text-lg font-bold text-amber-600">
                                ₹{(quotation.commercials.total * quotation.commercials.advanceRequiredPct / 100).toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-400">{quotation.commercials.advanceRequiredPct}%</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <p className="text-xs text-slate-500 mb-1">Advance Received</p>
                            <p className="text-lg font-bold text-green-600">₹{quotation.commercials.advanceReceivedAmt.toLocaleString()}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <p className="text-xs text-slate-500 mb-1">Valid Until</p>
                            <p className="text-lg font-bold text-slate-900">{quotation.validUntil}</p>
                        </div>
                    </div>

                    {/* Workflow Status */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Activity size={16} className="text-indigo-500" /> Workflow Status
                        </h3>
                        <div className="flex items-center justify-between relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-100" />
                            {[
                                { label: "Sample", status: quotation.workflow.sampleOrder },
                                { label: "Production", status: quotation.workflow.productionOrder },
                                { label: "Dispatch", status: quotation.workflow.dispatch },
                                { label: "Invoice", status: quotation.workflow.invoice },
                                { label: "Closure", status: quotation.workflow.closure }
                            ].map((step, i) => (
                                <div key={i} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-bold
                                        ${step.status !== "N/A" && step.status !== "Pending" ?
                                            step.status === "Awaiting Approval" ? "bg-yellow-50 border-yellow-500 text-yellow-700" :
                                                step.status === "Rejected" ? "bg-red-50 border-red-500 text-red-700" :
                                                    "bg-indigo-50 border-indigo-500 text-indigo-700" :
                                            "bg-white border-slate-200 text-slate-400"}
                                    `}>
                                        {i + 1}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-medium text-slate-700">{step.label}</p>
                                        <p className={`text-[10px] ${step.status === "Awaiting Approval" ? "text-yellow-600" :
                                            step.status === "Rejected" ? "text-red-600" :
                                                step.status !== "N/A" ? "text-indigo-600" : "text-slate-400"
                                            }`}>
                                            {step.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Products */}
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                            <Package size={16} className="text-slate-500" />
                            <h3 className="text-sm font-semibold text-slate-900">Products & Specifications</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {quotation.products.map((item, i) => (
                                <div key={i} className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{item.desc}</p>
                                            <p className="text-xs text-slate-500">{item.qty.toLocaleString()} units @ ₹{item.rate.toFixed(2)}</p>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">₹{item.total.toLocaleString()}</p>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                                        <div><span className="text-slate-400 block mb-0.5">Material</span><span className="font-medium text-slate-700">{item.specs.material}</span></div>
                                        <div><span className="text-slate-400 block mb-0.5">GSM</span><span className="font-medium text-slate-700">{item.specs.gsm}</span></div>
                                        <div><span className="text-slate-400 block mb-0.5">Dimensions</span><span className="font-medium text-slate-700">{item.specs.dimensions}</span></div>
                                        <div><span className="text-slate-400 block mb-0.5">Printing</span><span className="font-medium text-slate-700">{item.specs.printingTech}</span></div>
                                        <div><span className="text-slate-400 block mb-0.5">Colors</span><span className="font-medium text-slate-700">{item.specs.colors}</span></div>
                                        <div><span className="text-slate-400 block mb-0.5">Lamination</span><span className="font-medium text-slate-700">{item.specs.lamination}</span></div>
                                        <div className="col-span-2"><span className="text-slate-400 block mb-0.5">Packaging</span><span className="font-medium text-slate-700">{item.specs.packaging}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Costing Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-200 rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                <DollarSign size={16} className="text-amber-500" /> Cost Breakdown
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-slate-500">Material</span><span className="font-medium">₹{quotation.costing.breakdown.material.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Machine</span><span className="font-medium">₹{quotation.costing.breakdown.machine.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Labor</span><span className="font-medium">₹{quotation.costing.breakdown.labor.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Finishing</span><span className="font-medium">₹{quotation.costing.breakdown.finishing.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Packaging</span><span className="font-medium">₹{quotation.costing.breakdown.packaging.toLocaleString()}</span></div>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                <FileText size={16} className="text-indigo-500" /> Summary
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-slate-500">Estimated Total Cost</span><span className="font-bold">₹{quotation.costing.estimatedTotalCost.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Expected Margin</span><span className="font-bold text-green-600">₹{quotation.costing.expectedMargin.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Profit Margin</span><span className="font-bold text-indigo-600">{quotation.costing.profitMarginPct}%</span></div>
                                <div className="flex justify-between pt-2 border-t border-slate-200"><span className="text-slate-500">Total Quote Value</span><span className="font-bold text-slate-900">₹{quotation.commercials.total.toLocaleString()}</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Terms */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <DollarSign size={16} className="text-green-500" /> Payment Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-slate-500">Payment Terms</p>
                                <p className="font-medium text-slate-900">{quotation.commercials.paymentTerms}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Advance Required</p>
                                <p className="font-medium text-slate-900">{quotation.commercials.advanceRequiredPct}%</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Advance Received</p>
                                <p className="font-medium text-green-600">₹{quotation.commercials.advanceReceivedAmt.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer note */}
                    <div className="text-center text-xs text-slate-400 py-2 border-t border-slate-100">
                        <span className="flex items-center justify-center gap-1">
                            <Eye size={14} /> View-Only Mode - You cannot edit this quotation
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}