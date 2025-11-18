// src/components/ProfileCard.tsx
import { MessageCircle, Users, Lightbulb, Video } from "lucide-react";

interface ProfileCardProps {
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
  /**
   * If false, hides the Follow button (e.g. viewing your own profile).
   */
  canFollow?: boolean;
  /**
   * Whether the current viewer is already following this profile.
   */
  isFollowing?: boolean;
  /**
   * Callback when the follow button is clicked.
   */
  onToggleFollow?: () => void;
  /**
   * Optional: when provided (and canFollow === false),
   * we show an "Edit profile" button for the current user.
   */
  onEditProfile?: () => void;
}

export function ProfileCard({
  banner,
  avatar,
  name,
  role,
  bio,
  stats,
  canFollow = true,
  isFollowing = false,
  onToggleFollow,
  onEditProfile,
}: ProfileCardProps) {
  const isOwnProfile = !canFollow && !!onEditProfile;

  return (
    <div className="bg-[#050505] border border-[#232323] rounded-[24px] overflow-hidden">
      {/* Banner */}
      <div className="relative h-32">
        <img src={banner} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#D6AF36]/30 to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="relative -mt-16 mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#D6AF36] bg-black">
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          </div>
        </div>

        <h3 className="text-white text-lg font-semibold mb-1">{name}</h3>
        <p className="text-[#D6AF36] text-sm mb-3">{role}</p>
        <p className="text-[#BDBDBD] text-sm leading-relaxed mb-6">{bio}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-[#232323]">
            <MessageCircle size={20} className="text-[#D6AF36]" />
            <div>
              <p className="text-white text-sm">{stats.reflections}</p>
              <p className="text-xs text-[#BDBDBD]">Reflections</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-[#232323]">
            <Video size={20} className="text-[#D6AF36]" />
            <div>
              <p className="text-white text-sm">{stats.mirrorbacks}</p>
              <p className="text-xs text-[#BDBDBD]">Mirrorbacks</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-[#232323]">
            <Lightbulb size={20} className="text-[#D6AF36]" />
            <div>
              <p className="text-white text-sm">{stats.wishlists}</p>
              <p className="text-xs text-[#BDBDBD]">Wishlists</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-[#232323]">
            <Users size={20} className="text-[#D6AF36]" />
            <div>
              <p className="text-white text-sm">{stats.followers}</p>
              <p className="text-xs text-[#BDBDBD]">Followers</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {isOwnProfile ? (
          <button
            type="button"
            onClick={onEditProfile}
            className="w-full mt-2 py-3 rounded-full bg-gradient-to-r from-[#D6AF36] to-[#FFD700] text-black text-sm font-semibold hover:opacity-90 transition"
          >
            Edit profile
          </button>
        ) : canFollow ? (
          <button
            type="button"
            onClick={onToggleFollow}
            className={`w-full mt-2 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${
              isFollowing
                ? "bg-transparent border border-[#D6AF36] text-[#D6AF36] hover:bg-[#D6AF36]/10"
                : "bg-gradient-to-r from-[#D6AF36] to-[#FFD700] text-black hover:opacity-90"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
