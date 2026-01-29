"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Plus, Search, Briefcase, Users } from "lucide-react";

// Job type definition
interface Job {
  id: string;
  title: string;
  location: string;
  postedAgo: string;
  skills: string[];
  status: "Open" | "Closed";
  applicantsCount: number;
}

// Mock jobs data
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Product Designer",
    location: "Remote",
    postedAgo: "2d ago",
    skills: ["Figma", "React", "UX Research"],
    status: "Open",
    applicantsCount: 42,
  },
  {
    id: "2",
    title: "Frontend Engineer",
    location: "San Francisco, CA",
    postedAgo: "5d ago",
    skills: ["TypeScript", "Tailwind", "Next.js"],
    status: "Open",
    applicantsCount: 18,
  },
  {
    id: "3",
    title: "Marketing Manager",
    location: "New York, NY",
    postedAgo: "2w ago",
    skills: ["SEO", "Content Strategy"],
    status: "Closed",
    applicantsCount: 156,
  },
];

type FilterType = "All" | "Open" | "Closed";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>(mockJobs);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/");
      return;
    }
    setLoading(false);
  }, [router]);

  const filteredJobs = jobs.filter((job) => {
    const matchesFilter = filter === "All" || job.status === filter;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all">
            <Plus className="w-5 h-5" />
            Create New Job
          </button>
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
              <p className="text-gray-500">No jobs found.</p>
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
                          {job.location} • Posted {job.postedAgo}
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
                    <div className="flex items-center gap-2 mt-3">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
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
    </div>
  );
}
