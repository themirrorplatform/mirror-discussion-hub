// src/lib/mirrorApi.ts
import supabase from "./supabaseClient";

/* ---------- AUTH ---------- */

export const Auth = {
  me() {
    return supabase.auth.getUser();
  },

  // magic link sign-in
  signIn(email: string) {
    return supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
  },

  signOut() {
    return supabase.auth.signOut();
  },
};

/* ---------- REFLECTIONS ---------- */

export const Reflections = {
  async list(tag?: string) {
    let q = supabase
      .from("reflections")
      .select(
        `
        id,
        title,
        content,
        tags,
        quote,
        video_url,
        created_at,
        author:profiles!reflections_author_fkey (
          id,
          display_name,
          avatar_url,
          role
        )
      `
      )
      .order("created_at", { ascending: false });

    if (tag) q = q.contains("tags", [tag]);

    const { data, error } = await q;
    return { data, error };
  },

  async create(
    userId: string,
    params: {
      title: string;
      content: string;
      tags?: string[];
      quote?: string | null;
      video_url?: string | null;
    }
  ) {
    const { data, error } = await supabase
      .from("reflections")
      .insert({
        author: userId,
        title: params.title,
        content: params.content,
        tags: params.tags ?? [],
        quote: params.quote ?? null,
        video_url: params.video_url ?? null,
      })
      .select(
        `
        id,
        title,
        content,
        tags,
        quote,
        video_url,
        created_at,
        author:profiles!reflections_author_fkey (
          id,
          display_name,
          avatar_url,
          role
        )
      `
      )
      .single();

    if (!error) {
      // optional: award points for posting
      await supabase.from("points").insert({
        user_id: userId,
        delta: 5,
        reason: "reflection",
      });
    }

    return { data, error };
  },
 delete(reflectionId: number) {
    return supabase.from("reflections").delete().eq("id", reflectionId);
  },
};

/* ---------- MIRRORBACKS (COMMENTS) ---------- */

export const Mirrorbacks = {
  list(reflectionId: number) {
    return supabase
      .from("mirrorbacks")
      .select(
        `
        id,
        content,
        created_at,
        parent_id,
        author:profiles (
          id,
          display_name,
          avatar_url,
          role
        )
      `
      )
      .eq("reflection_id", reflectionId)
      .order("created_at", { ascending: true });
  },

  async create(
    userId: string,
    reflectionId: number,
    content: string,
    parentId?: number
  ) {
    const { data, error } = await supabase.from("mirrorbacks").insert({
      reflection_id: reflectionId,
      author: userId,
      content,
      parent_id: parentId ?? null,
    });

    if (!error) {
      await supabase.from("points").insert({
        user_id: userId,
        delta: 2,
        reason: "mirrorback",
      });
    }

    return { data, error };
  },
 delete(mirrorbackId: number) {
    return supabase.from("mirrorbacks").delete().eq("id", mirrorbackId);
  },
};


/* ---------- REACTIONS ---------- */

export type ReactionKind = "reflect" | "appreciate" | "challenge" | "save";

export const Reactions = {
  // Get all reactions (optionally filtered by reflection IDs)
  list(reflectionIds?: number[]) {
    let query = supabase
      .from("reactions")
      .select("id, reflection_id, user_id, kind, created_at");

    if (reflectionIds && reflectionIds.length > 0) {
      query = query.in("reflection_id", reflectionIds);
    }

    return query;
  },

  // Get reactions for a specific reflection
  forReflection(reflectionId: number) {
    return supabase
      .from("reactions")
      .select("id, user_id, kind, created_at")
      .eq("reflection_id", reflectionId);
  },

  add(reflectionId: number, userId: string, kind: ReactionKind) {
    return supabase.from("reactions").insert({
      reflection_id: reflectionId,
      user_id: userId,
      kind,
    });
  },

  remove(reflectionId: number, userId: string, kind: ReactionKind) {
    return supabase
      .from("reactions")
      .delete()
      .match({ reflection_id: reflectionId, user_id: userId, kind });
  },
};

/* ---------- WISHLISTS ---------- */

