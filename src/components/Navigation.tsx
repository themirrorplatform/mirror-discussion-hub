import { useState } from "react";
import { Menu, X } from "lucide-react";

interface NavigationProps {
  onOpenComposer: () => void;

  /**
   * Which section is currently active.
   * Example: "home" | "reflections" | "videos" | "wishlists" | "events" | "leaderboard" | "profile"
   */
  active?: string;

  /**
   * Current user (from Supabase auth) – optional.
   */
  user?: {
    id: string;
    email?: string | null;
    display_name?: string | null;
  } | null;

  /**
   * Optional router-style navigation.
   * If provided, we'll call onNavigate("reflections") etc.
   * If NOT provided, we fall back to #id smooth scrolling.
   */
  onNavigate?: (section: string) => void;
}

const links = [
  { id: "home", label: "Home" },
  { id: "reflections", label: "Reflections" },
  { id: "videos", label: "Videos" },
  { id: "wishlists", label: "Wishlists" },
  { id: "events", label: "Events" },
  { id: "leaderboard", label: "Top Voices" },
  { id: "profile", label: "Profile" },
];

export function Navigation({
  onOpenComposer,
  active = "home",
  user,
  onNavigate,
}: NavigationProps) {
  const [open, setOpen] = useState(false);

  const handleNav = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    } else {
      const el = document.querySelector<HTMLElement>(`#${section}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // fallback to hash if no element found
        window.location.hash = `#${section}`;
      }
    }
  };

  const linkClass = (id: string) =>
    `text-xs font-medium transition-colors ${
      active === id
        ? "text-white"
        : "text-zinc-400 hover:text-white"
    }`;

  const displayName =
    user?.display_name || user?.email || undefined;

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-black/80 backdrop-blur border-b border-zinc-900">
      <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNav("home")}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-black">
            M
          </div>
          <span className="text-sm sm:text-base font-semibold text-white">
            The Mirror
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNav(link.id)}
              className={linkClass(link.id)}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right side: CTA + user chip */}
        <div className="flex items-center gap-3">
          {displayName && (
            <span className="hidden lg:inline-flex text-[11px] text-zinc-400">
              Signed in as{" "}
              <span className="ml-1 text-zinc-200">
                {displayName}
              </span>
            </span>
          )}

          {/* CTA */}
          <button
            onClick={onOpenComposer}
            className="hidden sm:inline-flex items-center justify-center text-xs sm:text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:opacity-90 transition"
          >
            Share a Reflection
          </button>

          {/* Mobile toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center text-zinc-300"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-zinc-900 px-4 pb-4 space-y-3">
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => {
                setOpen(false);
                handleNav(link.id);
              }}
              className={`block w-full text-left text-sm ${
                active === link.id
                  ? "text-white"
                  : "text-zinc-300"
              }`}
            >
              {link.label}
            </button>
          ))}

          <button
            onClick={() => {
              setOpen(false);
              onOpenComposer();
            }}
            className="w-full mt-2 text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black"
          >
            Share a Reflection
          </button>

          {displayName && (
            <p className="mt-2 text-[11px] text-zinc-400">
              Signed in as{" "}
              <span className="text-zinc-200">{displayName}</span>
            </p>
          )}
        </div>
      )}
    </header>
  );
}
