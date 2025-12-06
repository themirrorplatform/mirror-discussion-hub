// src/types/index.ts
// TypeScript type definitions for The Mirror Discussion Hub

// ============================================================================
// Database Types
// ============================================================================

export interface Profile {
  id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  role: 'Witness' | 'Guide';
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Reflection {
  id: number;
  author: string; // UUID
  title: string;
  content: string;
  tags: string[];
  quote: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReflectionWithAuthor extends Omit<Reflection, 'author'> {
  author: Profile;
  authorId: string; // For permission checks
}

export interface Mirrorback {
  id: number;
  reflection_id: number;
  author: string; // UUID
  content: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface MirrorbackWithAuthor extends Omit<Mirrorback, 'author'> {
  author: Profile;
}

export type ReactionKind = 'reflect' | 'appreciate' | 'challenge' | 'save';

export interface Reaction {
  id: number;
  reflection_id: number;
  user_id: string;
  kind: ReactionKind;
  created_at: string;
}

export interface ReactionCounts {
  reflect: number;
  appreciate: number;
  challenge: number;
  save: number;
}

export interface UserReactions {
  reflect: boolean;
  appreciate: boolean;
  challenge: boolean;
  save: boolean;
}

export type WishlistStatus = 'newest' | 'top-echoed' | 'implemented';

export interface Wishlist {
  id: number;
  author: string; // UUID
  title: string;
  description: string | null;
  status: WishlistStatus;
  created_at: string;
  updated_at: string;
}

export interface WishlistWithDetails extends Omit<Wishlist, 'author'> {
  author: Profile;
  authorId: string;
  votes: Array<{ user_id: string }>;
  echoes: number;
  hasEchoedInitial: boolean;
}

export interface Event {
  id: number;
  title: string;
  description: string | null;
  starts_at: string;
  timezone: string | null;
  join_url: string | null;
  banner_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventRSVP {
  id: number;
  event_id: number;
  user_id: string;
  created_at: string;
}

export interface Follow {
  id: number;
  follower: string; // UUID
  followee: string; // UUID
  created_at: string;
}

export interface Points {
  id: number;
  user_id: string;
  delta: number;
  reason: 'reflection' | 'mirrorback' | 'wishlist';
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  score: number;
  activity_count: number;
}

export interface ProfileStats {
  user_id: string;
  reflections_count: number;
  mirrorbacks_count: number;
  wishlists_count: number;
  followers_count: number;
  total_score: number;
}

export interface ChecklistItem {
  id: number;
  item_key: string;
  title: string;
  description: string | null;
  sort: number;
  created_at: string;
}

export interface ChecklistProgress {
  id: number;
  user_id: string;
  item_key: string;
  done: boolean;
  completed_at: string | null;
}

// ============================================================================
// UI Component Types
// ============================================================================

export interface ReflectionCardProps {
  id: number;
  author: {
    name: string;
    role: string;
    avatar: string;
    id?: string;
  };
  title: string;
  content: string;
  tags?: string[] | null;
  timestamp?: string;
  created_at?: string;
  reflectCount?: number;
  appreciateCount?: number;
  challengeCount?: number;
  paradox?: string;
  user: any | null; // Supabase User object
  canEdit?: boolean;
  canDelete?: boolean;
  actionVariant?: 'icon-only' | 'compact' | 'dropdown';
  onDelete?: (reflectionId: number) => void;
  onEdit?: (reflectionId: number) => void;
}

export interface WishlistCardProps {
  id?: number;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
  echoes: number;
  status?: WishlistStatus;
  timestamp: string;
  hasEchoedInitial?: boolean;
  onToggleEcho?: (payload: {
    id?: number;
    nextHasEchoed: boolean;
    nextEchoes: number;
  }) => void;
  canDelete?: boolean;
  onDelete?: (id?: number) => void;
}

export interface VideoCardProps {
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  title: string;
  thumbnail: string;
  duration: string;
  timestamp: string;
  reflectCount: number;
  appreciateCount: number;
  challengeCount: number;
  video_url?: string;
}

export interface EventCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  attendees: number;
}

export interface LeaderboardCardEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  role: string;
}

export interface ProfileCardProps {
  banner: string;
  avatar: string;
  name: string;
  role: string;
  bio: string;
  stats: {
    reflections: number;
    mirrorbacks: number;
    wishlists: number;
    followers: number;
  };
  canFollow?: boolean;
  onEditProfile?: () => void;
}

// ============================================================================
// Form Types
// ============================================================================

export interface ReflectionFormData {
  title: string;
  content: string;
  tags?: string[];
  quote?: string | null;
  video_url?: string | null;
}

export interface WishlistFormData {
  title: string;
  description: string;
  category: string;
  reasoning?: string;
}

export interface ProfileEditFormData {
  display_name: string;
  bio: string;
  avatar_url?: string;
  banner_url?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  sanitized: string;
  error?: string;
}
