import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { StreakBadge, UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatRelative } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/topics/$topicId")({
  head: () => ({
    meta: [
      { title: "BAC Topic — BAC COMMUNITY" },
      { name: "description", content: "Read a shared BAC topic with its subject, content and student replies." },
      { property: "og:title", content: "BAC Topic — BAC COMMUNITY" },
      { property: "og:description", content: "A BAC topic shared by a student in the community." },
    ],
  }),
  component: TopicDetail,
});

function TopicDetail() {
  const { topicId } = Route.useParams();
  const { t, locale } = useI18n();
  const { data, profileById, streakOf, topicReplies, replyToTopic } = useStore();
  const [draft, setDraft] = useState("");

  const topic = data.bac_topics.find((item) => item.id === topicId);

  if (!topic) {
    return (
      <div className="panel p-6">
        <p className="text-sm text-muted-foreground">{t("search.empty")}</p>
        <Link to="/topics" className="mt-3 inline-block text-sm font-semibold text-ember">
          {t("action.back")}
        </Link>
      </div>
    );
  }

  const author = profileById(topic.author_id);
  const replies = topicReplies(topic.id);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;
    replyToTopic(topic.id, content);
    setDraft("");
  };

  return (
    <div className="animate-rise mx-auto max-w-3xl space-y-4">
      <Link
        to="/topics"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {t("topics.title")}
      </Link>

      <article className="panel p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
          <span className="font-semibold text-ember">{t(`subject.${topic.subject}`)}</span>
          <span>{formatDate(topic.created_at, locale)}</span>
        </div>
        <h1 className="mt-3 font-display text-2xl font-semibold">{topic.title}</h1>
        <div className="mt-4 flex items-center gap-3">
          <UserAvatar profile={author} size="sm" />
          <div className="min-w-0 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-foreground">{author.display_name}</span>
              <StreakBadge count={streakOf(author.id).current_streak} />
            </div>
            <span className="text-muted-foreground">@{author.username}</span>
          </div>
        </div>
        <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-foreground/90">{topic.content}</p>
      </article>

      <section className="panel p-5 sm:p-6">
        <h2 className="font-display text-base font-semibold">
          {t("discussions.replyTitle")} · {replies.length}
        </h2>
        <div className="mt-4 space-y-4">
          {replies.length === 0 && <p className="text-sm text-muted-foreground">{t("discussions.noReplies")}</p>}
          {replies.map((reply) => {
            const replyAuthor = profileById(reply.author_id);
            return (
              <div key={reply.id} className="flex items-start gap-3">
                <UserAvatar profile={replyAuthor} size="sm" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 text-xs">
                    <span className="font-semibold">{replyAuthor.display_name}</span>
                    <StreakBadge count={streakOf(replyAuthor.id).current_streak} />
                    <span className="text-muted-foreground">{formatRelative(reply.created_at, t)}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/90">{reply.content}</p>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={submit} className="mt-5 space-y-2 border-t border-border pt-4">
          <Textarea
            rows={3}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={t("discussions.replyPlaceholder")}
          />
          <Button type="submit" disabled={draft.trim().length === 0}>
            {t("action.reply")}
          </Button>
        </form>
      </section>
    </div>
  );
}
