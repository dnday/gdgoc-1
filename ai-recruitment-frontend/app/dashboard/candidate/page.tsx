"use client";

import AccountDropdown from "@/components/AccountDropdown";
import Cookies from "js-cookie";
import { Briefcase, Check, CheckCircle2, Clock, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// API Job type from backend
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
}

// Frontend Job type
interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  postedAgo: string;
  skills: string[];
  type: string;
  isApplied?: boolean;
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

export default function CandidateDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);

  // Fetch jobs from API
  const fetchJobs = useCallback(async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");

      // 1. Fetch available jobs
      const res = await fetch("http://localhost:3000/jobs");
      const data: ApiJob[] = await res.json();

      // 2. Fetch user's applied jobs if email exists
      let appliedJobIds: string[] = [];
      if (userEmail) {
        try {
          const appliedRes = await fetch(
            `http://localhost:3000/applications/candidate/applied?email=${userEmail}`,
          );
          if (appliedRes.ok) {
            appliedJobIds = await appliedRes.json();
          }
        } catch (error) {
          console.error("Failed to fetch applied jobs:", error);
        }
      }

      // 3. Transform API data & Flag applied jobs
      const transformedJobs: Job[] = data.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.recruiter?.name || "Company",
        description: job.description,
        postedAgo: getPostedAgo(job.createdAt),
        skills: parseSkills(job.requirements),
        type: "Full-time",
        isApplied: appliedJobIds.includes(job.id),
      }));

      setJobs(transformedJobs);
      console.log("✅ Candidate: Fetched", transformedJobs.length, "jobs");
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

    console.log("Candidate Dashboard - Checking auth...");

    if (!token) {
      console.log("❌ No token, redirecting to login");
      router.push("/");
      return;
    }

    console.log("✅ Token found, loading dashboard");
    fetchJobs();
    setLoading(false);
  }, [router, fetchJobs]);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-gray-900 text-white p-2 rounded-lg shadow-sm">
                <Check className="w-5 h-5" strokeWidth={3} />
              </div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                RecruitPro
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
              Find Your Next Opportunity
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">
              Browse available positions and apply to jobs that match your
              skills
            </p>
          </div>
          <AccountDropdown />
        </div>

        {/* Search */}
        <div className="mb-6 p-3 sm:p-4 bg-white rounded-2xl border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, company, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Recruiter Access Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Are you hiring?</h3>
              <p className="text-sm text-gray-600 mb-3">
                Request recruiter access to post jobs and find the best
                candidates for your company.
              </p>
              <button
                onClick={() => router.push("/become-recruiter")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all"
              >
                Apply for Recruiter Access
              </button>
            </div>
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No jobs available at the moment.</p>
              <p className="text-sm text-gray-400 mt-1">
                Check back later for new opportunities!
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() =>
                  router.push(`/dashboard/candidate/jobs/${job.id}`)
                }
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
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                          {job.company}
                        </p>
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        {job.isApplied && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Applied
                          </span>
                        )}
                        <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 text-blue-600 text-xs sm:text-sm font-medium rounded-full">
                          {job.type}
                        </span>
                      </div>
                    </div>

                    {/* Description preview - hidden on mobile */}
                    <p className="hidden sm:block text-sm text-gray-500 mt-2 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Time */}
                    <div className="flex items-center gap-4 mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Posted {job.postedAgo}
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
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
