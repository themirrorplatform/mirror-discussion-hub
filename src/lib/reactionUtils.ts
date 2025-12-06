// src/lib/reactionUtils.ts
// Utility functions for aggregating and managing reactions

import type { Reaction, ReactionCounts, UserReactions } from '../types';

/**
 * Aggregate reactions into counts by kind
 */
export function aggregateReactionCounts(reactions: Reaction[]): ReactionCounts {
  const counts: ReactionCounts = {
    reflect: 0,
    appreciate: 0,
    challenge: 0,
    save: 0,
  };

  for (const reaction of reactions) {
    if (reaction.kind in counts) {
      counts[reaction.kind]++;
    }
  }

  return counts;
}

/**
 * Check which reactions the current user has made
 */
export function getUserReactions(
  reactions: Reaction[],
  userId: string | null
): UserReactions {
  if (!userId) {
    return {
      reflect: false,
      appreciate: false,
      challenge: false,
      save: false,
    };
  }

  const userReactions = reactions.filter((r) => r.user_id === userId);

  return {
    reflect: userReactions.some((r) => r.kind === 'reflect'),
    appreciate: userReactions.some((r) => r.kind === 'appreciate'),
    challenge: userReactions.some((r) => r.kind === 'challenge'),
    save: userReactions.some((r) => r.kind === 'save'),
  };
}

/**
 * Merge reflection data with reaction counts
 */
export function mergeReactionsWithReflections(
  reflections: any[],
  allReactions: Reaction[],
  currentUserId: string | null
) {
  return reflections.map((reflection) => {
    // Get reactions for this reflection
    const reflectionReactions = allReactions.filter(
      (r) => r.reflection_id === reflection.id
    );

    const counts = aggregateReactionCounts(reflectionReactions);
    const userReactions = getUserReactions(reflectionReactions, currentUserId);

    return {
      ...reflection,
      reflectCount: counts.reflect,
      appreciateCount: counts.appreciate,
      challengeCount: counts.challenge,
      savedCount: counts.save,
      userReactions,
    };
  });
}
