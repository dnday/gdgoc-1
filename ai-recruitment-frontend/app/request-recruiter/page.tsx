"use client";

import Cookies from "js-cookie";
import {
  Briefcase,
  Building2,
  CheckCircle,
  Clock,
  FileText,
  Globe,
  Mail,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RequestRecruiterAccess() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [existingRequest, setExistingRequest] = useState<any>(null);
  const [checkingRequest, setCheckingRequest] = useState(true);
  const [form, setForm] = useState({
    companyName: "",
    companyEmail: "",
    companyWebsite: "",
    position: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    checkExistingRequest();
  }, []);

  const checkExistingRequest = async () => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/recruiter-requests/my-request",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.ok) {
        const data = await res.json();
        setExistingRequest(data);
      }
    } catch (err) {
      console.error("Error checking request:", err);
    } finally {
      setCheckingRequest(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = Cookies.get("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/recruiter-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit request");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/candidate");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingRequest) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (existingRequest) {
    const statusConfig = {
      pending: {
        icon: <Clock className="w-12 h-12 text-yellow-500" />,
        title: "Request Pending",
        message:
          "Your recruiter access request is currently under review. We'll notify you via email once it's processed.",
        color: "yellow",
      },
      approved: {
        icon: <CheckCircle className="w-12 h-12 text-green-500" />,
        title: "Request Approved!",
        message:
          "Congratulations! Your recruiter access has been approved. You can now access the recruiter dashboard.",
        color: "green",
      },
      rejected: {
        icon: <XCircle className="w-12 h-12 text-red-500" />,
        title: "Request Not Approved",
        message:
          existingRequest.reviewNotes ||
          "Your request could not be approved at this time.",
        color: "red",
      },
    };

    const config =
      statusConfig[existingRequest.status as keyof typeof statusConfig];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="mb-4 flex justify-center">{config.icon}</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {config.title}
            </h1>
            <p className="text-gray-600 mb-6">{config.message}</p>

            <div className="bg-gray-50 rounded-xl p-6 text-left space-y-3">
              <div>
                <span className="text-sm text-gray-500">Company:</span>
                <p className="font-medium text-gray-900">
                  {existingRequest.companyName}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Position:</span>
                <p className="font-medium text-gray-900">
                  {existingRequest.position}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Submitted:</span>
                <p className="font-medium text-gray-900">
                  {new Date(existingRequest.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                router.push(
                  existingRequest.status === "approved"
                    ? "/dashboard"
                    : "/dashboard/candidate",
                )
              }
              className="mt-6 px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Request Submitted!
          </h1>
          <p className="text-gray-600 mb-6">
            Your recruiter access request has been submitted successfully. We'll
            review it and get back to you within 1-2 business days via email.
          </p>
          <button
            onClick={() => router.push("/dashboard/candidate")}
            className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Request Recruiter Access
            </h1>
            <p className="text-gray-600">
              Fill out the form below to request access to recruiter features.
              We'll review your application and get back to you soon.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              <strong>Error:</strong> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Building2 className="w-4 h-4 inline mr-2" />
                Company Name *
              </label>
              <input
                type="text"
                required
                value={form.companyName}
                onChange={(e) =>
                  setForm({ ...form, companyName: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                placeholder="e.g. Tech Corp Inc."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Company Email *
              </label>
              <input
                type="email"
                required
                value={form.companyEmail}
                onChange={(e) =>
                  setForm({ ...form, companyEmail: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                placeholder="you@company.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Please use your official company email
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-2" />
                Company Website (Optional)
              </label>
              <input
                type="url"
                value={form.companyWebsite}
                onChange={(e) =>
                  setForm({ ...form, companyWebsite: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                placeholder="https://company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-2" />
                Your Position *
              </label>
              <input
                type="text"
                required
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                placeholder="e.g. HR Manager, Talent Acquisition Lead"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Why do you need recruiter access? *
              </label>
              <textarea
                required
                minLength={50}
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 resize-none"
                placeholder="Tell us about your hiring needs and why you need recruiter access..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {form.reason.length}/50 characters minimum required
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard/candidate")}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || form.reason.length < 50}
                className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
