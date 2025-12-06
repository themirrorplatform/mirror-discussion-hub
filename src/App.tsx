// src/App.tsx
import { useEffect, useState } from "react";
import {
  Auth,
  Profiles,
  Reflections,
  Wishlists,
  EventsApi,
} from "./lib/mirrorApi";
import { ProfileEdit } from "./components/ProfileEdit";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { ReflectionCard } from "./components/ReflectionCard";
import { VideoCard } from "./components/VideoCard";
import { WishlistCard } from "./components/WishlistCard";
import { WishlistComposerModal } from "./components/WishlistComposerModal";
import { EventCard } from "./components/EventCard";
import { LeaderboardCard } from "./components/LeaderboardCard";
import { ProfileCard } from "./components/ProfileCard";
import {
  StartHereWidget,
  PrinciplesWidget,
  TopVoicesWidget,
} from "./components/Sidebar";
import { ComposerModal } from "./components/ComposerModal";
import { Footer } from "./components/Footer";
import { MobileNav } from "./components/MobileNav";
import { QuoteCard } from "./components/QuoteCard";

/* ---------- Email sign-in box ---------- */

function EmailSignIn() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");

    const { error } = await Auth.signIn(email);

    if (error) {
      console.error("Supabase signIn error:", error);
      setStatus("error");
      setMessage(error.message || "Something went wrong signing you in.");
    } else {
      setStatus("sent");
      setMessage(
        "Magic link sent. Check your email and click the link to finish sign-in."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label className="block text-xs text-zinc-400">
        Sign in with a magic link
      </label>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full rounded-lg bg-black/40 border border-zinc-700 px-3 py-2 text-sm text-white"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full text-xs px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-medium"
      >
        {status === "sending" ? "Sending..." : "Send magic link"}
      </button>
      {message && (
        <p className="text-[11px] text-zinc-400 leading-snug">{message}</p>
      )}
    </form>
  );
}

/* ---------- App ---------- */

