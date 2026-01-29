import { Sparkles } from "lucide-react";

interface ActionItem {
  id: string;
  badge: string;
  badgeType: "match" | "draft";
  title: string;
  description: string;
  time: string;
}

const mockActions: ActionItem[] = [
  {
    id: "1",
    badge: "High Match",
    badgeType: "match",
    title: "Review Sarah Jenkins",
    description:
      "94% Match for Senior Product Designer. Strong portfolio detected.",
    time: "2h ago",
  },
  {
    id: "2",
    badge: "Draft Ready",
    badgeType: "draft",
    title: "Interview Invites (3)",
    description:
      "AI drafted 3 interview requests based on recent stage changes.",
    time: "10m ago",
  },
];

export default function AIPriorityActions() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-bold text-gray-900">AI Priority Actions</h3>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {mockActions.map((action) => (
          <div
            key={action.id}
            className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  action.badgeType === "match"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-purple-50 text-purple-600"
                }`}>
                {action.badge}
              </span>
              <span className="text-xs text-gray-400">{action.time}</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {action.title}
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              {action.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
