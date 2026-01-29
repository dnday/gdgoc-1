import { MoreHorizontal, Sparkles } from "lucide-react";

interface CandidateCardProps {
  name: string;
  role: string;
  matchScore: number;
  status: "Screening" | "Interview" | "Applied" | "Offered";
  timeAgo: string;
  initials: string;
  initialsColor?: string;
}

const statusStyles = {
  Screening: "bg-gray-100 text-gray-700",
  Interview: "bg-blue-50 text-blue-600",
  Applied: "bg-emerald-50 text-emerald-600",
  Offered: "bg-purple-50 text-purple-600",
};

const matchColors = {
  high: "bg-emerald-500",
  medium: "bg-amber-500",
  low: "bg-gray-300",
};

export default function CandidateCard({
  name,
  role,
  matchScore,
  status,
  timeAgo,
  initials,
  initialsColor = "bg-purple-500",
}: CandidateCardProps) {
  const getMatchColor = () => {
    if (matchScore >= 80) return matchColors.high;
    if (matchScore >= 60) return matchColors.medium;
    return matchColors.low;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-100/50 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full ${initialsColor} flex items-center justify-center text-white font-bold text-sm`}>
            {initials}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{name}</h4>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>
        <button className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Match Score */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-sm font-bold ${matchScore >= 80 ? "text-emerald-500" : matchScore >= 60 ? "text-amber-500" : "text-gray-500"}`}>
            {matchScore}% Match
          </span>
          <Sparkles className="w-3.5 h-3.5 text-gray-400" />
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${getMatchColor()} rounded-full transition-all`}
            style={{ width: `${matchScore}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-medium px-3 py-1.5 rounded-full ${statusStyles[status]}`}>
          {status}
        </span>
        <span className="text-xs text-gray-400">{timeAgo}</span>
      </div>
    </div>
  );
}
