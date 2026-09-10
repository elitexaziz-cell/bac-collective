import { cn } from "@/lib/utils";
import type { AvatarAccent, Profile } from "@/lib/types";

const accentClasses: Record<AvatarAccent, string> = {
  ember: "bg-ember/15 text-ember",
  ice: "bg-ice/15 text-ice",
  mint: "bg-mint/15 text-mint",
  violet: "bg-violet/15 text-violet",
  rose: "bg-rose/15 text-rose",
};

const sizeClasses = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
  xl: "size-20 text-2xl",
};

export function UserAvatar({
  profile,
  size = "md",
  className,
}: {
  profile: Profile;
  size?: keyof typeof sizeClasses;
  className?: string;
}) {
  const initials = profile.display_name.slice(0, 1).toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-2xl font-display font-bold",
        accentClasses[profile.accent],
        sizeClasses[size],
        className,
      )}
    >
      {initials}
    </span>
  );
}

export function StreakBadge({ count, className }: { count: number; className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 text-xs font-semibold text-ember", className)}
      title={`${count} day streak`}
    >
      <span className="animate-flame">🔥</span>
      {count}
    </span>
  );
}
