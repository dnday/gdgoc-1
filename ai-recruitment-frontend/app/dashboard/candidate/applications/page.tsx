"use client";

import Cookies from "js-cookie";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  MapPin,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Application {
  id: string;
  status: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    description: string;
    company?: string;
    location?: string;
  };
}

export default function MyApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get user from token
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.sub);
    } catch (error) {
      console.error("Failed to parse token:", error);
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    const fetchApplications = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/applications/user/${userId}`,
        );
        if (!res.ok) throw new Error("Failed to fetch applications");
        const data = await res.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [userId]);

  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      { color: string; icon: React.ReactElement; label: string; step: number }
    > = {
      applied: {
        color: "blue",
        icon: <FileText className="w-5 h-5" />,
        label: "Applied",
        step: 1,
      },
      shortlisted: {
        color: "purple",
        icon: <CheckCircle2 className="w-5 h-5" />,
        label: "Shortlisted",
        step: 2,
      },
      interview_scheduled: {
        color: "amber",
        icon: <Calendar className="w-5 h-5" />,
        label: "Interview Scheduled",
        step: 3,
      },
      accepted: {
        color: "emerald",
        icon: <CheckCircle2 className="w-5 h-5" />,
        label: "Accepted",
        step: 4,
      },
      rejected: {
        color: "red",
        icon: <XCircle className="w-5 h-5" />,
        label: "Rejected",
        step: 0,
      },
    };
    return configs[status] || configs.applied;
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            My Applications
          </h1>
          <p className="text-slate-600">
            Track the progress of your job applications
          </p>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Applications Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start applying to jobs to track your progress here
            </p>
            <button
              onClick={() => router.push("/dashboard/candidate")}
              className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const statusConfig = getStatusConfig(app.status);
              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/candidate/jobs/${app.job.id}`)
                  }
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">
                        {app.job.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        {app.job.company && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {app.job.company}
                          </span>
                        )}
                        {app.job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {app.job.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Applied {getTimeAgo(app.createdAt)}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-medium bg-${statusConfig.color}-50 text-${statusConfig.color}-700 flex items-center gap-2`}
                    >
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Progress Tracker */}
                  {app.status !== "rejected" && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        {/* Step 1: Applied */}
                        <div className="flex flex-col items-center flex-1">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              statusConfig.step >= 1
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <FileText className="w-5 h-5" />
                          </div>
                          <span
                            className={`text-xs mt-2 font-medium ${
                              statusConfig.step >= 1
                                ? "text-slate-900"
                                : "text-gray-400"
                            }`}
                          >
                            Applied
                          </span>
                        </div>

                        {/* Connector */}
                        <div
                          className={`flex-1 h-1 -mt-8 ${
                            statusConfig.step >= 2
                              ? "bg-purple-500"
                              : "bg-gray-200"
                          }`}
                        ></div>

                        {/* Step 2: Shortlisted */}
                        <div className="flex flex-col items-center flex-1">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              statusConfig.step >= 2
                                ? "bg-purple-100 text-purple-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <span
                            className={`text-xs mt-2 font-medium ${
                              statusConfig.step >= 2
                                ? "text-slate-900"
                                : "text-gray-400"
                            }`}
                          >
                            Shortlisted
                          </span>
                        </div>

                        {/* Connector */}
                        <div
                          className={`flex-1 h-1 -mt-8 ${
                            statusConfig.step >= 3
                              ? "bg-amber-500"
                              : "bg-gray-200"
                          }`}
                        ></div>

                        {/* Step 3: Interview */}
                        <div className="flex flex-col items-center flex-1">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              statusConfig.step >= 3
                                ? "bg-amber-100 text-amber-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <Calendar className="w-5 h-5" />
                          </div>
                          <span
                            className={`text-xs mt-2 font-medium ${
                              statusConfig.step >= 3
                                ? "text-slate-900"
                                : "text-gray-400"
                            }`}
                          >
                            Interview
                          </span>
                        </div>

                        {/* Connector */}
                        <div
                          className={`flex-1 h-1 -mt-8 ${
                            statusConfig.step >= 4
                              ? "bg-emerald-500"
                              : "bg-gray-200"
                          }`}
                        ></div>

                        {/* Step 4: Accepted */}
                        <div className="flex flex-col items-center flex-1">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              statusConfig.step >= 4
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <span
                            className={`text-xs mt-2 font-medium ${
                              statusConfig.step >= 4
                                ? "text-slate-900"
                                : "text-gray-400"
                            }`}
                          >
                            Hired
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rejected Status */}
                  {app.status === "rejected" && (
                    <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                      <div className="flex items-center gap-2 text-red-700">
                        <XCircle className="w-5 h-5" />
                        <span className="font-medium">
                          Unfortunately, your application was not selected for
                          this position.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
