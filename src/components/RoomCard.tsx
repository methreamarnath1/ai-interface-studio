import { useNavigate } from "react-router-dom";
import { StatusBadge } from "./StatusBadge";
import { MessageSquare, Users, Clock } from "lucide-react";
import type { RoomListItem } from "@/lib/api";

export function RoomCard({ room }: { room: RoomListItem }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/room/${room.id}`)}
      className="glass glow-border rounded-xl p-5 text-left w-full transition-all hover:bg-secondary/40 group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 pr-3">
          {room.topic}
        </h3>
        <StatusBadge status={room.status} />
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {room.botCount} bots</span>
        <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {room.messageCount} msgs</span>
        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {room.rounds} rounds</span>
      </div>
    </button>
  );
}
