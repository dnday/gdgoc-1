"use client";

import {
  ArrowLeft,
  ArrowUpDown,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Edit3,
  Filter,
  Loader2,
  Mail,
  Search,
  Sparkles,
  Star,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// --- Types ---
interface Application {
  id: string;
  candidateName: string;
  email: string;
  resumeUrl: string;
  resumeText?: string;
  skillsExtracted: string[];
  summary?: string;
  matchScore?: number;
  matchExplanation?: string;
  status: string;
  createdAt: string;
}

interface ApiJob {
  id: string;
  title: string;
  description: string;
  requirements: string;
  isActive: boolean;
  createdAt: string;
  recruiter?: { name?: string; email?: string };
  applications: Application[];
  _count: { applications: number };
}

// Helper function to calculate "posted ago"
function getPostedAgo(dateString: string): string {
  const now = new Date();
  const posted = new Date(dateString);
  const diffMs = now.getTime() - posted.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${diffWeeks}w ago`;
}

// Parse requirements string to skills array
function parseSkills(requirements: string): string[] {
  return requirements
    .split(/[,\n•\-]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length < 30)
    .slice(0, 5);
}

// --- Components ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Open: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    Closed: "bg-gray-100 text-gray-600 ring-gray-500/10",
    applied: "bg-blue-50 text-blue-700 ring-blue-700/10",
    shortlisted: "bg-purple-50 text-purple-700 ring-purple-700/10",
    interview_scheduled: "bg-amber-50 text-amber-700 ring-amber-600/10",
    accepted: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    rejected: "bg-red-50 text-red-700 ring-red-600/10",
  };
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
        styles[status] || styles.applied
      }`}
    >
      {displayStatus}
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
        <div className={`h-full ${barColor}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-bold ${color}`}>{score}%</span>
    </div>
  );
};

