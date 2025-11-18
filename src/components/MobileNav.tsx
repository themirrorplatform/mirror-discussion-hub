import { Home, Search, PlusCircle, Bell, User } from "lucide-react";
import { useState, useEffect } from "react";

interface MobileNavProps {
  onOpenComposer: () => void;
  /**
   * The currently active section of the app.
   * Example: "home" | "reflections" | "events" | "profile"
   */
  active?: string;

  /**
   * Current Supabase user (optional)
   */
  user?: { id: string; email?: string } | null;

  /**
   * Number of unread notifications (optional)
   */
  notifications?: number;

  /**
   * For real navigation later (router)
   */
  onNavigate?: (section: string) => void;
}

export function MobileNav({
  onOpenComposer,
  active = "home",
  user,
  notifications = 0,
  onNavigate,
}: MobileNavProps) {
  // Helper to trigger either router or fallback anchor behavior
  const go = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    } else {
      // fallback: smooth-scroll to ID
      const el = document.querySelector(`#${section}`);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const tabClass = (section: string) =>
    `flex flex-col items-center gap-1 transition-colors ${
      active === section ? "text-[#D6AF36]" : "text-[#BDBDBD] hover:text-[#D6AF36]"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-[#232323] bg-[#0E0E0E] glass-blur">
      <div className="flex items-center justify-around h-16 px-4">
        {/* HOME */}
        <button onClick={() => go("home")} className={tabClass("home")}>
          <Home size={24} />
          <span className="text-xs">Home</span>
        </button>

        {/* SEARCH / REFLECTIONS */}
        <button
          onClick={() => go("reflections")}
          className={tabClass("reflections")}
        >
          <Search size={24} />
          <span className="text-xs">Search</span>
        </button>

        {/* CREATE */}
        <button onClick={onOpenComposer} className="-mt-2 text-[#D6AF36]">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#D6AF36] to-[#FFD700] flex items-center justify-center shadow-lg">
            <PlusCircle size={28} className="text-black" />
          </div>
        </button>

        {/* ALERTS */}
        <button onClick={() => go("events")} className={tabClass("events")}>
          <div className="relative">
            <Bell size={24} />

            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D6AF36] text-black text-[10px] px-1.5 py-[1px] rounded-full">
                {notifications > 9 ? "9+" : notifications}
              </span>
            )}
          </div>

          <span className="text-xs">Alerts</span>
        </button>

        {/* PROFILE */}
        <button
          onClick={() => {
            if (!user) return go("home"); // force sign-in path or reroute
            go("profile");
          }}
          className={tabClass("profile")}
        >
          <User size={24} />
          <span className="text-xs">
            {user ? "Profile" : "Sign in"}
          </span>
        </button>
      </div>
    </nav>
  );
}
