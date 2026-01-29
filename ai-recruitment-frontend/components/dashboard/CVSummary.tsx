"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Sparkles,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Check,
  BrainCircuit,
  Briefcase,
  GraduationCap,
} from "lucide-react";

// --- Mock AI Response Data ---
const MOCK_SUMMARY = {
  executive:
    "Senior Product Designer with 7+ years of experience in SaaS and Fintech. Strong background in design systems and accessible UI. Previously led a team of 4 designers at TechFlow.",
  skills: [
    "Figma",
    "React Basics",
    "Design Systems",
    "User Research",
    "Agile/Scrum",
    "Prototyping",
  ],
  experience: [
    {
      role: "Senior Product Designer",
      company: "TechFlow Inc.",
      duration: "2020 - Present",
      highlight:
        "Led the redesign of the core dashboard, increasing user engagement by 40%.",
    },
    {
      role: "UX Designer",
      company: "Creative Solutions",
      duration: "2017 - 2020",
      highlight: "Established the company's first design system.",
    },
  ],
  education: "BFA in Interaction Design, Rhode Island School of Design (2016)",
};

interface CVSummaryProps {
  fileName?: string;
  fileSize?: string;
  uploadedAgo?: string;
}

export default function CVSummary({
  fileName = "Sarah_Jenkins_Resume_2024.pdf",
  fileSize = "2.4 MB",
  uploadedAgo = "2 hours ago",
}: CVSummaryProps) {
  const [status, setStatus] = useState<"processing" | "complete">("processing");
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [copied, setCopied] = useState(false);

  // Simulate AI Processing
  useEffect(() => {
    if (status === "processing") {
      const timer = setTimeout(() => {
        setStatus("complete");
      }, 2500); // 2.5s simulated delay
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleRegenerate = () => {
    setStatus("processing");
    setFeedback(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_SUMMARY.executive);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
      {/* Header: File Context */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-50 text-red-600 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{fileName}</h2>
            <p className="text-xs text-slate-500">
              Uploaded {uploadedAgo} • {fileSize}
            </p>
          </div>
        </div>

        {/* AI Badge */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-full">
          <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
          <span className="text-xs font-semibold text-indigo-700">
            AI Analysis
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 min-h-[400px]">
        {status === "processing" ? (
          /* Loading State (Skeleton) */
          <div className="space-y-6 animate-pulse">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
              <span className="text-sm font-medium text-indigo-500">
                Analyzing document structure...
              </span>
            </div>

            <div className="space-y-3">
              <div className="h-4 bg-gray-100 rounded w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            </div>

            <div className="pt-4 space-y-3">
              <div className="h-6 bg-gray-100 rounded w-1/4 mb-2"></div>
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-gray-100 rounded-full"></div>
                <div className="h-8 w-24 bg-gray-100 rounded-full"></div>
                <div className="h-8 w-16 bg-gray-100 rounded-full"></div>
              </div>
            </div>
          </div>
        ) : (
          /* Result State */
          <div className="space-y-6">
            {/* Executive Summary Block */}
            <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100 relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleCopy}
                  className="p-1.5 text-indigo-400 hover:text-indigo-700 hover:bg-indigo-100 rounded-md transition-colors"
                  title="Copy text">
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wide">
                  Executive Summary
                </h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {MOCK_SUMMARY.executive}
              </p>
            </div>

            {/* Skills Tags */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Key Skills Detected
              </h4>
              <div className="flex flex-wrap gap-2">
                {MOCK_SUMMARY.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white border border-gray-200 text-slate-700 rounded-full text-xs font-medium shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience Timeline */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                <Briefcase className="w-3.5 h-3.5 mr-1.5" /> Experience
              </h4>
              <div className="space-y-4">
                {MOCK_SUMMARY.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5"></div>
                      {idx !== MOCK_SUMMARY.experience.length - 1 && (
                        <div className="w-px h-full bg-slate-200 my-1"></div>
                      )}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">
                        {exp.role}
                      </h5>
                      <div className="flex items-center text-xs text-slate-500 mt-0.5 mb-1">
                        <span>{exp.company}</span>
                        <span className="mx-1.5 text-slate-300">•</span>
                        <span>{exp.duration}</span>
                      </div>
                      <p className="text-xs text-slate-600 bg-gray-50 p-2 rounded border border-gray-100 inline-block">
                        "{exp.highlight}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                <GraduationCap className="w-3.5 h-3.5 mr-1.5" /> Education
              </h4>
              <p className="text-sm text-slate-700">{MOCK_SUMMARY.education}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium mr-2">
            Was this helpful?
          </span>
          <button
            onClick={() => setFeedback("up")}
            className={`p-1.5 rounded-lg transition-colors ${
              feedback === "up"
                ? "bg-emerald-100 text-emerald-600"
                : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
            }`}>
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => setFeedback("down")}
            className={`p-1.5 rounded-lg transition-colors ${
              feedback === "down"
                ? "bg-red-100 text-red-600"
                : "text-slate-400 hover:text-red-600 hover:bg-red-50"
            }`}>
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={status === "processing"}
          className="flex items-center px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
          <RefreshCw
            className={`w-3.5 h-3.5 mr-2 ${
              status === "processing" ? "animate-spin" : ""
            }`}
          />
          Regenerate Summary
        </button>
      </div>
    </div>
  );
}
