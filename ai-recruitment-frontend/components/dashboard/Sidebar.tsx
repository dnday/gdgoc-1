"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Briefcase,
  Sparkles,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

const navItems = [
  {
    section: "PLATFORM",
    items: [
      { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
      { icon: Users, label: "Candidates", href: "/dashboard/candidates" },
      { icon: Briefcase, label: "Jobs", href: "/dashboard/jobs" },
    ],
  },
  {
    section: "INTELLIGENCE",
    items: [
      { icon: Sparkles, label: "AI Insights", href: "/dashboard/ai-insights" },
      {
        icon: MessageSquare,
        label: "Automated Comms",
        href: "/dashboard/comms",
      },
    ],
  },
];

interface SidebarProps {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900">RecruitPro</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto">
        {navItems.map((section) => (
          <div
            key={section.section}
            className="mb-6">
            <p className="px-3 mb-2 text-xs font-semibold text-gray-400 tracking-wider">
              {section.section}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <button
                      onClick={() => router.push(item.href)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}>
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-sm">
                {user?.name?.charAt(0) || "U"}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name || "Alex Morgan"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.role || "Head of Talent"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
