"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Users,
  Search,
  Filter,
  ArrowUpDown,
  FileText,
  Sparkles,
  X,
  CheckCircle2,
  XCircle,
  Mail,
  ChevronRight,
  Calendar,
  Download,
  Edit3,
} from "lucide-react";

// --- Mock Data ---

const JOB_DETAILS = {
  id: "JOB-2024-001",
  title: "Senior Product Designer",
  location: "Remote (US/EU)",
  type: "Full-time",
  status: "Open",
  postedDate: "Oct 12, 2023",
  description:
    "We are looking for an experienced Product Designer to lead our design system initiative and mentor junior designers.",
  skills: ["Figma", "React", "Design Systems", "Prototyping"],
  stats: {
    total: 45,
    shortlisted: 12,
    accepted: 1,
    rejected: 15,
  },
};

interface Candidate {
  id: number;
  name: string;
  file: string;
  score: number;
  status: string;
  uploaded: string;
  topSkills: string[];
  email: string;
  aiSummary: string;
  aiMatchBreakdown: Array<{
    criterion: string;
    status: "pass" | "warning" | "fail";
    note: string;
  }>;
}

const CANDIDATES: Candidate[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    file: "sarah_j_resume.pdf",
    score: 94,
    status: "Shortlisted",
    uploaded: "2h ago",
    topSkills: ["Figma", "React", "Design Systems"],
    email: "sarah.j@example.com",
    aiSummary:
      "Strong alignment with Senior role. 7 years experience. Previously led a design system overhaul at a Fintech unicorn.",
    aiMatchBreakdown: [
      { criterion: "Experience", status: "pass", note: "7+ years (Req: 5+)" },
      { criterion: "Skills", status: "pass", note: "Matches 4/5 key skills" },
      {
        criterion: "Leadership",
        status: "warning",
        note: "Limited direct management exp",
      },
    ],
  },
  {
    id: 2,
    name: "Michael Chen",
    file: "m_chen_cv_v2.pdf",
    score: 88,
    status: "New",
    uploaded: "1d ago",
    topSkills: ["Sketch", "HTML/CSS", "UX Research"],
    email: "m.chen@example.com",
    aiSummary:
      "Solid UX background. Technical skills match, but primary tool is Sketch, not Figma. fast learner based on certifications.",
    aiMatchBreakdown: [
      { criterion: "Experience", status: "pass", note: "6 years" },
      {
        criterion: "Skills",
        status: "warning",
        note: "Missing Figma proficiency",
      },
    ],
  },
  {
    id: 3,
    name: "Jessica Alu",
    file: "jess_alu_portfolio.pdf",
    score: 65,
    status: "Rejected",
    uploaded: "3d ago",
    topSkills: ["Marketing", "Canva", "Social Media"],
    email: "j.alu@example.com",
    aiSummary:
      "Background is primarily marketing/graphic design, lacking product design depth required for this role.",
    aiMatchBreakdown: [
      {
        criterion: "Experience",
        status: "fail",
        note: "Relevant exp < 2 years",
      },
    ],
  },
];

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Open: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    Closed: "bg-gray-100 text-gray-600 ring-gray-500/10",
    New: "bg-blue-50 text-blue-700 ring-blue-700/10",
    Shortlisted: "bg-purple-50 text-purple-700 ring-purple-700/10",
    Accepted: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    Rejected: "bg-red-50 text-red-700 ring-red-600/10",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
        styles[status] || styles.Open
      }`}>
      {status}
    </span>
  );
};

const MatchScore = ({ score }: { score: number }) => {
  let color = "text-gray-500";
  let barColor = "bg-gray-200";
  if (score >= 90) {
    color = "text-emerald-600";
    barColor = "bg-emerald-500";
  } else if (score >= 70) {
    color = "text-amber-600";
    barColor = "bg-amber-500";
  } else {
    color = "text-red-500";
    barColor = "bg-red-400";
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor}`}
          style={{ width: `${score}%` }}></div>
      </div>
      <span className={`text-xs font-bold ${color}`}>{score}%</span>
    </div>
  );
};