export default function App() {
  const [composerOpen, setComposerOpen] = useState(false);
  const [wishlistComposerOpen, setWishlistComposerOpen] = useState(false);

  const [reflections, setReflections] = useState<any[]>([]);
  const [wishlists, setWishlists] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [topVoices, setTopVoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [stats, setStats] = useState<any | null>(null);
  const [profileEditOpen, setProfileEditOpen] = useState(false);

  /* ---------- Initial load ---------- */

  useEffect(() => {
    async function load() {
      setLoading(true);

      // 1) Auth
      const { data: me } = await Auth.me();
      const currentUser = me?.user ?? null;
      setUser(currentUser);

      // 2) Main data in parallel
      const [
        { data: reflectionsData, error: reflectionsError },
        { data: wishlistsData, error: wishlistsError },
        { data: eventsData, error: eventsError },
        { data: leaderboardData, error: leaderboardError },
      ] = await Promise.all([
        Reflections.list(),
        Wishlists.list(),
        EventsApi.list(),
        Profiles.leaderboardWithProfiles(),
      ]);

      // Reflections
      if (reflectionsError) {
        console.error("Error loading reflections:", reflectionsError);
        setReflections([]);
      } else {
        const normalizedReflections = (reflectionsData ?? []).map((r: any) => ({
          ...r,
          author: {
            name: r.author?.display_name ?? "Unknown",
            role: r.author?.role ?? "Witness",
            avatar:
              r.author?.avatar_url ??
              "https://ui-avatars.com/api/?name=Mirror",
          },
          authorId: r.author?.id ?? null,
          timestamp: r.created_at
            ? new Date(r.created_at).toLocaleString()
            : "",
        }));

        // Load reactions for all reflections
        const reflectionIds = normalizedReflections.map((r: any) => r.id);
        if (reflectionIds.length > 0) {
          const { data: reactionsData } = await Reactions.list(reflectionIds);
          const withReactions = mergeReactionsWithReflections(
            normalizedReflections,
            reactionsData ?? [],
            currentUser?.id ?? null
          );
          setReflections(withReactions);
        } else {
          setReflections(normalizedReflections);
        }
      }

      // Wishlists
      if (wishlistsError) {
        console.error("Error loading wishlists:", wishlistsError);
        setWishlists([]);
      } else {
        const normalizedWishlists = (wishlistsData ?? []).map((w: any) => {
          const votes = w.votes ?? [];
          const hasEchoed =
            !!currentUser &&
            votes.some((v: any) => v.user_id === currentUser.id);

          return {
            id: w.id,
            title: w.title,
            description: w.description ?? "",
            author: {
              name: w.author?.display_name ?? "Unknown",
              avatar:
                w.author?.avatar_url ??
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(
                    w.author?.display_name ?? "Mirror Member"
                  ),
            },
            authorId: w.author.id ?? null, //
            echoes: votes.length,
            status: (w.status ?? "newest") as
              | "newest"
              | "top-echoed"
              | "implemented",
            timestamp: w.created_at
              ? new Date(w.created_at).toLocaleDateString()
              : "",
            hasEchoedInitial: hasEchoed,
          };
        });
        setWishlists(normalizedWishlists);
      }

      // Events
      if (eventsError) {
        console.error("Error loading events:", eventsError);
        setEvents([]);
      } else {
        const normalizedEvents = (eventsData ?? []).map((e: any) => {
          const starts = e.starts_at ? new Date(e.starts_at) : null;
          return {
            id: e.id,
            title: e.title,
            description: e.description ?? "",
            image:
              e.banner_url ??
              "https://images.unsplash.com/photo-1681640498069-019a25bc1fe6?auto=format&fit=crop&w=800&q=80",
            date: starts
              ? starts.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "",
            time: starts
              ? starts.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                }) +
                (e.timezone ? ` ${e.timezone}` : "")
              : "",
            attendees: 0, // can be wired to RSVPs later
          };
        });
        setEvents(normalizedEvents);
      }

      // Leaderboard + Top Voices
      if (leaderboardError) {
        console.error("Error loading leaderboard:", leaderboardError);
        setLeaderboard([]);
        setTopVoices([]);
      } else {
        const normalizedLeaderboard = (leaderboardData ?? []).map(
          (row: any, idx: number) => ({
            rank: idx + 1,
            name: row.profile?.display_name || "Anonymous User",
            avatar:
              row.profile?.avatar_url ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(row.profile?.display_name || "User"),
            xp: row.score ?? 0,
            role: row.profile?.role || "Witness",
          })
        );
        setLeaderboard(normalizedLeaderboard);
        setTopVoices(
          normalizedLeaderboard.slice(0, 3).map((entry: any) => ({
            name: entry.name,
            avatar: entry.avatar,
            role: entry.role,
          }))
        );
      }

      // Profile + stats
      if (currentUser) {
        const [{ data: prof }, { data: statsRow }] = await Promise.all([
          Profiles.byId(currentUser.id),
          Profiles.stats(currentUser.id),
        ]);
        setProfile(prof ?? null);
        setStats(statsRow ?? null);
      } else {
        setProfile(null);
        setStats(null);
      }

      setLoading(false);
    }

    load();
  }, []);

  /* ---------- Create reflection ---------- */

  async function handleCreateReflection(input: {
    title: string;
    content: string;
    tags?: string[];
    quote?: string | null;
    video_url?: string | null;
  }) {
    if (!user) {
      alert("Sign in first to share a reflection.");
      return;
    }

    const { data, error } = await Reflections.create(user.id, input);

    if (error || !data) {
      console.error("Error creating reflection:", error);
      alert("Something went wrong creating your reflection.");
      return;
    }

    const newReflection = {
      ...data,
      author: {
        name: data.author?.display_name ?? "Unknown",
        role: data.author?.role ?? "Witness",
        avatar:
          data.author?.avatar_url ??
          "https://ui-avatars.com/api/?name=Mirror",
      },
      timestamp: data.created_at
        ? new Date(data.created_at).toLocaleString()
        : "",
    };

    setReflections((prev) => [newReflection, ...prev]);

    const { data: statsRow } = await Profiles.stats(user.id);
    setStats(statsRow ?? null);

    setComposerOpen(false);
  }

  /* ---------- Create wishlist ---------- */
  async function handleCreateWishlist(input: {
    title: string;
    description: string;
    category: string;
    reasoning?: string;
  }) {
    if (!user) {
      alert("Sign in first to share a wishlist idea.");
      return;
    }

    try {
      const { data, error } = await Wishlists.create(user.id, {
        title: input.title,
        description: input.description ?? null,
        // category + reasoning can be wired to DB later
      });

      if (error || !data) {
        console.error("Error creating wishlist:", error);
        alert("Something went wrong creating your wishlist idea.");
        return;
      }

      const newWishlist = {
        id: data.id,
        title: data.title,
        description: data.description ?? "",
        author: {
          name: profile?.display_name ?? user.email ?? "You",
          avatar:
            profile?.avatar_url ??
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(profile?.display_name ?? "You"),
        },
        // ✅ so delete permissions work immediately
        authorId: user.id,

        echoes: 0,
        status: (data.status ?? "newest") as
          | "newest"
          | "top-echoed"
          | "implemented",
        timestamp: data.created_at
          ? new Date(data.created_at).toLocaleDateString()
          : "",
        hasEchoedInitial: false,
      };

      setWishlists((prev) => [newWishlist, ...prev]);
      setWishlistComposerOpen(false);
    } catch (err) {
      console.error("Unexpected wishlist error:", err);
      alert("Something went wrong creating your wishlist idea.");
    }
  }


  /* ---------- Video reflections from database ---------- */

  // Filter reflections that have video URLs
  const videos = reflections
    .filter((r: any) => r.video_url)
    .map((r: any) => ({
      author: r.author,
      title: r.title,
      thumbnail: r.video_url ? getThumbnailFromVideoUrl(r.video_url) : "",
      duration: "0:00", // Could be extracted from video metadata
      timestamp: r.timestamp,
      reflectCount: r.reflectCount ?? 0,
      appreciateCount: r.appreciateCount ?? 0,
      challengeCount: r.challengeCount ?? 0,
      video_url: r.video_url,
    }));

  // Helper to extract thumbnail from video URL (YouTube, Vimeo, etc.)
  function getThumbnailFromVideoUrl(url: string): string {
    try {
      const urlObj = new URL(url);

      // YouTube
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        const videoId = urlObj.searchParams.get('v') || urlObj.pathname.slice(1);
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }

      // Vimeo
      if (urlObj.hostname.includes('vimeo.com')) {
        // Vimeo requires API call for thumbnail, using placeholder
        return "https://images.unsplash.com/photo-1631551437792-ae5a0fb41c49?auto=format&fit=crop&w=600&q=80";
      }

      // Default fallback
      return "https://images.unsplash.com/photo-1631551437792-ae5a0fb41c49?auto=format&fit=crop&w=600&q=80";
    } catch {
      return "https://images.unsplash.com/photo-1631551437792-ae5a0fb41c49?auto=format&fit=crop&w=600&q=80";
    }
  }

   /* ---------- Render ---------- */

  return (
    <>
      <div className="min-h-screen bg-black pb-20 lg:pb-0">
        <Navigation onOpenComposer={() => setComposerOpen(true)} />

        {/* Hero Section */}
        <div className="pt-16" id="home">
          <Hero onOpenComposer={() => setComposerOpen(true)} />
        </div>

        {/* Main Content */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar */}
            <aside className="hidden lg:block lg:col-span-3 space-y-6">
              <StartHereWidget />
              <PrinciplesWidget />
            </aside>

            {/* Center Feed */}
            <main className="lg:col-span-6 space-y-8">
              {/* Quote of the Day */}
              <QuoteCard
                quote="Every post is a mirror; every response, a reflection."
                author="The Mirror Principles"
              />
{/* Reflections */}
<section id="reflections">
  <h2 className="text-white mb-6">Recent Reflections</h2>
  <div className="space-y-6">
    {reflections.map((reflection, index) => (
      <ReflectionCard
        key={reflection.id ?? index}
        {...reflection}
        user={user}
        currentUserId={user?.id ?? undefined}
        canDelete={
          !!user && (reflection.authorId === user.id || profile?.is_admin)
        }
        canEdit={!!user && reflection.authorId === user.id}
        onDelete={async (reflectionId) => {
          const { error } = await Reflections.delete(reflectionId);
          if (error) {
            console.error("Error deleting reflection:", error);
            alert("Could not delete this reflection.");
            return;
          }
          setReflections((prev) =>
            prev.filter((r: any) => r.id !== reflectionId)
          );
        }}
        onEdit={(reflectionId) => {
          // hook this up later to an edit modal or inline editor
          console.log("Edit reflection", reflectionId);
        }}
      />
    ))}

    {!loading && reflections.length === 0 && (
      <p className="text-sm text-zinc-400">
        No reflections yet. Be the first to share.
      </p>
    )}
  </div>
</section>
              {/* Videos */}
              <section id="videos">
                <h2 className="text-white mb-6">Video Reflections</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videos.map((video, index) => (
                    <VideoCard key={index} {...video} />
                  ))}
                </div>
              </section>

              {/* Wishlists */}
              <section id="wishlists">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white">Ideas the Community Echoes</h2>
                  <button
                    onClick={() => setWishlistComposerOpen(true)}
                    className="text-xs px-3 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-medium hover:opacity-90 transition"
                  >
                    New Wishlist Idea
                  </button>
                </div>

