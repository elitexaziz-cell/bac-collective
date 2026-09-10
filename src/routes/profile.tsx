import { createFileRoute } from "@tanstack/react-router";
import { Lock, Timer } from "lucide-react";

import { StreakBadge, UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { formatDate, formatDuration } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — BAC COMMUNITY" },
      {
        name: "description",
        content: "Your streak, longest streak, total study time and community activity. Study statistics stay private.",
      },
      { property: "og:title", content: "Your Profile — BAC COMMUNITY" },
      { property: "og:description", content: "Track your streak and study time privately." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { t, locale } = useI18n();
  const { me, myStreak, data, myPostCount, myReplyCount, setTimerOpen } = useStore();

  const sessions = data.study_sessions
    .filter((session) => session.profile_id === me.id)
    .sort((a, b) => b.started_at.localeCompare(a.started_at))
    .slice(0, 6);

  const stats = [
    { label: t("profile.currentStreak"), value: `🔥 ${myStreak.current_streak}` },
    { label: t("profile.longestStreak"), value: String(myStreak.longest_streak) },
    { label: t("profile.totalTime"), value: formatDuration(myStreak.total_seconds) },
    { label: t("profile.posts"), value: String(myPostCount) },
    { label: t("profile.replies"), value: String(myReplyCount) },
  ];

  return (
    <div className="animate-rise mx-auto max-w-3xl space-y-4">
      <section className="panel p-5 sm:p-6">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
          <UserAvatar profile={me} size="xl" />
          <div className="min-w-0">
            <h1 className="truncate font-display text-2xl font-semibold">{me.display_name}</h1>
            <p className="truncate text-sm text-muted-foreground">@{me.username}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <StreakBadge count={myStreak.current_streak} />
              <span>{formatDate(me.created_at, locale)}</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-foreground/90">{me.bio}</p>
        <Button className="mt-5" onClick={() => setTimerOpen(true)}>
          <Timer className="size-4" />
          {t("action.openTimer")}
        </Button>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="panel p-4">
            <p className="label-caps">{stat.label}</p>
            <p className="mt-2 font-display text-xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </section>

      <p className="flex items-start gap-2 rounded-2xl bg-muted/60 p-4 text-xs text-muted-foreground">
        <Lock className="mt-0.5 size-3.5 shrink-0" />
        {t("profile.private")}
      </p>

      <section className="panel p-5">
        <h2 className="font-display text-base font-semibold">{t("profile.sessions")}</h2>
        <div className="mt-3 divide-y divide-border">
          {sessions.length === 0 && <p className="py-2 text-sm text-muted-foreground">{t("profile.noSessions")}</p>}
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{t(`subject.${session.subject}`)}</p>
                <p className="text-xs text-muted-foreground">{formatDate(session.started_at, locale)}</p>
              </div>
              <div className="shrink-0 text-end">
                <p className="text-sm font-semibold">{formatDuration(session.elapsed_seconds)}</p>
                <p className="text-xs text-muted-foreground">
                  {session.completed ? t("timer.finished") : t("action.stop")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