// --- Main Page Component ---

export default function JobDetailPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [emailModal, setEmailModal] = useState<{
    isOpen: boolean;
    type: string;
    candidate: Candidate | null;
  }>({ isOpen: false, type: "", candidate: null });
  const [jobStatus, setJobStatus] = useState(JOB_DETAILS.status);

  // Filter Logic
  const filteredCandidates =
    activeTab === "All"
      ? CANDIDATES
      : CANDIDATES.filter((c) => {
          if (activeTab === "Shortlisted") return c.status === "Shortlisted";
          if (activeTab === "Accepted") return c.status === "Accepted";
          if (activeTab === "Rejected") return c.status === "Rejected";
          return true;
        });

  const handleDecision = (type: string, candidate: Candidate) => {
    setEmailModal({
      isOpen: true,
      type,
      candidate,
    });
  };

  const closeEmailModal = () => {
    setEmailModal({ isOpen: false, type: "", candidate: null });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 flex flex-col">
      {/* 1. Sticky Job Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <button
                onClick={() => router.back()}
                className="mt-1 p-2 hover:bg-gray-100 rounded-lg text-slate-500 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-slate-900">
                    {JOB_DETAILS.title}
                  </h1>
                  <StatusBadge status={jobStatus} />
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> {JOB_DETAILS.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" /> {JOB_DETAILS.type}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> {JOB_DETAILS.stats.total}{" "}
                    Candidates
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setJobStatus(jobStatus === "Open" ? "Closed" : "Open")
                }
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                {jobStatus === "Open" ? "Close Job" : "Reopen Job"}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-sm">
                <Edit3 className="w-4 h-4" />
                Edit Job
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex items-start gap-6 relative">
        {/* Main Content Area */}
        <div
          className={`flex-1 min-w-0 transition-all duration-300 ${
            selectedCandidate ? "mr-0 lg:mr-[400px]" : ""
          }`}>
          {/* 2. Job Summary Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <p className="text-sm text-slate-600 mb-4 leading-relaxed max-w-3xl">
              {JOB_DETAILS.description}
            </p>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex gap-2">
                {JOB_DETAILS.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md border border-gray-200">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <span className="block text-lg font-bold text-slate-900">
                    {JOB_DETAILS.stats.total}
                  </span>
                  <span className="text-xs text-slate-500 uppercase tracking-wide">
                    Total
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-lg font-bold text-emerald-600">
                    {JOB_DETAILS.stats.accepted}
                  </span>
                  <span className="text-xs text-slate-500 uppercase tracking-wide">
                    Hired
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-lg font-bold text-red-600">
                    {JOB_DETAILS.stats.rejected}
                  </span>
                  <span className="text-xs text-slate-500 uppercase tracking-wide">
                    Rejected
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. & 4. Tabs & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex bg-gray-100/50 p-1 rounded-lg border border-gray-200">
              {["All", "Shortlisted", "Accepted", "Rejected"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    activeTab === tab
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-48 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>
              <button className="p-2 border border-gray-200 rounded-lg bg-white text-slate-600 hover:bg-gray-50">
                <Filter className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-slate-600 hover:bg-gray-50">
                <ArrowUpDown className="w-4 h-4" />
                Sort
              </button>
            </div>
          </div>

          {/* 5. Candidate List */}
          <div className="space-y-3">
            {filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate)}
                className={`group relative bg-white rounded-xl border p-4 transition-all cursor-pointer hover:shadow-md ${
                  selectedCandidate?.id === candidate.id
                    ? "border-indigo-500 ring-1 ring-indigo-500 shadow-md"
                    : "border-gray-200 hover:border-indigo-200"
                }`}>
                <div className="flex items-center justify-between">
                  {/* Left: Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                      {candidate.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {candidate.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <FileText className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">
                          {candidate.file}
                        </span>
                        <span>•</span>
                        <span>{candidate.uploaded}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: AI Score & Skills */}
                  <div className="hidden md:flex items-center gap-8">
                    <div className="flex flex-col w-32">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-400" /> Match
                        Score
                      </span>
                      <MatchScore score={candidate.score} />
                    </div>
                    <div className="flex gap-1.5">
                      {candidate.topSkills.slice(0, 2).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-xs text-gray-600">
                          {skill}
                        </span>
                      ))}
                      {candidate.topSkills.length > 2 && (
                        <span className="text-xs text-gray-400 px-1">
                          +{candidate.topSkills.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Status & Action */}
                  <div className="flex items-center gap-4">
                    <StatusBadge status={candidate.status} />
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Candidate Detail Side Panel (Slide Over) */}
        {selectedCandidate && (
          <aside className="fixed inset-y-0 right-0 w-[420px] bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 z-40 overflow-hidden flex flex-col">
            {/* Panel Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {selectedCandidate.name}
                </h2>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                  <Mail className="w-3.5 h-3.5" /> {selectedCandidate.email}
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Actions Toolbar */}
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50">
                  <Download className="w-4 h-4" /> CV PDF
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50">
                  <Calendar className="w-4 h-4" /> Interview
                </button>
              </div>

              {/* AI Insight Section */}
              <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-indigo-900">
                      AI Analysis
                    </h3>
                  </div>
                  <span className="text-2xl font-bold text-slate-900">
                    {selectedCandidate.score}%
                  </span>
                </div>

                <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                  {selectedCandidate.aiSummary}
                </p>

                <div className="space-y-2">
                  {selectedCandidate.aiMatchBreakdown?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs bg-white p-2 rounded border border-indigo-50">
                      <span className="font-medium text-slate-700">
                        {item.criterion}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{item.note}</span>
                        {item.status === "pass" && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                        {item.status === "warning" && (
                          <div className="w-2 h-2 rounded-full bg-amber-400" />
                        )}
                        {item.status === "fail" && (
                          <XCircle className="w-3.5 h-3.5 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills (Editable Mock) */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  Extracted Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.topSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="group flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-slate-600">
                      {skill}
                      <button className="opacity-0 group-hover:opacity-100 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <button className="px-3 py-1 border border-dashed border-gray-300 rounded-full text-xs text-gray-500 hover:border-indigo-300 hover:text-indigo-600">
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* 7. Footer: Decision Actions */}
            <div className="p-6 border-t border-gray-100 bg-white">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleDecision("reject", selectedCandidate)}
                  className="w-full py-2.5 rounded-lg border border-red-100 text-red-600 font-medium text-sm hover:bg-red-50 flex items-center justify-center gap-2">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button
                  onClick={() => handleDecision("accept", selectedCandidate)}
                  className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 flex items-center justify-center gap-2 shadow-sm">
                  <CheckCircle2 className="w-4 h-4" /> Accept
                </button>
              </div>
            </div>
          </aside>
        )}
      </main>

      {/* Email Modal */}
      {emailModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                {emailModal.type === "accept"
                  ? "Send Offer / Next Steps"
                  : "Send Rejection Notice"}
              </h3>
              <button onClick={closeEmailModal}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-4 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <p className="text-xs text-indigo-800">
                  AI has drafted this email based on the candidate's profile and
                  your decision. Please review before sending.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    defaultValue={
                      emailModal.type === "accept"
                        ? "Update on your application - Interview Invitation"
                        : "Update on your application at Company"
                    }
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none outline-none"
                    defaultValue={
                      emailModal.type === "accept"
                        ? `Hi ${emailModal.candidate?.name},\n\nWe were impressed by your profile and would love to move forward...`
                        : `Hi ${emailModal.candidate?.name},\n\nThank you for your interest. Unfortunately, we have decided to proceed with other candidates...`
                    }
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={closeEmailModal}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-gray-100 rounded-lg">
                Cancel
              </button>
              <button
                onClick={closeEmailModal}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm ${
                  emailModal.type === "accept"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}>
                Confirm & Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
