import { Link, createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Play, Timer } from "lucide-react";

import { StreakBadge, UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { formatDuration, formatRelative } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BAC COMMUNITY — Study together, keep your streak" },
      {
        name: "description",
        content:
          "A study community for BAC students: group chat, discussions, BAC topics by subject, a personal study timer and a daily streak.",
      },
      { property: "og:title", content: "BAC COMMUNITY — Study together, keep your streak" },
      {
        property: "og:description",
        content: "Chat, share BAC topics, and track your own study time and streak.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t } = useI18n();
  const { me, myStreak, todaySeconds, data, profileById, streakOf, setTimerOpen, discussionReplies, timer } =
    useStore();

  const recentDiscussions = [...data.discussions]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 3);
  const recentTopics = [...data.bac_topics].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 4);
  const lastMessage = data.messages[data.messages.length - 1];

  return (
    <div className="animate-rise space-y-4">
      <section className="panel flex flex-col gap-6 p-5 sm:p-7">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
          <UserAvatar profile={me} size="lg" />
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{t("home.greeting")}</p>
            <h1 className="truncate font-display text-2xl font-semibold sm:text-3xl">{me.display_name}</h1>
            <p className="truncate text-xs text-muted-foreground">@{me.username}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-muted/60 p-4">
            <p className="label-caps">{t("home.streak")}</p>
            <p className="mt-2 font-display text-2xl font-semibold">
              <span className="animate-flame inline-block">🔥</span> {myStreak.current_streak}{" "}
              <span className="text-sm font-medium text-muted-foreground">{t("home.days")}</span>
            </p>
          </div>
          <div className="rounded-2xl bg-muted/60 p-4">
            <p className="label-caps">{t("home.today")}</p>
            <p className="mt-2 font-display text-2xl font-semibold">{formatDuration(todaySeconds)}</p>
          </div>
          <div className="rounded-2xl bg-muted/60 p-4">
            <p className="label-caps">{t("home.longest")}</p>
            <p className="mt-2 font-display text-2xl font-semibold">
              {myStreak.longest_streak} <span className="text-sm font-medium text-muted-foreground">{t("home.days")}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={() => setTimerOpen(true)}>
            <Play className="size-4" />
            {t("action.startStudying")}
          </Button>
          {timer.status !== "idle" && (
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="size-4" />
              {t(`subject.${timer.subject}`)} · {t(`timer.${timer.status}`)}
            </span>
          )}
          <p className="text-sm text-muted-foreground">{t("home.encouragement")}</p>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="panel min-w-0 p-5">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <h2 className="min-w-0 truncate font-display text-lg font-semibold">{t("home.recentDiscussions")}</h2>
            <Link to="/discussions" className="text-xs font-semibold text-ember hover:underline">
              {t("action.viewAll")}
            </Link>
          </div>
          <div className="mt-3 divide-y divide-border">
            {recentDiscussions.map((discussion) => {
              const author = profileById(discussion.author_id);
              return (
                <Link
                  key={discussion.id}
                  to="/discussions/$discussionId"
                  params={{ discussionId: discussion.id }}
                  className="flex min-w-0 items-center gap-3 py-3"
                >
                  <UserAvatar profile={author} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{discussion.title}</span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                      <span>
                        {t("by")} {author.display_name}
                      </span>
                      <StreakBadge count={streakOf(author.id).current_streak} />
                      <span>
                        {discussionReplies(discussion.id).length} {t("discussions.replies")}
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                    {t(`category.${discussion.category}`)}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="panel min-w-0 p-5">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <h2 className="min-w-0 truncate font-display text-lg font-semibold">{t("home.recentTopics")}</h2>
            <Link to="/topics" className="text-xs font-semibold text-ember hover:underline">
              {t("action.browse")}
            </Link>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {recentTopics.map((topic) => (
              <Link
                key={topic.id}
                to="/topics/$topicId"
                params={{ topicId: topic.id }}
                className="rounded-2xl bg-muted/60 p-3 transition-colors hover:bg-muted"
              >
                <p className="truncate text-sm font-medium">{topic.title}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {t(`subject.${topic.subject}`)} · {formatRelative(topic.created_at, t)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <Link
        to="/chat"
        className="panel flex items-center gap-4 p-5 transition-colors hover:bg-muted/50"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-mint/15 text-mint">
          <MessageCircle className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-base font-semibold">{t("home.chatCard")}</span>
          <span className="block truncate text-sm text-muted-foreground">
            {lastMessage ? lastMessage.content : t("home.chatCardHint")}
          </span>
        </span>
      </Link>
    </div>
  );
}
