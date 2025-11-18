import { Play } from "lucide-react";
import { ReactionBar } from "./ReactionBar";

interface VideoAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface VideoCardProps {
  /** Optional id so you can link to the underlying reflection/video row */
  id?: string | number;

  author: VideoAuthor;
  title: string;
  thumbnail: string;

  /** Duration text like "12:34" */
  duration?: string;
  /** Human-readable timestamp like "3 hours ago" */
  timestamp: string;

  /** Optional video URL from Supabase (YouTube / Vimeo / mp4, etc.) */
  videoUrl?: string | null;

  reflectCount?: number;
  appreciateCount?: number;
  challengeCount?: number;

  /**
   * Optional handler when the thumbnail is clicked.
   * If not provided but videoUrl exists, we’ll open videoUrl in a new tab.
   */
  onOpen?: (payload: {
    id?: string | number;
    title: string;
    videoUrl?: string | null;
    author: VideoAuthor;
  }) => void;
}

export function VideoCard({
  id,
  author,
  title,
  thumbnail,
  duration,
  timestamp,
  videoUrl,
  reflectCount = 0,
  appreciateCount = 0,
  challengeCount = 0,
  onOpen,
}: VideoCardProps) {
  function handleOpen() {
    if (onOpen) {
      onOpen({ id, title, videoUrl, author });
      return;
    }

    if (videoUrl) {
      window.open(videoUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <article className="bg-[#0E0E0E] border border-[#232323] rounded-[14px] overflow-hidden hover:border-[#D6AF36] transition-all duration-200 gold-glow-hover">
      {/* Video Thumbnail */}
      <button
        type="button"
        onClick={handleOpen}
        className="relative aspect-video bg-black group cursor-pointer w-full"
      >
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-200 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#D6AF36] flex items-center justify-center group-hover:scale-110 transition-all duration-200">
            <Play size={28} className="text-black ml-1" fill="black" />
          </div>
        </div>
        {duration && (
          <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-sm rounded">
            {duration}
          </span>
        )}
      </button>

      {/* Content */}
      <div className="p-6">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#D6AF36]">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-white text-sm">{author.name}</h4>
            <p className="text-xs text-[#BDBDBD]">{author.role}</p>
          </div>
          <span className="ml-auto text-sm text-[#BDBDBD]">{timestamp}</span>
        </div>

        <h3 className="text-white mb-4 line-clamp-2">{title}</h3>

        {/* Reactions */}
        <ReactionBar
          reflectCount={reflectCount}
          appreciateCount={appreciateCount}
          challengeCount={challengeCount}
        />
      </div>
    </article>
  );
}
