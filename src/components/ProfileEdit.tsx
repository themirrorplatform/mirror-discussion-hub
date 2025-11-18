import React, { useEffect, useRef, useState } from "react";
import { X, Upload, Camera } from "lucide-react";

interface ProfileEditProps {
  user: any | null;
  initialProfile?: any | null;
  onClose?: () => void;
  onSaved?: (profile: any) => void;
}

export function ProfileEdit({
  user,
  initialProfile,
  onClose,
  onSaved,
}: ProfileEditProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);

  /* ---------- Load profile ---------- */

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadProfile() {
      setLoading(true);
      setError(null);

      try {
        let profile = initialProfile ?? null;

        // Simulate loading profile if no initialProfile provided
        if (!profile) {
          // In a real implementation, you'd fetch from Supabase
          profile = {
            display_name: "",
            bio: "",
            avatar_url: null,
            banner_url: null,
          };
        }

        if (profile) {
          setDisplayName(profile.display_name ?? "");
          setBio(profile.bio ?? "");
          setAvatarUrl(profile.avatar_url ?? null);
          setBannerUrl(profile.banner_url ?? null);
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong loading your profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user, initialProfile]);

  /* ---------- File handlers ---------- */

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : null);
  }

  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setBannerFile(file);
    setBannerPreview(file ? URL.createObjectURL(file) : null);
  }

  /* ---------- Save ---------- */

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);

    try {
      // In a real implementation, you'd upload files to Supabase Storage
      // and update the profile in the database
      
      const updatedProfile = {
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatarPreview || avatarUrl,
        banner_url: bannerPreview || bannerUrl,
      };

      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (onSaved) onSaved(updatedProfile);
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      setError("Unexpected error while saving profile.");
    } finally {
      setSaving(false);
    }
  }

  /* ---------- No user guard ---------- */

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 glass-blur"
          onClick={onClose}
        ></div>

        {/* Card */}
        <div className="relative w-full max-w-md bg-[#0E0E0E] border border-[#232323] rounded-[24px] p-8 text-center shadow-[0_0_50px_rgba(0,0,0,0.9)]">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#D6AF36] to-transparent opacity-70" />
          
          <h2 className="text-white mb-2">Sign in to edit profile</h2>
          <p className="text-sm text-[#BDBDBD] mb-6">
            You need to be signed in to update how you appear on The Mirror.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-[#D6AF36] to-[#FFD700] text-black rounded-lg hover:opacity-90 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  /* ---------- UI ---------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 glass-blur"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#0E0E0E] border border-[#232323] rounded-[24px] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
        {/* Gold glint strip */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#D6AF36] to-transparent opacity-70" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#232323]">
          <div>
            <h2 className="text-white mb-1">Edit Profile</h2>
            <p className="text-sm text-[#BDBDBD]">
              Tune how you appear across The Mirror discussion hub.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#BDBDBD] hover:text-white transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className="p-8">
            <p className="text-sm text-[#BDBDBD]">Loading profile…</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6 space-y-6">
            {/* Banner Section */}
            <div className="space-y-3">
              <label className="block text-sm text-[#BDBDBD]">
                Banner Image
              </label>
              <div className="relative w-full h-40 rounded-[14px] border border-[#232323] bg-black overflow-hidden group">
                {/* Banner Image or Placeholder */}
                {(bannerPreview || bannerUrl) ? (
                  <>
                    <img
                      src={bannerPreview ?? bannerUrl ?? ""}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D6AF36]/20 to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Upload size={32} className="text-[#D6AF36] mx-auto mb-2 opacity-50" />
                      <p className="text-xs text-[#666]">No banner set</p>
                    </div>
                  </div>
                )}

                {/* Overlay Button */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="px-4 py-2 bg-gradient-to-r from-[#D6AF36] to-[#FFD700] text-black rounded-lg hover:scale-105 transition-transform duration-200 shadow-[0_6px_20px_rgba(214,175,54,0.3)] flex items-center gap-2"
                  >
                    <Camera size={16} />
                    Change Banner
                  </button>
                </div>

                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Avatar + Display Name Section */}
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="space-y-3">
                <label className="block text-sm text-[#BDBDBD]">Avatar</label>
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full ring-4 ring-[#D6AF36] bg-black overflow-hidden">
                    {(avatarPreview || avatarUrl) ? (
                      <img
                        src={avatarPreview ?? avatarUrl ?? ""}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Upload size={20} className="text-[#D6AF36] opacity-50" />
                      </div>
                    )}
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 rounded-full bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="text-xs text-[#D6AF36] hover:text-[#FFD700] transition-colors duration-200"
                    >
                      <Camera size={20} />
                    </button>
                  </div>

                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Display Name */}
              <div className="flex-1 space-y-3">
                <label htmlFor="displayName" className="block text-sm text-[#BDBDBD]">
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="How should we show your name?"
                  className="w-full px-4 py-3 bg-black border border-[#232323] rounded-lg text-white placeholder:text-[#666] focus:outline-none focus:border-[#D6AF36] transition-colors duration-200"
                />
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-3">
              <label htmlFor="bio" className="block text-sm text-[#BDBDBD]">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Share what you're exploring, reflecting on, or building..."
                className="w-full px-4 py-3 bg-black border border-[#232323] rounded-lg text-white placeholder:text-[#666] focus:outline-none focus:border-[#D6AF36] transition-colors duration-200 resize-none"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-black border border-[#232323] text-[#BDBDBD] rounded-lg hover:border-[#D6AF36] hover:text-white transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-[#D6AF36] to-[#FFD700] text-black rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] shadow-[0_6px_20px_rgba(214,175,54,0.3)]"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}


