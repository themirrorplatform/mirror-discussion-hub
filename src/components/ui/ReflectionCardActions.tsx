import { Edit2, Trash2, MoreHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ReflectionCardActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  /** Show actions only if user is the owner */
  isOwner?: boolean;
}

/* ============================================
   VARIANT 1: Icon-only (Minimal)
   ============================================ */
export function ReflectionActionsIconOnly({
  onEdit,
  onDelete,
  isOwner = false,
}: ReflectionCardActionsProps) {
  if (!isOwner) return null;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onEdit}
        className="w-7 h-7 rounded-full flex items-center justify-center text-[#666] hover:text-[#D6AF36] hover:bg-[#D6AF36]/10 transition-all duration-200"
        aria-label="Edit reflection"
        type="button"
      >
        <Edit2 size={14} />
      </button>
      <button
        onClick={onDelete}
        className="w-7 h-7 rounded-full flex items-center justify-center text-[#666] hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
        aria-label="Delete reflection"
        type="button"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

/* ============================================
   VARIANT 2: Icon + Text (Compact Pills)
   ============================================ */
export function ReflectionActionsCompact({
  onEdit,
  onDelete,
  isOwner = false,
}: ReflectionCardActionsProps) {
  if (!isOwner) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/20 border border-[#232323] text-[#666] hover:text-[#D6AF36] hover:border-[#D6AF36] transition-all duration-200 group"
        type="button"
      >
        <Edit2 size={12} className="group-hover:scale-110 transition-transform duration-200" />
        <span className="text-[10px]">Edit</span>
      </button>
      <button
        onClick={onDelete}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/20 border border-[#232323] text-[#666] hover:text-red-400 hover:border-red-400/50 transition-all duration-200 group"
        type="button"
      >
        <Trash2 size={12} className="group-hover:scale-110 transition-transform duration-200" />
        <span className="text-[10px]">Delete</span>
      </button>
    </div>
  );
}

/* ============================================
   VARIANT 3: Contextual Dropdown Menu
   ============================================ */
export function ReflectionActionsDropdown({
  onEdit,
  onDelete,
  isOwner = false,
}: ReflectionCardActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (!isOwner) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
          isOpen
            ? "bg-[#D6AF36]/10 text-[#D6AF36] border border-[#D6AF36]/30"
            : "text-[#666] hover:text-[#D6AF36] hover:bg-[#D6AF36]/10"
        }`}
        aria-label="More actions"
        type="button"
      >
        <MoreHorizontal size={16} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-[#0E0E0E] border border-[#232323] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.8)] overflow-hidden z-10">
          {/* Gold glint */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#D6AF36] to-transparent opacity-50" />

          <button
            onClick={() => {
              onEdit?.();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[#BDBDBD] hover:text-white hover:bg-[#D6AF36]/10 transition-all duration-200 group"
            type="button"
          >
            <Edit2 size={14} className="text-[#666] group-hover:text-[#D6AF36] transition-colors duration-200" />
            <span className="text-sm">Edit</span>
          </button>

          <div className="h-[1px] bg-[#232323] mx-2" />

          <button
            onClick={() => {
              onDelete?.();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[#BDBDBD] hover:text-white hover:bg-red-400/10 transition-all duration-200 group"
            type="button"
          >
            <Trash2 size={14} className="text-[#666] group-hover:text-red-400 transition-colors duration-200" />
            <span className="text-sm">Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}
