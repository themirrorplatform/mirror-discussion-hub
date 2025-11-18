interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  role: string;
}

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardCard({ entries }: LeaderboardCardProps) {
  return (
    <section className="bg-[#0E0E0E] border border-[#232323] rounded-2xl p-5 space-y-4">
      <h3 className="text-white text-base">Most Reflective Voices of the Week</h3>

      <div className="space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.rank}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src={entry.avatar}
                  alt={entry.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-white text-sm">{entry.name}</span>
                  <span className="text-[10px] text-yellow-400 uppercase">
                    {entry.role}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Rank #{entry.rank}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-yellow-400 font-semibold text-sm">
                {entry.xp.toLocaleString()} XP
              </div>
              <div className="text-[10px] text-zinc-500">Reflective score</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
