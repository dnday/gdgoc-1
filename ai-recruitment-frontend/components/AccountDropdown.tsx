"use client";

import Cookies from "js-cookie";
import { ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface AccountDropdownProps {
  userName?: string;
  userEmail?: string;
  userPicture?: string;
  userRole?: string;
}

export default function AccountDropdown({
  userName,
  userEmail,
  userPicture,
  userRole,
}: AccountDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get user info from localStorage if not provided via props
  const [displayName, setDisplayName] = useState(userName || "User");
  const [displayEmail, setDisplayEmail] = useState(userEmail || "");
  const [displayPicture, setDisplayPicture] = useState(userPicture || "");
  const [displayRole, setDisplayRole] = useState(userRole || "recruiter");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("userName");
      const storedEmail = localStorage.getItem("userEmail");
      const storedPicture = localStorage.getItem("userPicture");
      const storedRole = localStorage.getItem("userRole");

      if (storedName && !userName) setDisplayName(storedName);
      if (storedEmail && !userEmail) setDisplayEmail(storedEmail);
      if (storedPicture && !userPicture) setDisplayPicture(storedPicture);
      if (storedRole && !userRole) setDisplayRole(storedRole);
    }
  }, [userName, userEmail, userPicture, userRole]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear all auth data
    Cookies.remove("token");
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPicture");
    }

    console.log("👋 Logged out successfully");
    router.push("/");
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all">
        {/* Avatar */}
        {displayPicture ? (
          <img
            src={displayPicture}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {getInitials(displayName)}
            </span>
          </div>
        )}

        {/* Name & Role */}
        <div className="hidden sm:flex flex-col items-start">
          <span className="text-sm font-medium text-gray-900">
            {displayName}
          </span>
          <span className="text-xs text-gray-500 capitalize">
            {displayRole}
          </span>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-100/50 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {displayPicture ? (
                <img
                  src={displayPicture}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {getInitials(displayName)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {displayName}
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full capitalize">
                    {displayRole}
                  </span>
                  {displayEmail && (
                    <span className="text-xs text-gray-400">•</span>
                  )}
                  {displayEmail && (
                    <p className="text-xs text-gray-500 truncate">
                      {displayEmail}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="pt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
