import { X, Lightbulb, Sparkles } from "lucide-react";
import { useState } from "react";

interface WishlistComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (wishlist: {
    title: string;
    description: string;
    category: string;
    reasoning?: string;
  }) => void;
}

export function WishlistComposer({ isOpen, onClose, onSubmit }: WishlistComposerProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [reasoning, setReasoning] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const wishlistData = {
      title,
      description,
      category,
      reasoning: reasoning || undefined,
    };

    // Handle submission
    console.log("Wishlist submitted:", wishlistData);
    onSubmit?.(wishlistData);
    
    // Reset form
    setTitle("");
    setDescription("");
    setCategory("");
    setReasoning("");
    
    onClose();
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
        {/* Gold glint strip */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#D6AF36] to-transparent opacity-70" />

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D6AF36]/20 to-transparent border border-[#D6AF36]/30 flex items-center justify-center">
              <Lightbulb size={20} className="text-[#D6AF36]" />
            </div>
            <div>
              <h2 className="text-white">Share a Wishlist</h2>
              <p className="text-sm text-[#BDBDBD]">
                Propose a feature the community can echo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#BDBDBD] hover:text-white transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="wishlist-title" className="block text-sm text-[#BDBDBD] mb-2">
              Wishlist Title
            </label>
            <input
              id="wishlist-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What feature would you love to see?"
              className="w-full px-4 py-3 bg-black border border-[#232323] rounded-lg text-white placeholder:text-[#666] focus:outline-none focus:border-[#D6AF36] transition-colors duration-200"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="wishlist-description" className="block text-sm text-[#BDBDBD] mb-2">
              Detailed Description
            </label>
            <textarea
              id="wishlist-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the feature, how it would work, and the value it would bring to The Mirror community..."
              rows={6}
              className="w-full px-4 py-3 bg-black border border-[#232323] rounded-lg text-white placeholder:text-[#666] focus:outline-none focus:border-[#D6AF36] transition-colors duration-200 resize-none"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="wishlist-category" className="block text-sm text-[#BDBDBD] mb-2">
              Category
            </label>
            <select
              id="wishlist-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-[#232323] rounded-lg text-white focus:outline-none focus:border-[#D6AF36] transition-colors duration-200"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="discussion">Discussion Features</option>
              <option value="community">Community Tools</option>
              <option value="content">Content Creation</option>
              <option value="gamification">XP & Gamification</option>
              <option value="ui-ux">Interface & Design</option>
              <option value="mobile">Mobile Experience</option>
              <option value="moderation">Moderation & Safety</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Reasoning (Optional) */}
          <div>
            <label htmlFor="wishlist-reasoning" className="block text-sm text-[#BDBDBD] mb-2">
              Why This Matters (Optional)
            </label>
            <textarea
              id="wishlist-reasoning"
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="Share the deeper reason why this feature would be transformative for The Mirror..."
              rows={3}
              className="w-full px-4 py-3 bg-black border border-[#232323] rounded-lg text-white placeholder:text-[#666] focus:outline-none focus:border-[#D6AF36] transition-colors duration-200 resize-none"
            />
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-3 p-4 bg-[#D6AF36]/5 border border-[#D6AF36]/20 rounded-lg">
            <Sparkles size={18} className="text-[#D6AF36] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-white mb-1">Community-Driven Features</p>
              <p className="text-xs text-[#BDBDBD]">
                Once submitted, other members can echo your wishlist to show support. 
                Top-echoed items help prioritize what The Mirror builds next.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-[#D6AF36] to-[#FFD700] text-black rounded-lg hover:opacity-90 transition-all duration-200 hover:scale-[1.02] shadow-[0_6px_20px_rgba(214,175,54,0.3)] flex items-center justify-center gap-2"
          >
            <Lightbulb size={20} />
            Submit Wishlist
          </button>
        </form>
      </div>
    </div>
  );
}