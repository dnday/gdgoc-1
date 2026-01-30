"use client";

import Cookies from "js-cookie";
import { Briefcase, Clock, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AccountDropdown from "@/components/AccountDropdown";

// Job type definition
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  postedAgo: string;
  skills: string[];
  type: string;
}

// Mock jobs data for candidates
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Product Designer",
    company: "Tech Corp",
    location: "Remote",
    postedAgo: "2d ago",
    skills: ["Figma", "React", "UX Research"],
    type: "Full-time",
  },
  {
    id: "2",
    title: "Frontend Engineer",
    company: "StartupXYZ",
    location: "San Francisco, CA",
    postedAgo: "5d ago",
    skills: ["TypeScript", "Tailwind", "Next.js"],
    type: "Full-time",
  },
  {
    id: "3",
    title: "Backend Developer",
    company: "DevCo",
    location: "New York, NY",
    postedAgo: "1w ago",
    skills: ["Node.js", "PostgreSQL", "Docker"],
    type: "Contract",
  },
];

export default function CandidateDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>(mockJobs);

  useEffect(() => {
    // Check both cookie and localStorage
    const tokenFromCookie = Cookies.get("token");
    const tokenFromStorage =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const token = tokenFromCookie || tokenFromStorage;

    console.log("Candidate Dashboard - Checking auth...");
    console.log("Token found:", token ? "YES" : "NO");

    if (!token) {
      console.log("❌ No token, redirecting to login");
      router.push("/");
      return;
    }

    console.log("✅ Token found, loading dashboard");
    setLoading(false);
  }, [router]);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      <main className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Find Your Next Opportunity
            </h1>
            <p className="text-gray-500 mt-2">
              Browse available positions and apply to jobs that match your
              skills
            </p>
          </div>
          <AccountDropdown />
        </div>

        {/* Search */}
        <div className="mb-6 p-4 bg-white rounded-2xl border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, company, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none"
            />
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
                onClick={() =>
                  router.push(`/dashboard/candidate/jobs/${job.id}`)
                }
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
                        <p className="text-sm text-gray-600 mt-0.5">
                          {job.company}
                        </p>
                      </div>
                      <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-full flex-shrink-0">
                        {job.type}
                      </span>
                    </div>

                    {/* Location & Time */}
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        Posted {job.postedAgo}
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
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
