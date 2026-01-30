"use client";

import Cookies from "js-cookie";
import { Briefcase, Plus, Search, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AccountDropdown from "@/components/AccountDropdown";
import CreateJobModal from "@/components/CreateJobModal";

// Job type definition from API
interface ApiJob {
  id: string;
  title: string;
  description: string;
  requirements: string;
  isActive: boolean;
  createdAt: string;
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

// Parse requirements string to skills array
function parseSkills(requirements: string): string[] {
  // Split by comma, newline, or common separators
  return requirements
    .split(/[,\n•\-]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length < 30)
    .slice(0, 5); // Max 5 skills displayed
}

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch jobs from API
  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3000/jobs");
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

  const handleToggleStatus = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? { ...job, status: job.status === "Open" ? "Closed" : "Open" }
          : job,
      ),
    );
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
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Job Vacancies
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Manage open positions and track applicant pipelines.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm sm:text-base font-medium rounded-xl transition-all">
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
                }`}>
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
                className="mt-4 text-blue-600 font-medium hover:text-blue-700">
                Create your first job
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
                className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 hover:shadow-lg hover:shadow-gray-100/50 transition-all cursor-pointer">
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Icon - hidden on mobile */}
                  <div className="hidden sm:flex w-12 h-12 bg-blue-50 rounded-xl items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                          Posted {job.postedAgo}
                        </p>
                      </div>

                      {/* Actions & Status */}
                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(job.id);
                          }}
                          className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700">
                          {job.status === "Open" ? "Close" : "Reopen"}
                        </button>
                        <span
                          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-full ${
                            job.status === "Open"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                          {job.status === "Open" && (
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          )}
                          {job.status}
                        </span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 flex-wrap">
                      {job.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
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

                  {/* Applicants Count - desktop only */}
                  <div className="hidden sm:flex items-center gap-2 text-gray-500 flex-shrink-0">
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
    </div>
  );
}
