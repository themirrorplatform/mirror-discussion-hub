import { Calendar, Clock, Users } from "lucide-react";

interface EventCardProps {
  id: string; // important for Supabase lookups later
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  attendees: number;

  /** Whether the current user is attending */
  isAttending?: boolean;

  /** Callback for when user toggles join/leave */
  onToggleAttend?: (eventId: string) => void;
}

export function EventCard({
  id,
  title,
  description,
  image,
  date,
  time,
  attendees,
  isAttending = false,
  onToggleAttend,
}: EventCardProps) {
  return (
    <article className="bg-[#0E0E0E] border border-[#232323] rounded-[14px] overflow-hidden hover:border-[#D6AF36] transition-all duration-200 gold-glow-hover">
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-white mb-2">{title}</h3>
        <p className="text-[#BDBDBD] mb-4 line-clamp-2">{description}</p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-[#BDBDBD]">
            <Calendar size={16} className="text-[#D6AF36]" />
            <span className="text-sm">{date}</span>
          </div>

          <div className="flex items-center gap-2 text-[#BDBDBD]">
            <Clock size={16} className="text-[#D6AF36]" />
            <span className="text-sm">{time}</span>
          </div>

          <div className="flex items-center gap-2 text-[#BDBDBD]">
            <Users size={16} className="text-[#D6AF36]" />
            <span className="text-sm">
              {attendees} {attendees === 1 ? "attending" : "attending"}
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => onToggleAttend && onToggleAttend(id)}
          className={`w-full py-3 rounded-lg transition-all duration-200 ${
            isAttending
              ? "bg-transparent border border-[#D6AF36] text-[#D6AF36] hover:bg-[#D6AF36]/10"
              : "bg-gradient-to-r from-[#D6AF36] to-[#FFD700] text-black hover:opacity-90"
          }`}
        >
          {isAttending ? "Joined" : "Join Reflection Circle"}
        </button>
      </div>
    </article>
  );
}
