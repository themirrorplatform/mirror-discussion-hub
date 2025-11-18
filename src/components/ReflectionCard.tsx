// src/components/ReflectionCard.tsx
import { ReactionBar } from "./ReactionBar";
import { ReflectionDiscussion } from "./ReflectionDiscussion";
import {
  ReflectionActionsIconOnly,
  ReflectionActionsCompact,
  ReflectionActionsDropdown,
} from "./ui/ReflectionCardActions";

// 🔹 What App will pass into ReflectionCard
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

  /** Full Supabase user object (used by ReflectionDiscussion) */
  user: any | null;

  /** Permission flags decided in App.tsx */
  canEdit?: boolean;
  canDelete?: boolean;

  /** Which action UI to use */
  actionVariant?: "icon-only" | "compact" | "dropdown";

  /** Optional callbacks */
  onDelete?: (reflectionId: number) => void;
  onEdit?: (reflectionId: number) => void;
}

/* ---------- Helpers ---------- */

function formatRelative(dateString?: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSeconds < 60) return "just now";
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
}

/** Small helper that chooses which actions UI to render */
function HeaderActions({
  id,
  canEdit,
  canDelete,
  actionVariant = "dropdown",
  onEdit,
  onDelete,
}: {
  id: number;
  canEdit?: boolean;
  canDelete?: boolean;
  actionVariant?: "icon-only" | "compact" | "dropdown";
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}) {
  const isOwner = !!canEdit || !!canDelete;
  if (!isOwner) return null;

  const handleEdit = onEdit ? () => onEdit(id) : undefined;

  const handleDelete =
    onDelete &&
    (() => {
      if (
        window.confirm("Delete this reflection? This cannot be undone.")
      ) {
        onDelete(id);
      }
    });

  const commonProps = {
    isOwner: true,
    onEdit: handleEdit,
    onDelete: handleDelete,
  };

  switch (actionVariant) {
    case "icon-only":
      return <ReflectionActionsIconOnly {...commonProps} />;
    case "compact":
      return <ReflectionActionsCompact {...commonProps} />;
    case "dropdown":
    default:
      return <ReflectionActionsDropdown {...commonProps} />;
  }
}

/* ---------- Main component ---------- */

export function ReflectionCard(props: ReflectionCardProps) {
  const {
    id,
    author,
    title,
    content,
    tags,
    timestamp,
    created_at,
    reflectCount = 0,
    appreciateCount = 0,
    challengeCount = 0,
    paradox,
    user,
    canEdit,
    canDelete,
    actionVariant = "compact", // default look
    onEdit,
    onDelete,
  } = props;

  const safeTags = Array.isArray(tags) ? tags : [];
  const rawTimestamp = timestamp || created_at;
  const displayTimestamp = formatRelative(rawTimestamp);

  return (
    <article className="bg-[#0E0E0E] border border-[#232323] rounded-[14px] p-6 hover:border-[#D6AF36] transition-all duration-200 gold-glow-hover">
      {/* Header: avatar, name, time, actions */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#D6AF36] flex-shrink-0">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-white text-sm font-medium truncate">
              {author.name}
            </h4>
            <span className="text-xs text-[#D6AF36]">{author.role}</span>
          </div>
          {displayTimestamp && (
            <p className="text-[11px] text-[#8A8A8A] mt-0.5">
              {displayTimestamp}
            </p>
          )}
        </div>

        <HeaderActions
          id={id}
          canEdit={canEdit}
          canDelete={canDelete}
          actionVariant={actionVariant}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      {/* Content */}
      <h3 className="text-white mb-3">{title}</h3>
      <p className="text-[#BDBDBD] mb-4 whitespace-pre-wrap">{content}</p>

      {/* Paradox (if exists) */}
      {paradox && (
        <div className="mb-4 p-4 border-l-2 border-[#D6AF36] bg-black/30 rounded-r-lg">
          <p className="text-[#D6AF36] italic font-serif">{paradox}</p>
        </div>
      )}

      {/* Tags */}
      {safeTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {safeTags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-black/50 border border-[#232323] rounded-full text-sm text-[#D6AF36]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Reactions */}
      <ReactionBar
        reflectCount={reflectCount}
        appreciateCount={appreciateCount}
        challengeCount={challengeCount}
      />

      {/* Discussion section */}
      <div className="mt-4 pt-4 border-t border-[#232323]">
        <ReflectionDiscussion reflectionId={id} user={user} />
      </div>
    </article>
  );
}
