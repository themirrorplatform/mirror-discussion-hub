// src/components/ReflectionDiscussion.tsx
import { useState } from "react";
import { Mirrorbacks } from "../lib/mirrorApi";
import { ReflectionActionsIconOnly } from "./ui/ReflectionCardActions";

interface ReflectionDiscussionProps {
  reflectionId: number;
  user: any | null;
}

interface Mirrorback {
  id: number;
  content: string;
  created_at: string;
  parent_id: number | null;
  author: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    role: string | null;
  } | null;
}

export function ReflectionDiscussion({
  reflectionId,
  user,
}: ReflectionDiscussionProps) {
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [mirrorbacks, setMirrorbacks] = useState<Mirrorback[]>([]);
  const [loadingMirrorbacks, setLoadingMirrorbacks] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadMirrorbacks() {
    setLoadingMirrorbacks(true);
    const { data, error } = await Mirrorbacks.list(reflectionId);

    if (error) {
      console.error("Error loading mirrorbacks:", error);
      setMirrorbacks([]);
    } else {
      setMirrorbacks((data ?? []) as Mirrorback[]);
    }

    setLoadingMirrorbacks(false);
  }

  function handleToggleDiscussion() {
    const next = !showDiscussion;
    setShowDiscussion(next);
    if (next && mirrorbacks.length === 0) {
      loadMirrorbacks();
    }
  }

  async function handleSubmitReply(e: React.FormEvent) {
    e.preventDefault();
    if (!newReply.trim()) return;

    if (!user?.id) {
      alert("Please sign in to reply.");
      return;
    }

    setSubmittingReply(true);

    const { error } = await Mirrorbacks.create(
      user.id,
      reflectionId,
      newReply.trim()
    );

    if (error) {
      console.error("Error creating mirrorback:", error);
      alert("There was a problem posting your reflection reply.");
      setSubmittingReply(false);
      return;
    }

    // Refetch so we get joined author info
    await loadMirrorbacks();
    setNewReply("");
    setSubmittingReply(false);
  }

  async function handleDeleteMirrorback(mirrorbackId: number) {
    if (!user?.id) {
      alert("Please sign in to manage your replies.");
      return;
    }

    if (!window.confirm("Delete this reply? This cannot be undone.")) {
      return;
    }

    setDeletingId(mirrorbackId);
    const { error } = await Mirrorbacks.delete(mirrorbackId);

    if (error) {
      console.error("Error deleting mirrorback:", error);
      alert("Could not delete this reply.");
      setDeletingId(null);
      return;
    }

    setMirrorbacks((prev) => prev.filter((mb) => mb.id !== mirrorbackId));
    setDeletingId(null);
  }

  return (
    <div className="space-y-3">
      {/* Toggle row */}
      <button
        type="button"
        onClick={handleToggleDiscussion}
        className="text-xs text-[#BDBDBD] hover:text-white flex items-center gap-2"
      >
        <span>{showDiscussion ? "Hide discussion" : "Discussion"}</span>
        {mirrorbacks.length > 0 && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 border border-[#232323] text-[#D6AF36]">
            {mirrorbacks.length}
          </span>
        )}
      </button>

      {/* Thread */}
      {showDiscussion && (
        <div className="mt-1 space-y-4">
          {loadingMirrorbacks ? (
            <p className="text-xs text-[#BDBDBD]">Loading discussion…</p>
          ) : mirrorbacks.length === 0 ? (
            <p className="text-xs text-[#BDBDBD]">
              No reflections in this thread yet. Be the first to respond.
            </p>
          ) : (
            <div className="space-y-3">
              {mirrorbacks.map((mb) => {
                const isOwner = user?.id && mb.author?.id === user.id;

                return (
                  <div
                    key={mb.id}
                    className="flex gap-3 bg-black/40 border border-[#232323] rounded-lg p-3"
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={
                          mb.author?.avatar_url ??
                          "https://ui-avatars.com/api/?name=MI"
                        }
                        alt={mb.author?.display_name ?? "User"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-white truncate max-w-[40%]">
                          {mb.author?.display_name ?? "Unknown"}
                        </span>
                        {mb.author?.role && (
                          <span className="text-[10px] text-[#BDBDBD]">
                            • {mb.author.role}
                          </span>
                        )}

                        <span className="ml-auto text-[10px] text-[#6A6A6A]">
                          {new Date(mb.created_at).toLocaleString()}
                        </span>

                        {/* Mirrorback delete – reuse Reflection icon-only UI */}
                        {isOwner && (
                          <div className="ml-2">
                            <ReflectionActionsIconOnly
                              isOwner
                              onEdit={undefined}
                              onDelete={
                                deletingId === mb.id
                                  ? undefined
                                  : () => handleDeleteMirrorback(mb.id)
                              }
                            />
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-[#D4D4D4] leading-snug whitespace-pre-wrap">
                        {mb.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Reply box */}
          <form onSubmit={handleSubmitReply} className="space-y-2">
            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder={
                user?.id
                  ? "Write a reflection back…"
                  : "Sign in to join this discussion…"
              }
              className="w-full px-3 py-2 bg-black border border-[#232323] rounded-lg text-xs text-white placeholder:text-[#6A6A6A] focus:outline-none focus:border-[#D6AF36]"
              rows={2}
              disabled={submittingReply || !user?.id}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={
                  submittingReply || !user?.id || !newReply.trim()
                }
                className="px-4 py-1.5 rounded-full bg-[#D6AF36] text-black text-xs font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {submittingReply ? "Posting…" : "Reply"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
