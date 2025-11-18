import { MessageCircle, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export interface Mirrorback {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  timestamp: string;
  appreciateCount: number;
  /**
   * Whether the current signed-in user has appreciated this mirrorback.
   * (Comes from backend; we still keep local state for optimism.)
   */
  isAppreciatedByMe?: boolean;
  replies?: Mirrorback[];
}

interface MirrorbackThreadProps {
  mirrorbacks: Mirrorback[];
  level?: number;

  /**
   * Called when user toggles appreciate on a mirrorback.
   * nextValue = true means "user is now appreciating", false = "removed".
   */
  onToggleAppreciate?: (mirrorbackId: string, nextValue: boolean) => void;

  /**
   * Called when user posts a reply.
   * parentId = id of the mirrorback being replied to (or null for top-level).
   */
  onReply?: (parentId: string | null, content: string) => Promise<void> | void;
}

interface MirrorbackItemProps {
  mirrorback: Mirrorback;
  level?: number;
  onToggleAppreciate?: (mirrorbackId: string, nextValue: boolean) => void;
  onReply?: (parentId: string | null, content: string) => Promise<void> | void;
}

function MirrorbackItem({
  mirrorback,
  level = 0,
  onToggleAppreciate,
  onReply,
}: MirrorbackItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const [appreciated, setAppreciated] = useState(
    mirrorback.isAppreciatedByMe ?? false
  );
  const [appreciateCount, setAppreciateCount] = useState(
    mirrorback.appreciateCount
  );

  const hasReplies = !!mirrorback.replies && mirrorback.replies.length > 0;
  const canNest = level < 3;

  const handleAppreciate = () => {
    const next = !appreciated;
    // optimistic UI
    setAppreciated(next);
    setAppreciateCount((prev) => {
      const delta = next ? 1 : -1;
      const updated = prev + delta;
      return updated < 0 ? 0 : updated;
    });

    onToggleAppreciate?.(mirrorback.id, next);
  };

  const handleSubmitReply = async () => {
    const text = replyText.trim();
    if (!text) return;

    try {
      setSubmittingReply(true);
      await onReply?.(mirrorback.id, text);
      setReplyText("");
      setShowReplyForm(false);
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className={level > 0 ? "ml-8 border-l-2 border-[#D6AF36] pl-4" : ""}>
      <div className="mb-4">
        {/* Mirrorback Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#232323] flex-shrink-0 bg-black">
            <img
              src={mirrorback.author.avatar}
              alt={mirrorback.author.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-white text-sm">{mirrorback.author.name}</h4>
              <span className="text-xs text-[#D6AF36]">
                {mirrorback.author.role}
              </span>
              <span className="text-xs text-[#BDBDBD]">
                · {mirrorback.timestamp}
              </span>
            </div>

            <p className="text-[#BDBDBD] text-sm mb-3">{mirrorback.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleAppreciate}
                className={`flex items-center gap-1 text-sm transition-all duration-200 hover:scale-105 ${
                  appreciated ? "text-[#D6AF36]" : "text-[#BDBDBD]"
                }`}
              >
                <Sparkles
                  size={16}
                  className={appreciated ? "fill-[#D6AF36]" : ""}
                />
                <span>{appreciateCount}</span>
              </button>

              {canNest && onReply && (
                <button
                  onClick={() => setShowReplyForm((v) => !v)}
                  className="flex items-center gap-1 text-sm text-[#BDBDBD] hover:text-[#D6AF36] transition-colors"
                >
                  <MessageCircle size={16} />
                  <span>Reply</span>
                </button>
              )}

              {hasReplies && (
                <button
                  onClick={() => setIsExpanded((v) => !v)}
                  className="flex items-center gap-1 text-sm text-[#BDBDBD] hover:text-[#D6AF36] transition-colors"
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  <span>
                    {mirrorback.replies!.length}{" "}
                    {mirrorback.replies!.length === 1 ? "reply" : "replies"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && onReply && (
          <div className="ml-12 mt-3 p-3 bg-black/30 rounded-lg border border-[#232323]">
            <textarea
              placeholder="Share your reflection..."
              className="w-full px-3 py-2 bg-[#0E0E0E] border border-[#232323] rounded-lg text-white text-sm placeholder:text-[#BDBDBD] focus:outline-none focus:border-[#D6AF36] transition-colors resize-none"
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={handleSubmitReply}
                disabled={submittingReply || !replyText.trim()}
                className="px-4 py-2 bg-gradient-to-r from-[#D6AF36] to-[#FFD700] text-black text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submittingReply ? "Posting..." : "Post Mirrorback"}
              </button>
              <button
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyText("");
                }}
                className="px-4 py-2 text-[#BDBDBD] text-sm hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Nested Replies */}
        {hasReplies && isExpanded && (
          <div className="mt-4">
            {mirrorback.replies!.map((reply) => (
              <MirrorbackItem
                key={reply.id}
                mirrorback={reply}
                level={level + 1}
                onToggleAppreciate={onToggleAppreciate}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function MirrorbackThread({
  mirrorbacks,
  level = 0,
  onToggleAppreciate,
  onReply,
}: MirrorbackThreadProps) {
  if (!mirrorbacks || mirrorbacks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {mirrorbacks.map((mirrorback) => (
        <MirrorbackItem
          key={mirrorback.id}
          mirrorback={mirrorback}
          level={level}
          onToggleAppreciate={onToggleAppreciate}
          onReply={onReply}
        />
      ))}
    </div>
  );
}
