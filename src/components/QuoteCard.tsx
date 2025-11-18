import { Quote } from "lucide-react";

export interface QuoteCardProps {
  quote: string | null | undefined;
  author?: string | null;
  /**
   * Optional: For dynamic loading from backend.
   */
  loading?: boolean;

  /**
   * Optional: Triggered when user taps quote (for “new quote” refresh).
   */
  onRefresh?: () => void;
}

export function QuoteCard({
  quote,
  author,
  loading = false,
  onRefresh,
}: QuoteCardProps) {
  // ---- LOADING STATE ----
  if (loading) {
    return (
      <div className="relative bg-gradient-to-br from-[#0E0E0E] to-black border border-[#232323] rounded-[14px] p-8 overflow-hidden animate-pulse">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <Quote size={128} className="text-[#D6AF36]" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="h-4 w-3/4 bg-zinc-700/40 rounded"></div>
          <div className="h-4 w-1/2 bg-zinc-700/40 rounded"></div>
          <div className="h-3 w-1/4 bg-zinc-700/40 rounded mt-6"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D6AF36] to-transparent opacity-30"></div>
      </div>
    );
  }

  // ---- EMPTY STATE ----
  if (!quote) {
    return (
      <div className="relative bg-gradient-to-br from-[#0E0E0E] to-black border border-[#232323] rounded-[14px] p-8 overflow-hidden">
        <div className="relative z-10">
          <p className="text-[#BDBDBD] text-sm italic">
            No quote available.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D6AF36] to-transparent opacity-30"></div>
      </div>
    );
  }

  // ---- REAL QUOTE ----
  return (
    <div
      className={`relative bg-gradient-to-br from-[#0E0E0E] to-black border border-[#232323] rounded-[14px] p-8 overflow-hidden ${
        onRefresh ? "cursor-pointer group" : ""
      }`}
      onClick={() => onRefresh?.()}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity">
        <Quote size={128} className="text-[#D6AF36]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Quote size={32} className="text-[#D6AF36] mb-4" />
        <blockquote className="text-white text-lg italic font-serif leading-relaxed mb-4">
          "{quote}"
        </blockquote>
        {author && <p className="text-[#D6AF36] text-sm">— {author}</p>}
      </div>

      {/* Gold Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D6AF36] to-transparent opacity-30"></div>
    </div>
  );
}
