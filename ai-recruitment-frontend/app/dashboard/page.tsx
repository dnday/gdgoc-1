"use client";

import AccountDropdown from "@/components/AccountDropdown";
import ConfirmDialog from "@/components/ConfirmDialog";
import CreateJobModal from "@/components/CreateJobModal";
import Toast from "@/components/Toast";
import { API_URL } from "@/lib/config";
import Cookies from "js-cookie";
import { Briefcase, Check, Plus, Search, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// Job type definition from API
interface ApiJob {
  id: string;
  title: string;
  description: string;
  requirements: string;
  isActive: boolean;
  createdAt: string;
  recruiter?: {
    name?: string;
    email?: string;
  };
  _count: {
    applications: number;
  };
}

// Frontend Job type
interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  postedAgo: string;
  skills: string[];
  status: "Open" | "Closed";
  applicantsCount: number;
  recruiterName: string;
}

type FilterType = "All" | "Open" | "Closed";

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

// Parse requirements string to extract clean tech keywords
function parseSkills(requirements: string): string[] {
  // Extract tech keywords and tools using regex patterns
  const techPatterns = [
    // Programming languages
    /\b(JavaScript|TypeScript|Python|Java|Go|Rust|C\+\+|C#|PHP|Ruby|Swift|Kotlin|Scala)\b/gi,
    // Frameworks & Libraries
    /\b(React|Vue|Angular|Next\.js|Node\.js|Express|NestJS|Django|FastAPI|Flask|Spring|Laravel)\b/gi,
    // Databases
    /\b(PostgreSQL|MySQL|MongoDB|Redis|Cassandra|DynamoDB|Elasticsearch)\b/gi,
    // Cloud & DevOps
    /\b(AWS|Azure|GCP|Docker|Kubernetes|Terraform|Jenkins|GitLab|CircleCI)\b/gi,
    // Tools & Technologies
    /\b(Git|GraphQL|REST API|gRPC|Kafka|RabbitMQ|Nginx|Apache)\b/gi,
  ];

  const skills = new Set<string>();
  const skillMap = new Map<string, string>(); // lowercase -> original case

  techPatterns.forEach((pattern) => {
    const matches = requirements.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        const lower = match.toLowerCase();
        // Keep the first occurrence's casing
        if (!skillMap.has(lower)) {
          skillMap.set(lower, match);
        }
      });
    }
  });

  // Add deduplicated skills with proper casing
  skillMap.forEach((value) => skills.add(value));

  // If no tech keywords found, fall back to simple parsing
  if (skills.size === 0) {
    return requirements
      .split(/[,\n•\-]+/)
      .map((s) => s.trim())
      .filter(
        (s) =>
          s.length > 2 &&
          s.length < 25 &&
          !s.match(
            /^(years?|experience|strong|knowledge|proficiency|understanding|familiarity|ability|skills?|with)$/i,
          ),
      )
      .slice(0, 5);
  }

  return Array.from(skills).slice(0, 5);
}

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
  } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Fetch jobs from API
  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/jobs`);
      const data: ApiJob[] = await res.json();

      // Transform API data to frontend format
      const transformedJobs: Job[] = data.map((job) => ({
        id: job.id,
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        postedAgo: getPostedAgo(job.createdAt),
        skills: parseSkills(job.requirements),
        status: job.isActive ? "Open" : "Closed",
        applicantsCount: job._count?.applications || 0,
        recruiterName: job.recruiter?.name || "Unknown Recruiter",
      }));

      setJobs(transformedJobs);
      console.log("✅ Fetched", transformedJobs.length, "jobs from API");
    } catch (err) {
      console.error("❌ Failed to fetch jobs:", err);
    }
  }, []);

  useEffect(() => {
    // Check both cookie and localStorage
    const tokenFromCookie = Cookies.get("token");
    const tokenFromStorage =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const token = tokenFromCookie || tokenFromStorage;

    console.log("Dashboard - Checking auth...");

    if (!token) {
      console.log("❌ No token found, redirecting to login");
      router.push("/");
      return;
    }

    console.log("✅ Token found, loading dashboard");
    fetchJobs();
    setLoading(false);
  }, [router, fetchJobs]);

  const filteredJobs = jobs.filter((job) => {
    const matchesFilter = filter === "All" || job.status === filter;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesFilter && matchesSearch;
  });

  const handleToggleStatus = async (jobId: string) => {
    // 1. Find the job and current status
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    const newStatus = job.status === "Open" ? "Closed" : "Open";
    const isActive = newStatus === "Open";

    // 2. Optimistic Update
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j)),
    );

    try {
      // 3. Call API
      const res = await fetch(`${API_URL}/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });

      if (!res.ok) throw new Error("Failed to update status");
    } catch (error) {
      console.error("Failed to update job status:", error);
      setToast({
        message: "Failed to update job status. Please try again.",
        type: "error",
      });

      // 4. Revert on failure
      setJobs((prev) =>
        prev.map(
          (j) => (j.id === jobId ? { ...j, status: job.status } : j), // Revert to old status
        ),
      );
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    setConfirmDialog({
      message:
        "Are you sure you want to delete this job? This action cannot be undone.",
      onConfirm: async () => {
        // 1. Optimistic Update
        const previousJobs = [...jobs];
        setJobs((prev) => prev.filter((j) => j.id !== jobId));

        try {
          // 2. Call API
          const res = await fetch(`${API_URL}/jobs/${jobId}`, {
            method: "DELETE",
          });

          if (!res.ok) throw new Error("Failed to delete job");
          setToast({ message: "Job deleted successfully", type: "success" });
        } catch (error) {
          console.error("Failed to delete job:", error);
          setToast({
            message: "Failed to delete job. Please try again.",
            type: "error",
          });

          // 3. Revert on failure
          setJobs(previousJobs);
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-gray-900 text-white p-2 rounded-lg shadow-sm">
                <Check className="w-5 h-5" strokeWidth={3} />
              </div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                RecruitPro
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Job Vacancies
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Manage open positions and track applicant pipelines.
            </p>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm sm:text-base font-medium rounded-xl transition-all"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Create New Job</span>
              <span className="sm:hidden">New Job</span>
            </button>
            <AccountDropdown />
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 sm:mt-8 mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-2xl border border-gray-100">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
            {(["All", "Open", "Closed"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  filter === f
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No jobs found.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-blue-600 font-medium hover:text-blue-700"
              >
                Create your first job
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
                className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 hover:shadow-lg hover:shadow-gray-100/50 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Icon - hidden on mobile */}
                  <div className="hidden sm:flex w-12 h-12 bg-blue-50 rounded-xl items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5 text-xs sm:text-sm text-gray-500">
                          <span
                            className="truncate max-w-[150px]"
                            title={job.recruiterName}
                          >
                            by {job.recruiterName}
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">
                            Posted {job.postedAgo}
                          </span>
                        </div>
                      </div>

                      {/* Actions & Status */}
                      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteJob(job.id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="h-4 w-px bg-gray-200" />{" "}
                          {/* Divider */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(job.id);
                            }}
                            className={`text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                              job.status === "Open"
                                ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                : "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            }`}
                          >
                            {job.status === "Open" ? "Close Job" : "Reopen Job"}
                          </button>
                        </div>

                        <span
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full border ${
                            job.status === "Open"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
                        >
                          {job.status === "Open" && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                          )}
                          {job.status}
                        </span>

                        {/* Applicants Count - desktop only */}
                        <div className="hidden sm:flex items-center gap-2 text-gray-500 pl-2 ml-2 border-l border-gray-100">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">
                            <span className="font-semibold text-gray-900">
                              {job.applicantsCount}
                            </span>{" "}
                            applicants
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 flex-wrap">
                      {job.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{job.skills.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Applicants Count - show inline on mobile */}
                    <div className="flex sm:hidden items-center gap-1.5 mt-2 text-xs text-gray-500">
                      <Users className="w-3.5 h-3.5" />
                      <span>
                        <span className="font-semibold text-gray-900">
                          {job.applicantsCount}
                        </span>{" "}
                        applicants
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Create Job Modal */}
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchJobs}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          title="Delete Job"
          message={confirmDialog.message}
          type="danger"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}
