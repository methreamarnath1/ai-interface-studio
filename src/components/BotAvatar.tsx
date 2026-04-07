import { Bot, Sparkles, Zap, Brain, FlameKindling, Eye, User } from "lucide-react";
import { cn } from "@/lib/utils";

const roleConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  positive: { icon: Sparkles, color: "text-green bg-green/10 border-green/20", label: "Positive" },
  negative: { icon: FlameKindling, color: "text-rose bg-rose/10 border-rose/20", label: "Negative" },
  neutral: { icon: Eye, color: "text-cyan bg-cyan/10 border-cyan/20", label: "Neutral" },
  creative: { icon: Zap, color: "text-amber bg-amber/10 border-amber/20", label: "Creative" },
  devil_advocate: { icon: Brain, color: "text-purple bg-purple/10 border-purple/20", label: "Devil's Advocate" },
};

function getConfig(role: string) {
  return roleConfig[role] || { icon: User, color: "text-muted-foreground bg-muted border-border", label: role };
}

export function BotAvatar({ name, role, size = "md" }: { name: string; role: string; size?: "sm" | "md" | "lg" }) {
  const config = getConfig(role);
  const Icon = config.icon;
  const sizes = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-14 w-14" };
  const iconSizes = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-7 w-7" };

  return (
    <div className={cn("rounded-full border flex items-center justify-center", config.color, sizes[size])}>
      <Icon className={iconSizes[size]} />
    </div>
  );
}

export function RoleBadge({ role }: { role: string }) {
  const config = getConfig(role);
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border", config.color)}>
      {config.label}
    </span>
  );
}
