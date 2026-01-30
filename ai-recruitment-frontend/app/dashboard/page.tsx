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
      <main className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Vacancies</h1>
            <p className="text-gray-500 mt-1">
              Manage open positions and track applicant pipelines.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all">
              <Plus className="w-5 h-5" />
              Create New Job
            </button>
            <AccountDropdown />
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-8 mb-6 flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100">
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
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {(["All", "Open", "Closed"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
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
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-100/50 transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Posted {job.postedAgo}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(job.id);
                          }}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700">
                          {job.status === "Open" ? "Close Job" : "Reopen"}
                        </button>
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full ${
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
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Applicants Count */}
                  <div className="flex items-center gap-2 text-gray-500 flex-shrink-0">
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