<div className="space-y-4">
  {wishlists.map((wishlist: any) => (
    <WishlistCard
      key={wishlist.id}
      {...wishlist}
      // ✅ who can delete (owner or admin)
      canDelete={
        !!user && (wishlist.authorId === user.id || profile?.is_admin)
      }
      // ✅ what happens on delete
      onDelete={async (wishlistId) => {
        if (!wishlistId) return;

        if (!window.confirm("Delete this wishlist? This cannot be undone.")) {
          return;
        }

        const { error } = await Wishlists.delete(wishlistId);
        if (error) {
          console.error("Error deleting wishlist:", error);
          alert("Could not delete this wishlist.");
          return;
        }

        setWishlists((prev) => prev.filter((w: any) => w.id !== wishlistId));
      }}
      // 🔊 keep echo behavior
      onToggleEcho={async ({ id, nextHasEchoed }) => {
        if (!user || !id) return;
        try {
          if (nextHasEchoed) {
            await Wishlists.vote(id, user.id);
          } else {
            await Wishlists.unvote(id, user.id);
          }
        } catch (err) {
          console.error("Wishlist echo error:", err);
        }
      }}
    />
  ))}

  {/* Empty state ... stays the same */}
  {!loading && wishlists.length === 0 && (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-6 text-sm text-zinc-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p className="font-medium text-white">No wishlist ideas yet.</p>
        <p className="text-xs text-zinc-400 mt-1">
          Be the first to tell us what you’d love this platform to become.
        </p>
      </div>
      <button
        onClick={() => setWishlistComposerOpen(true)}
        className="inline-flex items-center justify-center text-xs px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold hover:opacity-90 transition"
      >
        Add wishlist idea
      </button>
    </div>
  )}
