"use client";

import Cookies from "js-cookie";
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Globe,
  Mail,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RecruiterRequest {
  id: string;
  companyName: string;
  companyEmail: string;
  companyWebsite?: string;
  position: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
  user: {
    id: string;
    name: string;
    email: string;
    picture?: string;
  };
}

export default function AdminRecruiterRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState<RecruiterRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");
  const [selectedRequest, setSelectedRequest] =
    useState<RecruiterRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const url =
        filter === "all"
          ? "http://localhost:3000/recruiter-requests"
          : `http://localhost:3000/recruiter-requests?status=${filter}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch requests");

      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (
    requestId: string,
    action: "approve" | "reject",
  ) => {
    const token = Cookies.get("token");
    if (!token) return;

    setProcessing(true);

    try {
      const res = await fetch(
        `http://localhost:3000/recruiter-requests/${requestId}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action,
            reviewNotes: reviewNotes || undefined,
          }),
        },
      );

      if (!res.ok) throw new Error("Failed to review request");

      // Refresh data
      await fetchRequests();
      setSelectedRequest(null);
      setReviewNotes("");
      alert(`Request ${action}d successfully! Email sent to user.`);
    } catch (err) {
      console.error("Error reviewing request:", err);
      alert("Failed to process request");
    } finally {
      setProcessing(false);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = {
      pending: { color: "bg-yellow-100 text-yellow-700", text: "Pending" },
      approved: { color: "bg-green-100 text-green-700", text: "Approved" },
      rejected: { color: "bg-red-100 text-red-700", text: "Rejected" },
    };
    const cfg = config[status as keyof typeof config];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${cfg.color}`}>
        {cfg.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Recruiter Access Requests
          </h1>
          <p className="text-gray-600">
            Review and approve recruiter access requests
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex gap-2">
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === f
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="ml-2 text-sm">
                ({requests.filter((r) => f === "all" || r.status === f).length})
              </span>
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="grid gap-4">
          {requests.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No requests found</p>
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {request.user.picture ? (
                      <img
                        src={request.user.picture}
                        alt={request.user.name}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-bold">
                          {request.user.name[0]}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {request.user.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {request.user.email}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={request.status} />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Company</p>
                      <p className="font-medium text-gray-900">
                        {request.companyName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Position</p>
                      <p className="font-medium text-gray-900">
                        {request.position}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Company Email</p>
                      <p className="font-medium text-gray-900">
                        {request.companyEmail}
                      </p>
                    </div>
                  </div>

                  {request.companyWebsite && (
                    <div className="flex items-start gap-2">
                      <Globe className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500">Website</p>
                        <a
                          href={request.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline text-sm"
                        >
                          Visit
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-start gap-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-400 mt-1" />
                    <p className="text-xs text-gray-500">Reason</p>
                  </div>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {request.reason}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  Submitted:{" "}
                  {new Date(request.submittedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

                {request.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                      }}
                      className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}

                {request.reviewNotes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Review Notes:</p>
                    <p className="text-sm text-gray-700">
                      {request.reviewNotes}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Review Request
            </h2>
            <p className="text-gray-600 mb-4">
              Add optional notes for {selectedRequest.user.name}'s request:
            </p>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Add notes (optional)..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 mb-4 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setReviewNotes("");
                }}
                disabled={processing}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReview(selectedRequest.id, "reject")}
                disabled={processing}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all disabled:opacity-50"
              >
                {processing ? "Processing..." : "Reject"}
              </button>
              <button
                onClick={() => handleReview(selectedRequest.id, "approve")}
                disabled={processing}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all disabled:opacity-50"
              >
                {processing ? "Processing..." : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
