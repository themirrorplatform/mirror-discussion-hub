import { X } from "lucide-react";
import { useState } from "react";
import { validateTitle, validateContent, validateVideoUrl, sanitizeTags } from "../lib/sanitize";

interface ComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: {
    title: string;
    content: string;
    tags?: string[];
    quote?: string | null;
    video_url?: string | null;
  }) => Promise<void> | void;
}

export function ComposerModal({ isOpen, onClose, onSubmit }: ComposerModalProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [paradox, setParadox] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate title
    const titleValidation = validateTitle(title);
    if (!titleValidation.isValid) {
      setError(titleValidation.error || "Invalid title");
      setLoading(false);
      return;
    }

    // Validate content
    const contentValidation = validateContent(body);
    if (!contentValidation.isValid) {
      setError(contentValidation.error || "Invalid content");
      setLoading(false);
      return;
    }

    // Validate video URL if provided
    const videoValidation = validateVideoUrl(videoUrl);
    if (!videoValidation.isValid) {
      setError(videoValidation.error || "Invalid video URL");
      setLoading(false);
      return;
    }

    // Validate and sanitize tags
    const tagArray = sanitizeTags(
      tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
    );

    // Validate quote length if provided
    if (paradox && paradox.trim().length > 500) {
      setError("Quote must be 500 characters or less");
      setLoading(false);
      return;
    }

    try {
      await onSubmit({
        title: titleValidation.sanitized,
        content: contentValidation.sanitized,
        tags: tagArray,
        quote: paradox.trim() || null,
        video_url: videoValidation.sanitized || null,
      });

      // reset
      setTitle("");
      setBody("");
      setTags("");
      setParadox("");
      setVideoUrl("");
      setError("");

      onClose();
    } catch (err) {
      setError("Failed to create reflection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 glass-blur"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#0E0E0E] border border-[#232323] rounded-[24px] p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white">Share a Reflection</h2>
          <button
            onClick={onClose}
            className="text-[#BDBDBD] hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm text-[#BDBDBD] mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-4 py-3 bg-black border border-[#232323] rounded-lg text-white placeholder:text-[#BDBDBD] focus:outline-none focus:border-[#D6AF36] transition-colors"
              required
            />
          </div>

          {/* Body */}
          <div>
            <label htmlFor="body" className="block text-sm text-[#BDBDBD] mb-2">
              Your Reflection
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your thoughts, questions, or insights..."
              rows={6}
              className="w-full px-4 py-3 bg-black border border-[#232323] rounded-lg text-white placeholder:text-[#BDBDBD] focus:outline-none focus:border-[#D6AF36] transition-colors resize-none"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm text-[#BDBDBD] mb-2">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="philosophy, consciousness, society"
              className="w-full px-4 py-3 bg-black border border-[#232323] rounded-lg text-white placeholder:text-[#BDBDBD] focus:outline-none focus:border-[#D6AF36] transition-colors"
            />
          </div>

          {/* Paradox (Optional) */}
          <div>
            <label htmlFor="paradox" className="block text-sm text-[#BDBDBD] mb-2">
              Optional Paradox
            </label>
            <input
              id="paradox"
              type="text"
              value={paradox}
              onChange={(e) => setParadox(e.target.value)}
              placeholder="A thought-provoking contradiction..."
              className="w-full px-4 py-3 bg-black border border-[#232323] rounded-lg text-white placeholder:text-[#BDBDBD] focus:outline-none focus:border-[#D6AF36] transition-colors"
            />
          </div>

          {/* Video URL (Optional) */}
          <div>
            <label htmlFor="videoUrl" className="block text-sm text-[#BDBDBD] mb-2">
              Optional Video URL
            </label>
            <input
              id="videoUrl"
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/..."
              className="w-full px-4 py-3 bg-black border border-[#232323] rounded-lg text-white placeholder:text-[#BDBDBD] focus:outline-none focus:border-[#D6AF36] transition-colors"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#D6AF36] to-[#FFD700] text-black rounded-lg hover:opacity-90 transition-all duration-200 hover:scale-[1.02] shadow-[0_6px_20px_rgba(214,175,54,0.3)] disabled:opacity-60"
          >
            {loading ? "Posting…" : "Share Reflection"}
          </button>
        </form>
      </div>
    </div>
  );
}

