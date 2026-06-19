import { useState } from "react";
import { Play, Pause, AlertTriangle, CheckCircle, Clock, ChevronDown, X, Cpu } from "lucide-react";

const myJobs = [
  {
    id: "JB-0094", title: "Label Printing - Apex Beverages", machine: "PM-3 (Offset 4C)", client: "Apex Beverages Ltd.",
    status: "In Progress", priority: "High", qty: 5000, completed: 3250, startTime: "08:30 AM", dueTime: "05:00 PM",
    specs: { paper: "Art Paper 130gsm", ink: "4C Process", lamination: "Gloss", finishing: "Die-cutting" },
    instructions: "Maintain 175 LPI screen ruling. Check color density every 500 sheets. Minimum ink density: C=1.55, M=1.45, Y=1.35, K=1.80",
    issues: [],
  },
  {
    id: "JB-0091", title: "Blister Pack - Sunrise Pharma", machine: "BL-1 (Blister)", client: "Sunrise Pharma",
    status: "Setup", priority: "High", qty: 50000, completed: 0, startTime: "—", dueTime: "08:00 PM",
    specs: { paper: "PVC 250mic", ink: "N/A", lamination: "Aluminium Foil", finishing: "Blister forming" },
    instructions: "Temperature: 120°C forming, 80°C sealing. Check seal integrity on first 100 units.",
    issues: [],
  },
];

const issueTypes = ["Registration problem", "Color inconsistency", "Paper jam", "Ink drying issue", "Machine vibration", "Other"];

interface JobCardProps {
  job: typeof myJobs[0];
}

function JobCard({ job }: JobCardProps) {
  const [running, setRunning] = useState(job.status === "In Progress");
  const [showIssue, setShowIssue] = useState(false);
  const [issueDesc, setIssueDesc] = useState("");
  const [issueType, setIssueType] = useState("");
  const progress = job.qty > 0 ? Math.round((job.completed / job.qty) * 100) : 0;

  return (
    <div className={`bg-card border rounded-xl overflow-hidden ${running ? "border-indigo-200" : "border-slate-200"}`}>
      {running && <div className="h-1 bg-indigo-600" />}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-indigo-600 text-xs" style={{ fontWeight: 600 }}>{job.id}</p>
              <span className={`inline-flex px-2 py-0.5 rounded border text-xs ${
                job.priority === "High" ? "bg-red-50 text-red-700 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200"
              }`} style={{ fontWeight: 500 }}>{job.priority} Priority</span>
            </div>
            <h3 className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>{job.title}</h3>
            <p className="text-slate-500 text-xs mt-0.5">{job.client} · {job.machine}</p>
          </div>
          <span className={`inline-flex px-2 py-0.5 rounded border text-xs flex-shrink-0 ${
            running ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
            job.status === "Setup" ? "bg-amber-50 text-amber-700 border-amber-200" :
            "bg-slate-100 text-slate-600 border-slate-200"
          }`} style={{ fontWeight: 500 }}>
            {running ? "Running" : job.status}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500">Production Progress</span>
            <span className="text-xs text-slate-800" style={{ fontWeight: 700 }}>{job.completed.toLocaleString()} / {job.qty.toLocaleString()} units ({progress}%)</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${running ? "bg-indigo-500" : "bg-slate-400"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {Object.entries(job.specs).map(([k, v]) => (
            <div key={k} className="bg-slate-50 rounded-lg p-2.5">
              <p className="text-slate-400 text-xs capitalize mb-0.5">{k}</p>
              <p className="text-slate-700 text-xs" style={{ fontWeight: 600 }}>{v}</p>
            </div>
          ))}
        </div>

        {/* Time */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1"><Clock size={11} /> Started: <span className="text-slate-700" style={{ fontWeight: 500 }}>{job.startTime}</span></span>
          <span className="flex items-center gap-1"><Clock size={11} /> Due by: <span className="text-slate-700" style={{ fontWeight: 500 }}>{job.dueTime}</span></span>
        </div>

        {/* Instructions */}
        <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 mb-4">
          <p className="text-indigo-700 text-xs" style={{ fontWeight: 600 }}>Job Instructions</p>
          <p className="text-indigo-600 text-xs mt-1 leading-relaxed">{job.instructions}</p>
        </div>

        {/* Controls */}
        {showIssue ? (
          <div className="border border-red-200 rounded-xl p-4 bg-red-50">
            <div className="flex items-center justify-between mb-3">
              <p className="text-red-700 text-xs" style={{ fontWeight: 600 }}>Report an Issue</p>
              <button onClick={() => setShowIssue(false)}><X size={14} className="text-red-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-red-700 mb-1" style={{ fontWeight: 500 }}>Issue Type</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full text-xs border border-red-200 rounded-lg px-3 py-2 bg-white focus:outline-none"
                >
                  <option value="">Select issue type...</option>
                  {issueTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-red-700 mb-1" style={{ fontWeight: 500 }}>Description</label>
                <textarea
                  value={issueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                  className="w-full text-xs border border-red-200 rounded-lg px-3 py-2 bg-white focus:outline-none resize-none"
                  rows={2}
                  placeholder="Describe the issue..."
                />
              </div>
              <button className="w-full text-xs text-white bg-red-600 hover:bg-red-700 rounded-lg py-2 transition-colors" style={{ fontWeight: 500 }}>
                Submit Issue Report
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setRunning(!running)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs text-white transition-colors ${running ? "bg-amber-500 hover:bg-amber-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
              style={{ fontWeight: 600 }}
            >
              {running ? <><Pause size={13} /> Pause Production</> : <><Play size={13} /> Start Production</>}
            </button>
            <button
              onClick={() => setShowIssue(true)}
              className="px-3 py-2 rounded-lg text-xs text-red-600 border border-red-200 hover:bg-red-50 transition-colors flex items-center gap-1"
              style={{ fontWeight: 500 }}
            >
              <AlertTriangle size={13} /> Issue
            </button>
            {progress === 100 && (
              <button className="px-3 py-2 rounded-lg text-xs text-green-700 border border-green-200 bg-green-50 hover:bg-green-100 transition-colors flex items-center gap-1" style={{ fontWeight: 500 }}>
                <CheckCircle size={13} /> Mark Complete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function MachineOperator() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Machine Operator</h1>
          <p className="text-slate-500 text-sm mt-0.5">Vijay Kumar · PM-3 (Offset 4C) · Morning Shift</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Machine Online
          </div>
        </div>
      </div>

      {/* Machine Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "My Jobs Today", value: "2", sub: "1 running, 1 pending", color: "text-indigo-600 bg-indigo-50" },
          { label: "Units Completed", value: "3,250", sub: "of 5,000 target", color: "text-green-600 bg-green-50" },
          { label: "Machine Uptime", value: "94%", sub: "Since shift start", color: "text-purple-600 bg-purple-50" },
          { label: "Issues Reported", value: "0", sub: "All clear", color: "text-slate-500 bg-slate-50" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <Cpu size={16} />
            </div>
            <p className="text-slate-900 mb-0.5" style={{ fontSize: "1.25rem", fontWeight: 700 }}>{s.value}</p>
            <p className="text-slate-700 text-xs" style={{ fontWeight: 500 }}>{s.label}</p>
            <p className="text-slate-400 text-xs mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        <h2 className="text-slate-700 text-sm" style={{ fontWeight: 600 }}>Assigned Jobs</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {myJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
