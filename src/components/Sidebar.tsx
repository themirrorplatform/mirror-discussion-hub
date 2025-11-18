import { CheckCircle2, Circle } from "lucide-react";
import type { MouseEvent } from "react";

/* ---------- START HERE WIDGET ---------- */

export interface StartHereItem {
  key: string; // stable key (can match checklist_items.item_key)
  label: string;
  done: boolean;
}

const DEFAULT_STEPS: StartHereItem[] = [
  { key: "complete_profile", label: "Complete your profile", done: true },
  { key: "first_reflection", label: "Share your first reflection", done: true },
  { key: "appreciate_three", label: "Appreciate 3 reflections", done: false },
  { key: "join_circle", label: "Join a Reflection Circle", done: false },
  { key: "add_wishlist", label: "Add a wishlist item", done: false },
];

interface StartHereWidgetProps {
  /**
   * Optional list of steps. If omitted, uses DEFAULT_STEPS.
   * Later you can map this directly from Supabase checklist_items + checklist_progress.
   */
  items?: StartHereItem[];

  /** Loading skeleton for when checklist is being fetched. */
  loading?: boolean;

  /**
   * Optional handler when a step is clicked.
   * Hook this up to Checklist.setDone() later.
   */
  onToggleItem?: (item: StartHereItem) => void;
}

export function StartHereWidget({
  items,
  loading = false,
  onToggleItem,
}: StartHereWidgetProps) {
  const steps = items ?? DEFAULT_STEPS;

  if (loading) {
    return (
      <div className="bg-[#0E0E0E] border border-[#232323] rounded-[14px] p-6 animate-pulse">
        <div className="h-4 w-1/3 bg-zinc-700/40 rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-zinc-700/40" />
              <div className="h-3 w-3/4 bg-zinc-700/40 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0E0E0E] border border-[#232323] rounded-[14px] p-6">
      <h3 className="text-white mb-4">Start Here</h3>
      <div className="space-y-3">
        {steps.map((step) => {
          const content = (
            <>
              {step.done ? (
                <CheckCircle2
                  size={20}
                  className="text-[#D6AF36] flex-shrink-0"
                />
              ) : (
                <Circle
                  size={20}
                  className="text-[#BDBDBD] flex-shrink-0"
                />
              )}
              <span
                className={`text-sm ${
                  step.done
                    ? "text-[#BDBDBD] line-through"
                    : "text-white"
                }`}
              >
                {step.label}
              </span>
            </>
          );

          if (!onToggleItem) {
            return (
              <div key={step.key} className="flex items-center gap-3">
                {content}
              </div>
            );
          }

          return (
            <button
              key={step.key}
              type="button"
              onClick={() => onToggleItem(step)}
              className="flex items-center gap-3 w-full text-left hover:bg-black/30 rounded-lg px-2 py-1 transition-colors"
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- PRINCIPLES WIDGET ---------- */

const DEFAULT_PRINCIPLES = [
  "Reflection before reaction.",
  "Curiosity over certainty.",
  "Contradiction ≠ conflict.",
  "Speak honestly. Read deeply.",
  "Every voice is a mirror.",
];

interface PrinciplesWidgetProps {
  /**
   * Optional custom list of principles.
   * If not provided, defaults to the core Mirror principles.
   */
  principles?: string[];

  /** Show loading skeleton while fetching from backend. */
  loading?: boolean;

  /**
   * Optional click handler when a principle is clicked.
   * Useful for opening a “learn more” modal or filtering reflections.
   */
  onSelectPrinciple?: (principle: string, index: number) => void;
}

export function PrinciplesWidget({
  principles = DEFAULT_PRINCIPLES,
  loading = false,
  onSelectPrinciple,
}: PrinciplesWidgetProps) {
  if (loading) {
    return (
      <div className="bg-[#0E0E0E] border border-[#232323] rounded-[14px] p-6 animate-pulse">
        <div className="h-4 w-1/2 bg-zinc-700/40 rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="h-4 w-4 bg-zinc-700/40 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 bg-zinc-700/40 rounded" />
                <div className="h-3 w-1/2 bg-zinc-700/40 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!principles.length) {
    return (
      <div className="bg-[#0E0E0E] border border-[#232323] rounded-[14px] p-6">
        <h3 className="text-white mb-2">Principles of Reflection</h3>
        <p className="text-sm text-[#BDBDBD]">
          No principles configured yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0E0E0E] border border-[#232323] rounded-[14px] p-6">
      <h3 className="text-white mb-4">Principles of Reflection</h3>
      <div className="space-y-3">
        {principles.map((principle, index) => {
          const handleClick = (e: MouseEvent) => {
            e.preventDefault();
            onSelectPrinciple?.(principle, index);
          };

          const Wrapper: React.ElementType = onSelectPrinciple ? "button" : "div";

          return (
            <Wrapper
              key={index}
              onClick={onSelectPrinciple ? handleClick : undefined}
              className={`flex items-start gap-3 ${
                onSelectPrinciple
                  ? "w-full text-left hover:bg-black/30 rounded-lg px-2 py-1 transition-colors"
                  : ""
              }`}
            >
              <span className="text-[#D6AF36] flex-shrink-0">
                {index + 1}.
              </span>
              <p className="text-sm text-[#BDBDBD] italic font-serif">
                {principle}
              </p>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- TOP VOICES WIDGET ---------- */

export interface TopVoice {
  id?: string; // can match profiles.id
  name: string;
  avatar: string;
  role: string;
  score?: number; // optional reflection score from leaderboard
}

interface TopVoicesWidgetProps {
  voices: TopVoice[];
  /** Loading state while fetching leaderboard from backend. */
  loading?: boolean;

  /**
   * Click handler when a voice is clicked.
   * Useful for navigating to /profile/:id or opening a profile modal.
   */
  onSelectVoice?: (voice: TopVoice) => void;
}

export function TopVoicesWidget({
  voices,
  loading = false,
  onSelectVoice,
}: TopVoicesWidgetProps) {
  if (loading) {
    return (
      <div className="bg-[#0E0E0E] border border-[#232323] rounded-[14px] p-6">
        <h3 className="text-white mb-4">Top Voices</h3>
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-700/40" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/2 bg-zinc-700/40 rounded" />
                <div className="h-3 w-1/3 bg-zinc-700/40 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!voices || voices.length === 0) {
    return (
      <div className="bg-[#0E0E0E] border border-[#232323] rounded-[14px] p-6">
        <h3 className="text-white mb-2">Top Voices</h3>
        <p className="text-sm text-[#BDBDBD]">
          No voices have risen yet. Your reflections can be the first.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0E0E0E] border border-[#232323] rounded-[14px] p-6">
      <h3 className="text-white mb-4">Top Voices</h3>
      <div className="space-y-3">
        {voices.map((voice, index) => {
          const Wrapper: React.ElementType = onSelectVoice ? "button" : "div";

          return (
            <Wrapper
              key={voice.id ?? index}
              onClick={onSelectVoice ? () => onSelectVoice(voice) : undefined}
              className={`flex items-center gap-3 ${
                onSelectVoice
                  ? "w-full text-left hover:bg-black/30 rounded-lg px-2 py-1 transition-colors"
                  : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#D6AF36] bg-black">
                <img
                  src={voice.avatar}
                  alt={voice.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-white text-sm">{voice.name}</h4>
                <p className="text-xs text-[#BDBDBD]">{voice.role}</p>
                {typeof voice.score === "number" && (
                  <p className="text-[11px] text-[#D6AF36] mt-0.5">
                    {voice.score.toLocaleString()} reflection score
                  </p>
                )}
              </div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
