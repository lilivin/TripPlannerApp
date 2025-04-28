import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut, User, Map } from "lucide-react";

const UserMenuDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
      // Logout jest obsługiwany przez AuthProvider, który przekieruje użytkownika
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return null;
  }

  const avatarUrl = user.profile?.avatar_url;
  const userEmail = user.email || "User";
  const displayName = userEmail.split("@")[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <Button onClick={toggleDropdown} variant="ghost" size="sm" className="flex items-center space-x-2 rounded-full">
        {avatarUrl ? (
          <img src={avatarUrl} alt={`${displayName}'s avatar`} className="h-8 w-8 rounded-full" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden md:inline">{displayName}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 py-2 bg-white dark:bg-gray-800 rounded-md shadow-xl z-50 border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{displayName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
          </div>

          <a
            href="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <User className="w-4 h-4 mr-2" />
            <span>Profile</span>
          </a>

          <a
            href="/plans"
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Map className="w-4 h-4 mr-2" />
            <span>My Plans</span>
          </a>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenuDropdown;
