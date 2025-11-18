// src/components/WishlistCard.tsx
import {
  ArrowUp,
  CheckCircle2,
  Clock,
  Lightbulb,
  Trash2,
} from "lucide-react";
import { useState, type ComponentType } from "react";

export type WishlistStatus = "newest" | "top-echoed" | "implemented";

export interface WishlistCardProps {
  id?: number;

  title: string;
  description: string;

  author: {
    name: string;
    avatar: string;
  };

  echoes: number;
  status?: string;
  timestamp: string;

  hasEchoedInitial?: boolean;

  onToggleEcho?: (payload: {
    id?: number;
    nextHasEchoed: boolean;
    nextEchoes: number;
  }) => void;

  /** 🔥 NEW: delete support */
  canDelete?: boolean;
  onDelete?: (id?: number) => void;
}

/* ---------- Status Config ---------- */
const STATUS_CONFIG: Record<
  WishlistStatus,
  {
    icon: ComponentType<{ size?: number }>;
    label: string;
    color: string;
  }
> = {
  newest: {
    icon: Clock,
    label: "New",
    color: "text-blue-400",
  },
  "top-echoed": {
    icon: Lightbulb,
    label: "Top Echoed",
    color: "text-[#D6AF36]",
  },
  implemented: {
    icon: CheckCircle2,
    label: "Implemented",
    color: "text-green-400",
  },
};

export function WishlistCard({
  id,
  title,
  description,
  author,
  echoes: initialEchoes,
  status: rawStatus,
  timestamp,
  hasEchoedInitial = false,
  onToggleEcho,
  canDelete = false,
  onDelete,
}: WishlistCardProps) {
  /* ---------- States ---------- */
  const [echoes, setEchoes] = useState(initialEchoes);
  const [hasEchoed, setHasEchoed] = useState(hasEchoedInitial);
  const [deleting, setDeleting] = useState(false);

  /* ---------- Safe status parsing ---------- */
  let status: WishlistStatus = "newest";
  if (rawStatus === "top-echoed" || rawStatus === "implemented") {
    status = rawStatus;
  }

  const config = STATUS_CONFIG[status];
  const StatusIcon = config.icon;

  /* ---------- Echo logic ---------- */
  const handleEcho = () => {
    const nextHasEchoed = !hasEchoed;
    const nextEchoes = nextHasEchoed
      ? echoes + 1
      : Math.max(0, echoes - 1);

    setHasEchoed(nextHasEchoed);
    setEchoes(nextEchoes);

    onToggleEcho?.({ id, nextHasEchoed, nextEchoes });
  };

  /* ---------- Delete logic ---------- */
  const handleDelete = async () => {
    if (!onDelete || !id) return;

    if (!window.confirm("Delete this wishlist? This cannot be undone.")) {
      return;
    }

    setDeleting(true);
    await onDelete(id);
    setDeleting(false);
  };

  /* -------------------------------------------------- */

  return (
    <article className="bg-[#0E0E0E] border border-[#232323] rounded-[14px] p-6 hover:border-[#D6AF36] transition-all duration-200 gold-glow-hover">
      <div className="flex gap-4">
        {/* Echo Column */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleEcho}
            className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
              hasEchoed
                ? "bg-[#D6AF36] border-[#D6AF36] text-black"
                : "bg-black border-[#232323] text-[#BDBDBD] hover:border-[#D6AF36]"
            }`}
            type="button"
          >
            <ArrowUp size={20} />
          </button>

          <span
            className={`text-sm ${
              hasEchoed ? "text-[#D6AF36]" : "text-[#BDBDBD]"
            }`}
          >
            {echoes}
          </span>
        </div>

        {/* Main Body */}
        <div className="flex-1 min-w-0">
          {/* Status, Timestamp, Delete */}
          <div className="flex items-center justify-between mb-3 gap-4">
            <div className={`flex items-center gap-2 ${config.color}`}>
              <StatusIcon size={16} />
              <span className="text-sm">{config.label}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-[#BDBDBD] whitespace-nowrap">
                {timestamp}
              </span>

              {/* 🔥 DELETE BUTTON — ALWAYS VISIBLE FOR OWNER/ADMIN */}
              {canDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="
                    inline-flex items-center gap-1 px-3 py-1 text-[11px]
                    rounded-full border border-[#3C1B1B]
                    text-[#FCA5A5]
                    hover:border-red-500 hover:text-red-300
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-colors
                  "
                >
                  <Trash2 size={14} />
                  <span>{deleting ? "Deleting…" : "Delete"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Title + Description */}
          <h3 className="text-white mb-2">{title}</h3>
          <p className="text-[#BDBDBD] mb-4">{description}</p>

          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-[#BDBDBD]">{author.name}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
