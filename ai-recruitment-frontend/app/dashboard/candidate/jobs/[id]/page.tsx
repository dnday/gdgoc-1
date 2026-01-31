"use client";

import AccountDropdown from "@/components/AccountDropdown";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle,
  Clock,
  FileText,
  Send,
  Upload,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// Types
interface ApiJob {
  id: string;
  title: string;
  description: string;
  requirements: string;
  isActive: boolean;
  createdAt: string;
  recruiter?: { name?: string; email?: string };
}

// Helper function
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

function parseSkills(requirements: string): string[] {
  return requirements
    .split(/[,\n•\-]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length < 30)
    .slice(0, 10);
}

export default function CandidateJobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<ApiJob | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(
    null,
  );
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Fetch job data
  const fetchJob = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3000/jobs/${jobId}`);
      if (!res.ok) throw new Error("Job not found");
      const data: ApiJob = await res.json();
      setJob(data);
    } catch (err) {
      console.error("❌ Failed to fetch job:", err);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  // Check if already applied and get status
  const checkApplied = useCallback(async () => {
    const email = localStorage.getItem("userEmail");
    if (!email || !jobId) return;

    try {
      const res = await fetch(
        `http://localhost:3000/applications/status/${jobId}/${encodeURIComponent(email)}`,
      );
      if (res.ok) {
        const data = await res.json();
        setApplied(data.applied);
        setApplicationStatus(data.status);
      }
    } catch (err) {
      console.error("❌ Failed to check application status:", err);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJob();
    checkApplied();

    // Poll for status updates every 5 seconds if applied
    const interval = setInterval(() => {
      if (applied) {
        checkApplied();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchJob, checkApplied, applied]);

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
          className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium">
          Go Back
        </button>
      </div>
    );
  }

  const skills = parseSkills(job.requirements);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <button
                onClick={() => router.back()}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg text-slate-500 transition-colors shrink-0">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-xl font-bold text-slate-900 truncate">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500">
                  <span className="truncate">
                    {job.recruiter?.name || "Company"}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {getPostedAgo(job.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <div className="shrink-0 ml-2">
              <AccountDropdown />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Job Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Job Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                  {job.title}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-0.5 sm:mt-1">
                  {job.recruiter?.name || "Company"}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-3">
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-emerald-50 text-emerald-600 text-xs sm:text-sm font-medium rounded-full">
                    {job.isActive ? "Open" : "Closed"}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    Posted {getPostedAgo(job.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
              Job Description
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
              Requirements & Skills
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Apply Section */}
          <div className="p-4 sm:p-6 bg-gray-50">
            {applied ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                  <span className="text-sm sm:text-lg font-medium text-emerald-600">
                    Application Submitted!
                  </span>
                </div>
                {applicationStatus && applicationStatus !== "applied" && (
                  <div
                    className={`p-3 rounded-xl text-center ${
                      applicationStatus === "accepted"
                        ? "bg-green-50 border border-green-200"
                        : applicationStatus === "interview_scheduled"
                          ? "bg-amber-50 border border-amber-200"
                          : applicationStatus === "rejected"
                            ? "bg-red-50 border border-red-200"
                            : "bg-purple-50 border border-purple-200"
                    }`}>
                    <p
                      className={`text-sm font-semibold ${
                        applicationStatus === "accepted"
                          ? "text-green-700"
                          : applicationStatus === "interview_scheduled"
                            ? "text-amber-700"
                            : applicationStatus === "rejected"
                              ? "text-red-700"
                              : "text-purple-700"
                      }`}>
                      {applicationStatus === "accepted"
                        ? "🎉 Congratulations! Your application has been accepted!"
                        : applicationStatus === "interview_scheduled"
                          ? "📅 Interview scheduled! Check your email for details."
                          : applicationStatus === "rejected"
                            ? "Application not selected at this time."
                            : applicationStatus === "shortlisted"
                              ? "⭐ You have been shortlisted!"
                              : "Application is being reviewed"}
                    </p>
                  </div>
                )}
              </div>
            ) : job.isActive ? (
              <button
                onClick={() => setShowApplyModal(true)}
                className="w-full py-3 sm:py-3.5 bg-gray-900 hover:bg-gray-800 text-white text-sm sm:text-base font-medium rounded-xl transition-all flex items-center justify-center gap-2">
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                Apply for this Job
              </button>
            ) : (
              <div className="text-center py-3 sm:py-4">
                <p className="text-sm sm:text-base text-gray-500">
                  This position is no longer accepting applications.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Apply Modal */}
      {showApplyModal && (
        <ApplyModal
          jobId={job.id}
          jobTitle={job.title}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            setShowSuccessAnimation(true);
            setTimeout(() => {
              setShowApplyModal(false);
              setApplied(true);
              setShowSuccessAnimation(false);
            }, 2000);
          }}
        />
      )}
    </div>
  );
}

// Apply Modal Component
function ApplyModal({
  jobId,
  jobTitle,
  onClose,
  onSuccess,
}: {
  jobId: string;
  jobTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({ candidateName: "", email: "" });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Pre-fill from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = localStorage.getItem("userName") || "";
      const email = localStorage.getItem("userEmail") || "";
      setForm({ candidateName: name, email });
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Please upload a PDF or Word document");
        return;
      }
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload your resume");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("jobId", jobId);
      formData.append("candidateName", form.candidateName);
      formData.append("email", form.email);
      formData.append("resume", file);

      const res = await fetch("http://localhost:3000/applications", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit application");
      }

      // Don't wait for full response parsing for better UX
      console.log("✅ Application submitted successfully");
      setShowSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden">
        {/* Success Animation Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center animate-in zoom-in duration-500">
                <CheckCircle className="w-12 h-12 text-emerald-600 animate-in zoom-in duration-700" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-gray-900 animate-in slide-in-from-bottom-4 duration-500">
              Application Submitted!
            </h3>
            <p className="mt-2 text-sm text-gray-600 animate-in slide-in-from-bottom-4 duration-700">
              We'll review your application soon
            </p>
          </div>
        )}

        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Apply for Job
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
                {jobTitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-lg transition-colors shrink-0">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={form.candidateName}
              onChange={(e) =>
                setForm({ ...form, candidateName: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
              placeholder="Your full name"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
              placeholder="your.email@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Resume / CV *
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
                file
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-emerald-600" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="p-1 hover:bg-emerald-100 rounded">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX (max 5MB)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm sm:text-base font-medium rounded-xl transition-all">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !file}
              className="flex-1 py-2.5 sm:py-3 bg-gray-900 hover:bg-gray-800 text-white text-sm sm:text-base font-medium rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Submit Application</span>
                  <span className="sm:hidden">Submit</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
