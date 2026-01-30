"use client";

import Cookies from "js-cookie";
import {
  ArrowLeft,
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

export default function BecomeRecruiter() {
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
      // If no token, user needs to login first
      setCheckingRequest(false);
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
      setError("Please login or register first to submit a recruiter request");
      setLoading(false);
      setTimeout(() => {
        router.push("/?tab=register");
      }, 2000);
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
        title: "Request Pending Review",
        message:
          "Your recruiter access request is currently under review. We'll notify you via email once it's processed.",
        color: "yellow",
      },
      approved: {
        icon: <CheckCircle className="w-12 h-12 text-green-500" />,
        title: "Request Approved!",
        message:
          "Congratulations! Your recruiter access has been approved. You can now access the recruiter dashboard and post jobs.",
        color: "green",
      },
      rejected: {
        icon: <XCircle className="w-12 h-12 text-red-500" />,
        title: "Request Not Approved",
        message:
          existingRequest.reviewNotes ||
          "Your request could not be approved at this time. Please contact admin for more details.",
        color: "red",
      },
    };

    const config =
      statusConfig[existingRequest.status as keyof typeof statusConfig];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center">
            <div className="mb-6 flex justify-center">{config.icon}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {config.title}
            </h1>
            <p className="text-gray-600 mb-8 text-lg">{config.message}</p>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-left space-y-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 text-lg mb-3">
                Request Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <span className="text-sm text-gray-500 block">Company</span>
                    <p className="font-medium text-gray-900">
                      {existingRequest.companyName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <span className="text-sm text-gray-500 block">
                      Position
                    </span>
                    <p className="font-medium text-gray-900">
                      {existingRequest.position}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <span className="text-sm text-gray-500 block">
                      Submitted
                    </span>
                    <p className="font-medium text-gray-900">
                      {new Date(existingRequest.submittedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>
                {existingRequest.reason && (
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-sm text-gray-500 block">
                        Reason
                      </span>
                      <p className="font-medium text-gray-900 whitespace-pre-wrap">
                        {existingRequest.reason}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => router.push("/")}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
              >
                Go Home
              </button>
              <button
                onClick={() =>
                  router.push(
                    existingRequest.status === "approved"
                      ? "/dashboard"
                      : "/dashboard/candidate",
                  )
                }
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-100">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Request Submitted Successfully!
          </h1>
          <p className="text-gray-600 mb-2 text-lg">
            Thank you for your interest in becoming a recruiter on our platform.
          </p>
          <p className="text-gray-500 mb-8">
            We'll review your application and get back to you within 1-2
            business days via email at{" "}
            <span className="font-medium text-gray-700">
              {form.companyEmail}
            </span>
          </p>

          <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">1.</span>
                <span>
                  Our team will review your request and verify your details
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">2.</span>
                <span>
                  You'll receive an email notification about the decision
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">3.</span>
                <span>
                  Once approved, you can start posting jobs and managing
                  candidates
                </span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => router.push("/dashboard/candidate")}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-3xl mx-auto py-8">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Title Section */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Become a Recruiter
            </h1>
            <p className="text-gray-600">
              Join our platform to post jobs and find the best talent
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Company Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Building2 className="w-4 h-4" />
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.companyName}
                onChange={(e) =>
                  setForm({ ...form, companyName: e.target.value })
                }
                placeholder="e.g., TechCorp Solutions"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Company Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4" />
                Company Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={form.companyEmail}
                onChange={(e) =>
                  setForm({ ...form, companyEmail: e.target.value })
                }
                placeholder="recruiter@company.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Company Website */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Globe className="w-4 h-4" />
                Company Website{" "}
                <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="url"
                value={form.companyWebsite}
                onChange={(e) =>
                  setForm({ ...form, companyWebsite: e.target.value })
                }
                placeholder="https://www.company.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Position */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Briefcase className="w-4 h-4" />
                Your Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                placeholder="e.g., HR Manager, Talent Acquisition Lead"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Why do you want to become a recruiter?{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Please tell us about your recruiting needs, the types of positions you're looking to fill, and why you want to use our platform..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 50 characters required
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">i</span>
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Review Process</p>
                  <p>
                    All recruiter applications are reviewed manually by our team
                    to ensure quality and legitimacy. You'll receive an email
                    notification within 1-2 business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || form.reason.length < 50}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </span>
              ) : (
                "Submit Application"
              )}
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help?{" "}
          <a
            href="mailto:admin@airecruitment.com"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  );
}