</div>

              </section>

              {/* Events */}
              <section id="events">
                <h2 className="text-white mb-6">Upcoming Reflection Circles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.map((event: any) => (
                    <EventCard key={event.id} {...event} />
                  ))}
                  {!loading && events.length === 0 && (
                    <p className="text-sm text-zinc-400">
                      No events scheduled yet. Stay tuned.
                    </p>
                  )}
                </div>
              </section>
            </main>

            {/* Right Sidebar */}
            <aside className="lg:col-span-3 space-y-6" id="profile">
              {/* Auth box */}
              <div className="bg-zinc-900/80 rounded-2xl p-4">
                {user ? (
                  <div className="flex items-center justify-between text-sm text-white">
                    <span>
                      Signed in as{" "}
                      {profile?.display_name ?? user.email ?? "Unknown"}
                    </span>
                    <button
                      className="text-xs px-3 py-1 rounded-full bg-zinc-700 hover:bg-zinc-600"
                      onClick={async () => {
                        await Auth.signOut();
                        window.location.reload();
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <EmailSignIn />
                )}
              </div>

              {/* Profile card */}
              <ProfileCard
                banner={
                  profile?.banner_url ??
                  "https://images.unsplash.com/photo-1631551437792-ae5a0fb41c49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
                }
                avatar={
                  profile?.avatar_url ??
                  "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100"
                }
                name={profile?.display_name ?? "Your Profile"}
                role={profile?.role ?? "Witness"}
                bio={
                  profile?.bio ??
                  "Exploring the intersections of consciousness, technology, and human connection."
                }
                stats={{
                  reflections: stats?.reflections_count ?? 0,
                  mirrorbacks: stats?.mirrorbacks_count ?? 0,
                  wishlists: stats?.wishlists_count ?? 0,
                  followers: stats?.followers_count ?? 0,
                }}
                canFollow={false}
                onEditProfile={() => setProfileEditOpen(true)}
              />

              <div id="leaderboard">
                <LeaderboardCard entries={leaderboard} />
              </div>

              <TopVoicesWidget voices={topVoices} />
            </aside>
          </div>
        </div>

        <Footer />

        {/* Reflection Composer */}
        <ComposerModal
          isOpen={composerOpen}
          onClose={() => setComposerOpen(false)}
          onSubmit={handleCreateReflection}
        />

        {/* Wishlist Composer */}
        <WishlistComposerModal
          isOpen={wishlistComposerOpen}
          onClose={() => setWishlistComposerOpen(false)}
          onSubmit={handleCreateWishlist}
        />

        {/* Mobile Navigation */}
        <MobileNav onOpenComposer={() => setComposerOpen(true)} />
      </div>

      {/* 🔒 Profile Edit Modal lives OUTSIDE the main layout */}
      {profileEditOpen && (
        <ProfileEdit
          user={user}
          initialProfile={profile}
          onClose={() => setProfileEditOpen(false)}
          onSaved={(updated) => {
            setProfile(updated);
            setProfileEditOpen(false);
          }}
        />
      )}
    </>
  );
}
