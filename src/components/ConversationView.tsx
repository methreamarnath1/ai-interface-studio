import { BotAvatar, RoleBadge } from "./BotAvatar";
import type { Message } from "@/lib/api";
import { cn } from "@/lib/utils";

export function MessageBubble({ msg, index }: { msg: Message; index: number }) {
  return (
    <div
      className="animate-slide-up flex gap-3 py-3"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <BotAvatar name={msg.botName} role={msg.role} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm text-foreground">{msg.botName}</span>
          <RoleBadge role={msg.role} />
          <span className="text-xs text-muted-foreground ml-auto">Round {msg.round}</span>
        </div>
        <p className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-wrap">{msg.message}</p>
      </div>
    </div>
  );
}

export function ConversationView({ messages, loading }: { messages: Message[]; loading?: boolean }) {
  if (messages.length === 0 && !loading) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-sm">No messages yet. Start the discussion to see the conversation.</p>
      </div>
    );
  }

  const grouped: Record<number, Message[]> = {};
  messages.forEach((m) => {
    if (!grouped[m.round]) grouped[m.round] = [];
    grouped[m.round].push(m);
  });

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([round, msgs]) => (
        <div key={round}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-primary uppercase tracking-widest">Round {round}</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="space-y-1 divide-y divide-border/30">
            {msgs.map((m, i) => (
              <MessageBubble key={`${round}-${i}`} msg={m} index={i} />
            ))}
          </div>
        </div>
      ))}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-6">
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      )}
    </div>
  );
}