// --- Main Page Component ---
export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<ApiJob | null>(null);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedCandidate, setSelectedCandidate] =
    useState<Application | null>(null);
  const [emailModal, setEmailModal] = useState<{
    isOpen: boolean;
    type: string;
    candidate: Application | null;
  }>({ isOpen: false, type: "", candidate: null });
  const [jobStatus, setJobStatus] = useState<"Open" | "Closed">("Open");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ... (existing code)

  const [searchQuery, setSearchQuery] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [interviewSlots, setInterviewSlots] = useState([
    { date: "", time: "" },
  ]);
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  const SuccessModal = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform scale-100 animate-in zoom-in-95 duration-200 border border-white/20">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Email Sent!</h3>
        <p className="text-slate-600 mb-6">
          The candidate has been notified and the application status has been
          updated.
        </p>
        <button
          onClick={() => setShowSuccessModal(false)}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors shadow-lg shadow-slate-900/20"
        >
          Awesome
        </button>
      </div>
    </div>
  );

  const fetchJob = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3000/jobs/${jobId}`);
      if (!res.ok) throw new Error("Job not found");
      const data: ApiJob = await res.json();
      setJob(data);
      setJobStatus(data.isActive ? "Open" : "Closed");
      console.log("✅ Fetched job:", data.title);
    } catch (err) {
      console.error("❌ Failed to fetch job:", err);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">
          Loading job details...
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Briefcase className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Job Not Found</h2>
        <p className="text-gray-500 mb-4">
          The job you're looking for doesn't exist.
        </p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  const skills = parseSkills(job.requirements);
  const candidates = job.applications || [];

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const matchesTab =
      activeTab === "All" || c.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      c.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Stats
  const stats = {
    total: candidates.length,
    shortlisted: candidates.filter((c) => c.status === "shortlisted").length,
    accepted: candidates.filter((c) => c.status === "accepted").length,
    rejected: candidates.filter((c) => c.status === "rejected").length,
  };

  const handleDecision = (type: string, candidate: Application) => {
    setEmailModal({ isOpen: true, type, candidate });
  };

  const handleScheduleInterview = (candidate: Application) => {
    // Open interview modal
    setEmailModal({ isOpen: true, type: "interview", candidate });
  };

  const handleShortlist = async (candidate: Application) => {
    try {
      const res = await fetch("http://localhost:3000/applications/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: candidate.id,
          to: candidate.email,
          subject: `Application Update - ${job?.title}`,
          message: `Dear ${candidate.candidateName},\n\nThank you for applying for the ${job?.title} position.\n\nWe have reviewed your application and are pleased to inform you that you have been shortlisted for further consideration. We will be in touch with you soon regarding the next steps.\n\nBest regards,\nRecruitment Team`,
          status: "shortlisted",
        }),
      });

      if (res.ok) {
        // Update local state
        setJob((prevJob) => {
          if (!prevJob) return null;
          return {
            ...prevJob,
            applications: prevJob.applications.map((app) =>
              app.id === candidate.id ? { ...app, status: "shortlisted" } : app,
            ),
          };
        });

        // Update selected candidate if it's the same one
        if (selectedCandidate?.id === candidate.id) {
          setSelectedCandidate({ ...candidate, status: "shortlisted" });
        }

        alert("✅ Candidate shortlisted successfully!");
      } else {
        alert("Failed to shortlist candidate");
      }
    } catch (error) {
      console.error("Error shortlisting candidate:", error);
      alert("An error occurred while shortlisting");
    }
  };

  const closeEmailModal = () => {
    setEmailModal({ isOpen: false, type: "", candidate: null });
    setInterviewSlots([{ date: "", time: "" }]); // Reset interview slots
  };

  const addInterviewSlot = () => {
    setInterviewSlots([...interviewSlots, { date: "", time: "" }]);
  };

  const removeInterviewSlot = (index: number) => {
    if (interviewSlots.length > 1) {
      setInterviewSlots(interviewSlots.filter((_, i) => i !== index));
    }
  };

  const updateInterviewSlot = (
    index: number,
    field: "date" | "time",
    value: string,
  ) => {
    const updated = [...interviewSlots];
    updated[index][field] = value;
    setInterviewSlots(updated);
  };

  const toggleJobStatus = async () => {
    const newStatus = jobStatus === "Open" ? false : true;
    // Optimistic Update
    setJobStatus(newStatus ? "Open" : "Closed");

    try {
      const res = await fetch(`http://localhost:3000/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setJob((prev) => (prev ? { ...prev, isActive: newStatus } : null));
    } catch (error) {
      console.error(error);
      alert("Failed to update job status");
      setJobStatus(jobStatus); // Revert
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 flex flex-col">
      {showSuccessModal && <SuccessModal />}
      {/* Sticky Job Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <button
                onClick={() => router.back()}
                className="mt-0.5 sm:mt-1 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg text-slate-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h1 className="text-base sm:text-xl font-bold text-slate-900 truncate">
                    {job.title}
                  </h1>
                  <StatusBadge status={jobStatus} />
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {getPostedAgo(job.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />{" "}
                    {stats.total} Candidates
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 ml-auto sm:ml-0">
              <button
                onClick={toggleJobStatus}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium border rounded-lg transition-colors ${
                  jobStatus === "Open"
                    ? "text-red-600 bg-white border-red-200 hover:bg-red-50"
                    : "text-emerald-600 bg-white border-emerald-200 hover:bg-emerald-50"
                }`}
              >
                {jobStatus === "Open" ? "Close Job" : "Reopen Job"}
              </button>
              <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-sm">
                <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Edit Job</span>
                <span className="sm:hidden">Edit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-8 flex items-start gap-4 sm:gap-6 relative">
        {/* Main Content Area */}
        <div
          className={`flex-1 min-w-0 transition-all duration-300 ${
            selectedCandidate ? "mr-0 lg:mr-[400px]" : ""
          }`}
        >
          {/* Job Summary Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              {job.description}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-gray-100 pt-4">
              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                {skills.slice(0, 4).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 sm:px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md border border-gray-200"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 4 && (
                  <span className="text-xs text-gray-400">
                    +{skills.length - 4}
                  </span>
                )}
              </div>
              <div className="flex gap-4 sm:gap-6 text-sm">
                <div className="text-center">
                  <span className="block text-base sm:text-lg font-bold text-slate-900">
                    {stats.total}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide">
                    Total
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-base sm:text-lg font-bold text-emerald-600">
                    {stats.accepted}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide">
                    Hired
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-base sm:text-lg font-bold text-red-600">
                    {stats.rejected}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide">
                    Rejected
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Tabs & Filters */}
          <div className="flex flex-col gap-3 mb-4 sm:mb-6">
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <div className="flex bg-gray-100/50 p-1 rounded-lg border border-gray-200 w-fit min-w-full sm:min-w-0">
                {["All", "Shortlisted", "Accepted", "Rejected"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                      activeTab === tab
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-full sm:w-48 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>
              <button className="p-2 border border-gray-200 rounded-lg bg-white text-slate-600 hover:bg-gray-50 shrink-0">
                <Filter className="w-4 h-4" />
              </button>
              <button className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-slate-600 hover:bg-gray-50">
                <ArrowUpDown className="w-4 h-4" />
                Sort
              </button>
            </div>
          </div>

          {/* Candidate List */}
          <div className="space-y-2 sm:space-y-3">
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No candidates found.</p>
                {candidates.length === 0 && (
                  <p className="text-sm text-gray-400 mt-1">
                    Share this job to start receiving applications!
                  </p>
                )}
              </div>
            ) : (
              filteredCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  onClick={() => setSelectedCandidate(candidate)}
                  className={`group relative bg-white rounded-xl border p-3 sm:p-4 transition-all cursor-pointer hover:shadow-md ${
                    selectedCandidate?.id === candidate.id
                      ? "border-indigo-500 ring-1 ring-indigo-500 shadow-md"
                      : "border-gray-200 hover:border-indigo-200"
                  }`}
                >
                  <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4">
                    {/* Left: Info */}
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs sm:text-sm shrink-0">
                        {candidate.candidateName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                          {candidate.candidateName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-slate-500 mt-0.5">
                          <span className="hidden sm:inline truncate max-w-[150px]">
                            {candidate.email}
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span>{getPostedAgo(candidate.createdAt)}</span>
                          {candidate.matchScore && (
                            <>
                              <span className="sm:hidden">•</span>
                              <span className="sm:hidden text-indigo-600 font-semibold">
                                {candidate.matchScore}% match
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Middle: AI Score & Skills - Desktop only */}
                    <div className="hidden md:flex items-center gap-6">
                      {candidate.matchScore && (
                        <div className="flex flex-col w-28">
                          <span className="text-[10px] font-semibold text-gray-400 uppercase mb-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-indigo-400" />
                            Match
                          </span>
                          <MatchScore score={candidate.matchScore} />
                        </div>
                      )}
                      <div className="flex gap-1.5">
                        {candidate.skillsExtracted
                          .slice(0, 2)
                          .map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-xs text-gray-600"
                            >
                              {skill}
                            </span>
                          ))}
                        {candidate.skillsExtracted.length > 2 && (
                          <span className="text-xs text-gray-400 px-1">
                            +{candidate.skillsExtracted.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Status & Action */}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                      <StatusBadge status={candidate.status} />
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-gray-500" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Candidate Detail Side Panel */}
        {selectedCandidate && (
          <aside className="fixed inset-y-0 right-0 w-full sm:w-[380px] md:w-[420px] bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 z-40 overflow-hidden flex flex-col">
            {/* Panel Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gray-50/50 flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  {selectedCandidate.candidateName}
                </h2>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mt-1">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{selectedCandidate.email}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Actions Toolbar */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <a
                  href={selectedCandidate.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:bg-gray-50"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">View</span> Resume
                </a>
                <button
                  onClick={() => setShowInterviewModal(true)}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:bg-gray-50"
                >
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Interview
                </button>
              </div>

              {/* AI Insight Section */}
              {(selectedCandidate.matchScore || selectedCandidate.summary) && (
                <div className="bg-indigo-50/50 rounded-xl p-4 sm:p-5 border border-indigo-100">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <h3 className="text-xs sm:text-sm font-bold text-indigo-900">
                        AI Analysis
                      </h3>
                    </div>
                    {selectedCandidate.matchScore && (
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Match Score
                        </span>
                        <span className="text-xl sm:text-2xl font-bold text-slate-900">
                          {selectedCandidate.matchScore}%
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedCandidate.summary && (
                    <p className="text-xs sm:text-sm text-slate-700 mb-3 sm:mb-4 leading-relaxed">
                      {selectedCandidate.summary}
                    </p>
                  )}

                  {selectedCandidate.matchExplanation && (
                    <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed">
                      {selectedCandidate.matchExplanation}
                    </p>
                  )}
                </div>
              )}

              {/* Skills */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 sm:mb-3">
                  Extracted Skills
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {selectedCandidate.skillsExtracted.length > 0 ? (
                    selectedCandidate.skillsExtracted.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white border border-gray-200 rounded-full text-[10px] sm:text-xs font-medium text-slate-600"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-400">
                      No skills extracted
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer: Decision Actions */}
            <div className="p-4 sm:p-6 border-t border-gray-100 bg-white">
              {["accepted", "rejected"].includes(
                selectedCandidate.status.toLowerCase(),
              ) ? (
                <div
                  className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-medium ${
                    selectedCandidate.status === "accepted"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {selectedCandidate.status === "accepted" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  {`Candidate ${selectedCandidate.status}`}
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Shortlist Button (only for applied status) */}
                  {selectedCandidate.status === "applied" && (
                    <button
                      onClick={() => handleShortlist(selectedCandidate)}
                      className="w-full py-2 sm:py-2.5 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 font-medium text-xs sm:text-sm hover:bg-purple-100 flex items-center justify-center gap-1.5 sm:gap-2 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Shortlist
                    </button>
                  )}

                  {/* Interview (only for applied/shortlisted) */}
                  {["applied", "shortlisted"].includes(
                    selectedCandidate.status,
                  ) && (
                    <button
                      onClick={() => handleScheduleInterview(selectedCandidate)}
                      className="w-full py-2 sm:py-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 font-medium text-xs sm:text-sm hover:bg-blue-100 flex items-center justify-center gap-1.5 sm:gap-2 transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />{" "}
                      Schedule Interview
                    </button>
                  )}

                  {/* Accept & Reject (only for interview_scheduled) */}
                  {selectedCandidate.status === "interview_scheduled" && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <button
                        onClick={() =>
                          handleDecision("reject", selectedCandidate)
                        }
                        className="w-full py-2 sm:py-2.5 rounded-lg border border-red-100 text-red-600 font-medium text-xs sm:text-sm hover:bg-red-50 flex items-center justify-center gap-1.5 sm:gap-2"
                      >
                        <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Reject
                      </button>
                      <button
                        onClick={() =>
                          handleDecision("accept", selectedCandidate)
                        }
                        className="w-full py-2 sm:py-2.5 rounded-lg bg-slate-900 text-white font-medium text-xs sm:text-sm hover:bg-slate-800 flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />{" "}
                        Accept
                      </button>
                    </div>
                  )}

                  {/* Reject only (for applied/shortlisted) */}
                  {["applied", "shortlisted"].includes(
                    selectedCandidate.status,
                  ) && (
                    <button
                      onClick={() =>
                        handleDecision("reject", selectedCandidate)
                      }
                      className="w-full py-2 sm:py-2.5 rounded-lg border border-red-100 text-red-600 font-medium text-xs sm:text-sm hover:bg-red-50 flex items-center justify-center gap-1.5 sm:gap-2"
                    >
                      <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Reject
                    </button>
                  )}
                </div>
              )}
            </div>
          </aside>
        )}
      </main>

      {/* Email Modal */}
      {emailModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">
                  {emailModal.type === "interview"
                    ? "Schedule Interview"
                    : emailModal.type === "accept"
                      ? "Send Offer / Next Steps"
                      : "Send Rejection Notice"}
                </span>
                <span className="sm:hidden">
                  {emailModal.type === "interview"
                    ? "Interview"
                    : emailModal.type === "accept"
                      ? "Send Offer"
                      : "Send Rejection"}
                </span>
              </h3>
              <button
                onClick={closeEmailModal}
                className="p-1.5 hover:bg-gray-200 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="rounded-xl p-4 mb-5 flex items-start gap-4 border bg-violet-50/50 border-violet-100">
                <div className="p-2 rounded-lg shrink-0 bg-violet-100 text-violet-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1 text-violet-900 flex items-center gap-2">
                    AI Drafted Message
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-[10px] sm:text-[10px] text-white font-bold tracking-wide shadow-sm">
                      GEMINI
                    </span>
                  </h4>
                  <p className="text-xs leading-relaxed text-violet-700">
                    This email has been generated based on the candidate's
                    profile and the job requirements. Feel free to edit before
                    sending.
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="emailSubject"
                    defaultValue={
                      emailModal.type === "interview"
                        ? `Interview Invitation - ${job?.title}`
                        : emailModal.type === "accept"
                          ? emailModal.candidate?.status ===
                            "interview_scheduled"
                            ? `Job Offer - ${job?.title}`
                            : `Interview Invitation - ${job?.title}`
                          : `Application Status - ${job?.title}`
                    }
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
                  />
                </div>

                {/* Interview Details - For interview type OR accept (if not yet interviewed) */}
                {(emailModal.type === "interview" ||
                  (emailModal.type === "accept" &&
                    emailModal.candidate?.status !==
                      "interview_scheduled")) && (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Interview Schedule Options{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs text-slate-400 mb-3">
                        Provide multiple date/time options for the candidate to
                        choose from
                      </p>

                      <div className="space-y-2">
                        {interviewSlots.map((slot, index) => (
                          <div
                            key={index}
                            className="flex gap-2 items-start p-3 bg-slate-50 rounded-lg border border-slate-200"
                          >
                            <div className="flex-1 grid grid-cols-2 gap-2">
                              <div>
                                <input
                                  type="date"
                                  value={slot.date}
                                  onChange={(e) =>
                                    updateInterviewSlot(
                                      index,
                                      "date",
                                      e.target.value,
                                    )
                                  }
                                  min={new Date().toISOString().split("T")[0]}
                                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all text-slate-700"
                                />
                              </div>
                              <div>
                                <input
                                  type="time"
                                  value={slot.time}
                                  onChange={(e) =>
                                    updateInterviewSlot(
                                      index,
                                      "time",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all text-slate-700"
                                />
                              </div>
                            </div>
                            {interviewSlots.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeInterviewSlot(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={addInterviewSlot}
                        className="mt-2 w-full py-2 text-sm font-medium text-slate-600 hover:text-slate-900 border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        Add Another Time Option
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Interview Location / Link{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="interviewLocation"
                        required
                        placeholder="e.g., Office Address or Zoom Link"
                        className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all placeholder:text-slate-400 text-slate-700"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        Enter office address or video conference link
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        rows={3}
                        id="interviewNotes"
                        placeholder="e.g., Please bring your portfolio, ID, and any questions you may have..."
                        className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 resize-none outline-none transition-all placeholder:text-slate-400 text-slate-700 leading-relaxed"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={8}
                    id="emailMessage"
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 resize-none outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700 leading-relaxed"
                    defaultValue={
                      emailModal.type === "interview"
                        ? `Dear ${emailModal.candidate?.candidateName},\n\nWe have reviewed your application for the ${job?.title} position and were impressed by your profile. We would like to invite you for an interview to discuss how you can contribute to our team.\n\nPlease let us know your availability for the coming week.\n\nBest regards,\nRecruitment Team`
                        : emailModal.type === "accept"
                          ? emailModal.candidate?.status ===
                            "interview_scheduled"
                            ? `Dear ${emailModal.candidate?.candidateName},\n\nCongratulations! We are pleased to offer you the position of ${job?.title} with our company.\n\nAfter reviewing your interview performance and qualifications, we believe you would be an excellent addition to our team. Please review the attached offer details and let us know your decision within 5 business days.\n\nWe look forward to having you join us!\n\nBest regards,\nRecruitment Team`
                            : `Dear ${emailModal.candidate?.candidateName},\n\nWe have reviewed your application for the ${job?.title} position and were impressed by your profile. We would like to invite you for an interview to discuss how you can contribute to our team.\n\nPlease let us know your availability for the coming week.\n\nBest regards,\nRecruitment Team`
                          : `Dear ${emailModal.candidate?.candidateName},\n\nThank you for giving us the opportunity to consider your application for the ${job?.title} position.\n\nAfter careful review, we have decided to proceed with other candidates who more closely match our current requirements. We appreciate your interest and wish you the best in your job search.\n\nSincerely,\nRecruitment Team`
                    }
                  />
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-100 flex gap-2 sm:gap-3 shrink-0">
              <button
                onClick={closeEmailModal}
                className="flex-1 sm:flex-initial px-4 py-2 text-sm font-medium text-slate-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={sendingEmail}
                onClick={async () => {
                  try {
                    setSendingEmail(true);

                    // Get form values
                    const subjectInput = document.getElementById(
                      "emailSubject",
                    ) as HTMLInputElement;
                    const messageTextarea = document.getElementById(
                      "emailMessage",
                    ) as HTMLTextAreaElement;

                    let finalMessage = messageTextarea.value;

                    // For interview or accept (not yet interviewed), validate and add interview details
                    if (
                      emailModal.type === "interview" ||
                      (emailModal.type === "accept" &&
                        emailModal.candidate?.status !== "interview_scheduled")
                    ) {
                      const locationInput = document.getElementById(
                        "interviewLocation",
                      ) as HTMLInputElement;
                      const notesTextarea = document.getElementById(
                        "interviewNotes",
                      ) as HTMLTextAreaElement;

                      // Validate that at least one interview slot is filled
                      const validSlots = interviewSlots.filter(
                        (slot) => slot.date && slot.time,
                      );

                      if (validSlots.length === 0) {
                        alert(
                          "Please provide at least one interview date and time option",
                        );
                        setSendingEmail(false);
                        return;
                      }

                      if (!locationInput.value) {
                        alert("Please fill in the interview location or link");
                        setSendingEmail(false);
                        return;
                      }

                      // Append interview details to message
                      finalMessage += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
                      finalMessage += `📅 INTERVIEW SCHEDULE\n`;
                      finalMessage += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
                      finalMessage += `Please select your preferred interview time:\n\n`;

                      validSlots.forEach((slot, index) => {
                        const dateObj = new Date(slot.date + "T" + slot.time);
                        const formattedDate = dateObj.toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        );
                        const formattedTime = dateObj.toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        );

                        finalMessage += `  ${index + 1}. ${formattedDate} at ${formattedTime}\n`;
                      });

                      finalMessage += `\n📍 Location: ${locationInput.value}\n`;

                      if (notesTextarea.value.trim()) {
                        finalMessage += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
                        finalMessage += `📝 Important Notes:\n\n${notesTextarea.value}\n`;
                      }

                      finalMessage += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
                      finalMessage += `Please reply with your preferred time slot number.\n`;
                      finalMessage += `We look forward to meeting you!\n`;
                    }

                    // Send Email & Update Status
                    const res = await fetch(
                      "http://localhost:3000/applications/send-email",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          appId: emailModal.candidate?.id,
                          to: emailModal.candidate?.email,
                          subject: subjectInput.value,
                          message: finalMessage,
                          status:
                            emailModal.type === "interview"
                              ? "interview_scheduled"
                              : emailModal.type === "accept"
                                ? "accepted"
                                : "rejected",
                        }),
                      },
                    );

                    if (res.ok) {
                      // Update Local State (Optimistic Update)
                      setJob((prevJob) => {
                        if (!prevJob) return null;
                        return {
                          ...prevJob,
                          applications: prevJob.applications.map((app) =>
                            app.id === emailModal.candidate?.id
                              ? {
                                  ...app,
                                  status:
                                    emailModal.type === "interview"
                                      ? "interview_scheduled"
                                      : emailModal.type === "accept"
                                        ? "accepted"
                                        : "rejected",
                                }
                              : app,
                          ),
                        };
                      });

                      if (selectedCandidate?.id === emailModal.candidate?.id) {
                        setSelectedCandidate((prev: any) => ({
                          ...prev,
                          status:
                            emailModal.type === "interview"
                              ? "interview_scheduled"
                              : emailModal.type === "accept"
                                ? "accepted"
                                : "rejected",
                        }));
                      }

                      closeEmailModal();
                      setShowSuccessModal(true);
                    } else {
                      alert("Failed to send email");
                    }
                  } catch (error) {
                    console.error("Error sending email:", error);
                    alert("Error sending email");
                  } finally {
                    setSendingEmail(false);
                  }
                }}
                className={`flex-1 sm:flex-initial px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm flex items-center justify-center gap-2 ${
                  sendingEmail
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-opacity-90"
                } ${
                  emailModal.type === "accept"
                    ? "bg-black hover:bg-slate-800"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {sendingEmail ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">
                      Confirm & Send Email
                    </span>
                    <span className="sm:hidden">Send</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interview Modal */}
      {showInterviewModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Schedule Interview
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedCandidate.candidateName} - {job?.title}
                </p>
              </div>
              <button
                onClick={() => setShowInterviewModal(false)}
                className="p-1.5 hover:bg-gray-200 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="rounded-xl p-4 mb-5 flex items-start gap-4 border bg-blue-50/50 border-blue-100">
                <div className="p-2 rounded-lg shrink-0 bg-blue-100 text-blue-600">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1 text-blue-900">
                    Interview Invitation
                  </h4>
                  <p className="text-xs leading-relaxed text-blue-700">
                    Schedule an interview with the candidate. They will receive
                    an email with the interview details.
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    id="interviewSubject"
                    defaultValue={`Interview Invitation - ${job?.title}`}
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Interview Schedule Options{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-slate-400 mb-3">
                    Provide multiple date/time options for the candidate to
                    choose from
                  </p>

                  <div className="space-y-2">
                    {interviewSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="flex gap-2 items-start p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div>
                            <input
                              type="date"
                              value={slot.date}
                              onChange={(e) =>
                                updateInterviewSlot(
                                  index,
                                  "date",
                                  e.target.value,
                                )
                              }
                              min={new Date().toISOString().split("T")[0]}
                              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all text-slate-700"
                            />
                          </div>
                          <div>
                            <input
                              type="time"
                              value={slot.time}
                              onChange={(e) =>
                                updateInterviewSlot(
                                  index,
                                  "time",
                                  e.target.value,
                                )
                              }
                              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all text-slate-700"
                            />
                          </div>
                        </div>
                        {interviewSlots.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeInterviewSlot(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addInterviewSlot}
                    className="mt-2 w-full py-2 text-sm font-medium text-slate-600 hover:text-slate-900 border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Add Another Time Option
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Interview Location / Link{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="interviewLocationDirect"
                    required
                    placeholder="e.g., Office Address or Zoom Link"
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all placeholder:text-slate-400 text-slate-700"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Enter office address or video conference link
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    id="interviewNotesDirect"
                    placeholder="e.g., Please bring your portfolio, ID, and any questions you may have..."
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 resize-none outline-none transition-all placeholder:text-slate-400 text-slate-700 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={8}
                    id="interviewMessage"
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 resize-none outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700 leading-relaxed"
                    defaultValue={`Dear ${selectedCandidate.candidateName},\n\nWe have reviewed your application for the ${job?.title} position and were impressed by your profile. We would like to invite you for an interview to discuss how you can contribute to our team.\n\nPlease let us know your availability for the coming week.\n\nBest regards,\nRecruitment Team`}
                  />
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-100 flex gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => setShowInterviewModal(false)}
                className="flex-1 sm:flex-initial px-4 py-2 text-sm font-medium text-slate-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={sendingEmail}
                onClick={async () => {
                  try {
                    setSendingEmail(true);

                    // Get form values
                    const subjectInput = document.getElementById(
                      "interviewSubject",
                    ) as HTMLInputElement;
                    const messageTextarea = document.getElementById(
                      "interviewMessage",
                    ) as HTMLTextAreaElement;
                    const locationInput = document.getElementById(
                      "interviewLocationDirect",
                    ) as HTMLInputElement;
                    const notesTextarea = document.getElementById(
                      "interviewNotesDirect",
                    ) as HTMLTextAreaElement;

                    let finalMessage = messageTextarea.value;

                    // Validate that at least one interview slot is filled
                    const validSlots = interviewSlots.filter(
                      (slot) => slot.date && slot.time,
                    );

                    if (validSlots.length === 0) {
                      alert(
                        "Please provide at least one interview date and time option",
                      );
                      setSendingEmail(false);
                      return;
                    }

                    if (!locationInput.value) {
                      alert("Please fill in the interview location or link");
                      setSendingEmail(false);
                      return;
                    }

                    // Append interview details to message
                    finalMessage += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
                    finalMessage += `📅 INTERVIEW SCHEDULE\n`;
                    finalMessage += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
                    finalMessage += `Please select your preferred interview time:\n\n`;

                    validSlots.forEach((slot, index) => {
                      const dateObj = new Date(slot.date + "T" + slot.time);
                      const formattedDate = dateObj.toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      );
                      const formattedTime = dateObj.toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      );

                      finalMessage += `  ${index + 1}. ${formattedDate} at ${formattedTime}\n`;
                    });

                    finalMessage += `\n📍 Location: ${locationInput.value}\n`;

                    if (notesTextarea.value.trim()) {
                      finalMessage += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
                      finalMessage += `📝 Important Notes:\n\n${notesTextarea.value}\n`;
                    }

                    finalMessage += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
                    finalMessage += `Please reply with your preferred time slot number.\n`;
                    finalMessage += `We look forward to meeting you!\n`;

                    // Send Email & Update Status to interview_scheduled
                    const res = await fetch(
                      "http://localhost:3000/applications/send-email",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          appId: selectedCandidate.id,
                          to: selectedCandidate.email,
                          subject: subjectInput.value,
                          message: finalMessage,
                          status: "interview_scheduled",
                        }),
                      },
                    );

                    if (res.ok) {
                      // Update Local State
                      setJob((prevJob) => {
                        if (!prevJob) return null;
                        return {
                          ...prevJob,
                          applications: prevJob.applications.map((app) =>
                            app.id === selectedCandidate.id
                              ? { ...app, status: "interview_scheduled" }
                              : app,
                          ),
                        };
                      });

                      if (selectedCandidate?.id === selectedCandidate.id) {
                        setSelectedCandidate((prev: any) => ({
                          ...prev,
                          status: "interview_scheduled",
                        }));
                      }

                      setShowInterviewModal(false);
                      setShowSuccessModal(true);
                    } else {
                      alert("Failed to send interview invitation");
                    }
                  } catch (error) {
                    console.error("Error sending interview invitation:", error);
                    alert("Error sending interview invitation");
                  } finally {
                    setSendingEmail(false);
                  }
                }}
                className={`flex-1 sm:flex-initial px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm flex items-center justify-center gap-2 bg-black hover:bg-slate-800 ${
                  sendingEmail ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {sendingEmail ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">
                      Send Interview Invitation
                    </span>
                    <span className="sm:hidden">Send</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
