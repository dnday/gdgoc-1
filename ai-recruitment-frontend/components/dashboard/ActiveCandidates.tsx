import CandidateCard from "./CandidateCard";

const mockCandidates = [
  {
    id: "1",
    name: "Sarah Jenkins",
    role: "Senior Product Designer",
    matchScore: 94,
    status: "Screening" as const,
    timeAgo: "2h ago",
    initials: "SJ",
    initialsColor: "bg-purple-500",
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Frontend Engineer",
    matchScore: 88,
    status: "Interview" as const,
    timeAgo: "1d ago",
    initials: "MC",
    initialsColor: "bg-blue-500",
  },
  {
    id: "3",
    name: "Jessica Alu",
    role: "Product Manager",
    matchScore: 62,
    status: "Applied" as const,
    timeAgo: "3d ago",
    initials: "JA",
    initialsColor: "bg-teal-500",
  },
];

export default function ActiveCandidates() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900">Active Candidates</h3>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          View Board
        </button>
      </div>

      {/* Candidates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockCandidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            name={candidate.name}
            role={candidate.role}
            matchScore={candidate.matchScore}
            status={candidate.status}
            timeAgo={candidate.timeAgo}
            initials={candidate.initials}
            initialsColor={candidate.initialsColor}
          />
        ))}
      </div>
    </div>
  );
}
