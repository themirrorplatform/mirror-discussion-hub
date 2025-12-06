import { useState } from "react";
import { Reactions } from "../lib/mirrorApi";
import {
  MessageCircle,
  Heart,
  Zap,
  Bookmark,
} from "lucide-react";

type ReactionKind = "reflect" | "appreciate" | "challenge" | "save";

interface ReactionBarProps {
  // backend wiring – optional for now so UI still works
  reflectionId?: number;
  currentUserId?: string;

  // counts coming from Supabase / App
  reflectCount?: number;
  appreciateCount?: number;
  challengeCount?: number;
  savedCount?: number;

  // Initial user reactions state (from database)
  userReactions?: {
    reflect: boolean;
    appreciate: boolean;
    challenge: boolean;
    save: boolean;
  };
}

export function ReactionBar({
  reflectionId,
  currentUserId,
  reflectCount = 0,
  appreciateCount = 0,
  challengeCount = 0,
  savedCount = 0,
  userReactions,
}: ReactionBarProps) {
  const [counts, setCounts] = useState({
    reflect: reflectCount,
    appreciate: appreciateCount,
    challenge: challengeCount,
    save: savedCount,
  });

  // whether *this* user has toggled each reaction
  const [active, setActive] = useState<Record<ReactionKind, boolean>>(
    userReactions ?? {
      reflect: false,
      appreciate: false,
      challenge: false,
      save: false,
    }
  );

  const [busyKind, setBusyKind] = useState<ReactionKind | null>(null);

  const isInteractive = Boolean(reflectionId && currentUserId);

  async function toggle(kind: ReactionKind) {
    if (!isInteractive || !reflectionId || !currentUserId) {
      return;
    }
    if (busyKind) return;

    setBusyKind(kind);

    const currentlyOn = active[kind];

    try {
      if (currentlyOn) {
        // turn OFF
        await Reactions.remove(reflectionId, currentUserId, kind);
        setCounts((prev) => ({
          ...prev,
          [kind]: Math.max(0, prev[kind] - 1),
        }));
      } else {
        // turn ON
        await Reactions.add(reflectionId, currentUserId, kind);
        setCounts((prev) => ({
          ...prev,
          [kind]: prev[kind] + 1,
        }));
      }

      setActive((prev) => ({ ...prev, [kind]: !currentlyOn }));
    } catch (err) {
      console.error("Error toggling reaction", kind, err);
      // soft-fail: leave UI as-is
    } finally {
      setBusyKind(null);
    }
  }

  const baseBtn =
    "flex items-center gap-1 text-xs text-[#BDBDBD] hover:text-white transition-colors";

  function btnClasses(kind: ReactionKind) {
    const simpleActive = active[kind];
    return (
      baseBtn +
      (simpleActive ? " text-[#D6AF36]" : "") +
      (!isInteractive ? " cursor-default opacity-70" : " cursor-pointer")
    );
  }

  return (
    <div className="flex items-center justify-between text-xs mt-2">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className={btnClasses("reflect")}
          onClick={() => toggle("reflect")}
          disabled={busyKind === "reflect" || !isInteractive}
        >
          <MessageCircle size={16} />
          <span>{counts.reflect}</span>
        </button>

        <button
          type="button"
          className={btnClasses("appreciate")}
          onClick={() => toggle("appreciate")}
          disabled={busyKind === "appreciate" || !isInteractive}
        >
          <Heart size={16} />
          <span>{counts.appreciate}</span>
        </button>

        <button
          type="button"
          className={btnClasses("challenge")}
          onClick={() => toggle("challenge")}
          disabled={busyKind === "challenge" || !isInteractive}
        >
          <Zap size={16} />
          <span>{counts.challenge}</span>
        </button>
      </div>

      <button
        type="button"
        className={btnClasses("save")}
        onClick={() => toggle("save")}
        disabled={busyKind === "save" || !isInteractive}
      >
        <Bookmark size={16} />
        <span>{counts.save}</span>
      </button>
    </div>
  );
}