export const Wishlists = {
  list() {
    return supabase
      .from("wishlists")
      .select(
        `
        id,
        title,
        description,
        status,
        created_at,
        author:profiles (id, display_name, avatar_url),
        votes:wishlist_votes (user_id)
      `
      )
      .order("created_at", { ascending: false });
  },

  async create(
    userId: string,
    params: { title: string; description?: string | null }
  ) {
    const { data, error } = await supabase
      .from("wishlists")
      .insert({
        author: userId,
        title: params.title,
        description: params.description ?? null,
      })
      .select(
        `
        id,
        title,
        description,
        status,
        created_at
      `
      )
      .single();

    if (!error) {
      await supabase.from("points").insert({
        user_id: userId,
        delta: 3,
        reason: "wishlist",
      });
    }

    return { data, error };
  },

  vote(wishlistId: number, userId: string) {
    return supabase.from("wishlist_votes").insert({
      wishlist_id: wishlistId,
      user_id: userId,
    });
  },

  unvote(wishlistId: number, userId: string) {
    return supabase
      .from("wishlist_votes")
      .delete()
      .match({ wishlist_id: wishlistId, user_id: userId });
  },
  delete(wishlistId: number) {
    return supabase.from("wishlists").delete().eq("id", wishlistId);
  },
};

/* ---------- EVENTS ---------- */

export const EventsApi = {
  list() {
    return supabase
      .from("events")
      .select(
        `
        id,
        title,
        description,
        starts_at,
        timezone,
        join_url,
        banner_url
      `
      )
      .order("starts_at", { ascending: true });
  },

  rsvps(eventId: number) {
    return supabase
      .from("event_rsvps")
      .select("user_id")
      .eq("event_id", eventId);
  },

  rsvp(eventId: number, userId: string) {
    return supabase.from("event_rsvps").insert({
      event_id: eventId,
      user_id: userId,
    });
  },

  unrsvp(eventId: number, userId: string) {
    return supabase
      .from("event_rsvps")
      .delete()
      .match({ event_id: eventId, user_id: userId });
  },
};

/* ---------- PROFILES / LEADERBOARD / CHECKLIST ---------- */

export const Profiles = {
  byId(userId: string) {
    return supabase.from("profiles").select("*").eq("id", userId).single();
  },

  stats(userId: string) {
    return supabase
      .from("profile_stats")
      .select("*")
      .eq("user_id", userId)
      .single();
  },

  update(
    userId: string,
    changes: Partial<{
      display_name: string;
      bio: string;
      avatar_url: string;
      banner_url: string;
    }>
  ) {
    return supabase.from("profiles").update(changes).eq("id", userId);
  },

  follow(me: string, target: string) {
    return supabase.from("follows").insert({
      follower: me,
      followee: target,
    });
  },

  unfollow(me: string, target: string) {
    return supabase
      .from("follows")
      .delete()
      .match({ follower: me, followee: target });
  },

  leaderboard() {
    // Join leaderboard view with profiles to get user data
    return supabase
      .from("points")
      .select(`
        user_id,
        profiles!points_user_id_fkey (
          id,
          display_name,
          avatar_url,
          role
        )
      `)
      .order("created_at", { ascending: false });
  },

  async leaderboardWithProfiles() {
    // Alternative: Query leaderboard and then fetch profiles
    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from("leaderboard")
      .select("user_id, score")
      .order("score", { ascending: false })
      .limit(10);

    if (leaderboardError || !leaderboardData) {
      return { data: null, error: leaderboardError };
    }

    // Fetch all profiles for leaderboard users
    const userIds = leaderboardData.map(row => row.user_id);
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, role")
      .in("id", userIds);

    if (profilesError) {
      return { data: null, error: profilesError };
    }

    // Merge leaderboard with profiles
    const merged = leaderboardData.map(row => {
      const profile = profilesData?.find(p => p.id === row.user_id);
      return {
        user_id: row.user_id,
        score: row.score,
        profile: profile || null,
      };
    });

    return { data: merged, error: null };
  },
};

export const Checklist = {
  items() {
    return supabase
      .from("checklist_items")
      .select("*")
      .order("sort", { ascending: true });
  },

  progress(userId: string) {
    return supabase
      .from("checklist_progress")
      .select("*")
      .eq("user_id", userId);
  },

  setDone(userId: string, key: string) {
    return supabase.from("checklist_progress").upsert({
      user_id: userId,
      item_key: key,
      done: true,
      completed_at: new Date().toISOString(),
    });
  },
};
