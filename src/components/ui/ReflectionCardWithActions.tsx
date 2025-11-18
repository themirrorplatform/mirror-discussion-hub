import { ReactionBar } from "./ReactionBar";
import {
  ReflectionActionsIconOnly,
  ReflectionActionsCompact,
  ReflectionActionsDropdown,
} from "./ReflectionCardActions.tsx";

interface ReflectionCardProps {
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  title: string;
  content: string;
  tags: string[];
  timestamp: string;
  reflectCount?: number;
  appreciateCount?: number;
  challengeCount?: number;
  paradox?: string;
  /** If true, shows edit/delete actions */
  isOwner?: boolean;
  /** Which action variant to use */
  actionVariant?: "icon-only" | "compact" | "dropdown";
  onEdit?: () => void;
  onDelete?: () => void;
}

/* ============================================
   VARIANT 1: Icon-Only Actions
   ============================================ */
export function ReflectionCardIconOnly({
  author,
  title,
  content,
  tags,
  timestamp,
  reflectCount = 0,
  appreciateCount = 0,
  challengeCount = 0,
  paradox,
  isOwner = false,
  onEdit,
  onDelete,
}: ReflectionCardProps) {
  return (
    <article className="bg-[#0E0E0E] border border-[#232323] rounded-[14px] p-6 hover:border-[#D6AF36] transition-all duration-200 gold-glow-hover">
      {/* Author Info with Icon-Only Actions */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#D6AF36]">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="text-white">{author.name}</h4>
          <p className="text-sm text-[#BDBDBD]">{author.role}</p>
        </div>
        <span className="text-sm text-[#BDBDBD]">{timestamp}</span>
        {/* Icon-Only Actions - Very subtle */}
        <ReflectionActionsIconOnly
          isOwner={isOwner}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      {/* Content */}
      <h3 className="text-white mb-3">{title}</h3>
      <p className="text-[#BDBDBD] mb-4 line-clamp-3">{content}</p>

      {/* Paradox (if exists) */}
      {paradox && (
        <div className="mb-4 p-4 border-l-2 border-[#D6AF36] bg-black/30 rounded-r-lg">
          <p className="text-[#D6AF36] italic font-serif">{paradox}</p>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-black/50 border border-[#232323] rounded-full text-sm text-[#D6AF36]"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Reactions */}
      <ReactionBar
        reflectCount={reflectCount}
        appreciateCount={appreciateCount}
        challengeCount={challengeCount}
      />
    </article>
  );
}

/* ============================================
   VARIANT 2: Compact Pill Actions
   ============================================ */
export function ReflectionCardCompact({
  author,
  title,
  content,
  tags,
  timestamp,
  reflectCount = 0,
  appreciateCount = 0,
  challengeCount = 0,
  paradox,
  isOwner = false,
  onEdit,
  onDelete,
}: ReflectionCardProps) {
  return (
    <article className="bg-[#0E0E0E] border border-[#232323] rounded-[14px] p-6 hover:border-[#D6AF36] transition-all duration-200 gold-glow-hover">
      {/* Author Info with Compact Actions */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#D6AF36]">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="text-white">{author.name}</h4>
          <p className="text-sm text-[#BDBDBD]">{author.role}</p>
        </div>
        <span className="text-sm text-[#BDBDBD] mr-2">{timestamp}</span>
        {/* Compact Pill Actions */}
        <ReflectionActionsCompact
          isOwner={isOwner}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      {/* Content */}
      <h3 className="text-white mb-3">{title}</h3>
      <p className="text-[#BDBDBD] mb-4 line-clamp-3">{content}</p>

      {/* Paradox (if exists) */}
      {paradox && (
        <div className="mb-4 p-4 border-l-2 border-[#D6AF36] bg-black/30 rounded-r-lg">
          <p className="text-[#D6AF36] italic font-serif">{paradox}</p>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-black/50 border border-[#232323] rounded-full text-sm text-[#D6AF36]"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Reactions */}
      <ReactionBar
        reflectCount={reflectCount}
        appreciateCount={appreciateCount}
        challengeCount={challengeCount}
      />
    </article>
  );
}

/* ============================================
   VARIANT 3: Dropdown Menu Actions
   ============================================ */
export function ReflectionCardDropdown({
  author,
  title,
  content,
  tags,
  timestamp,
  reflectCount = 0,
  appreciateCount = 0,
  challengeCount = 0,
  paradox,
  isOwner = false,
  onEdit,
  onDelete,
}: ReflectionCardProps) {
  return (
    <article className="bg-[#0E0E0E] border border-[#232323] rounded-[14px] p-6 hover:border-[#D6AF36] transition-all duration-200 gold-glow-hover">
      {/* Author Info with Dropdown Actions */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#D6AF36]">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="text-white">{author.name}</h4>
          <p className="text-sm text-[#BDBDBD]">{author.role}</p>
        </div>
        <span className="text-sm text-[#BDBDBD]">{timestamp}</span>
        {/* Dropdown Menu Actions - Most compact */}
        <ReflectionActionsDropdown
          isOwner={isOwner}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      {/* Content */}
      <h3 className="text-white mb-3">{title}</h3>
      <p className="text-[#BDBDBD] mb-4 line-clamp-3">{content}</p>

      {/* Paradox (if exists) */}
      {paradox && (
        <div className="mb-4 p-4 border-l-2 border-[#D6AF36] bg-black/30 rounded-r-lg">
          <p className="text-[#D6AF36] italic font-serif">{paradox}</p>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-black/50 border border-[#232323] rounded-full text-sm text-[#D6AF36]"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Reactions */}
      <ReactionBar
        reflectCount={reflectCount}
        appreciateCount={appreciateCount}
        challengeCount={challengeCount}
      />
    </article>
  );
}

/* ============================================
   UNIFIED: Dynamic Variant Selection
   ============================================ */
export function ReflectionCardWithActions(props: ReflectionCardProps) {
  const { actionVariant = "dropdown" } = props;

  switch (actionVariant) {
    case "icon-only":
      return <ReflectionCardIconOnly {...props} />;
    case "compact":
      return <ReflectionCardCompact {...props} />;
    case "dropdown":
      return <ReflectionCardDropdown {...props} />;
    default:
      return <ReflectionCardDropdown {...props} />;
  }
}
