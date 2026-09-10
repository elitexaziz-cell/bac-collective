import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { StreakBadge, UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatRelative } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/discussions/$discussionId")({
  head: () => ({
    meta: [
      { title: "Discussion — BAC COMMUNITY" },
      { name: "description", content: "Read the full discussion and its replies from the BAC study community." },
      { property: "og:title", content: "Discussion — BAC COMMUNITY" },
      { property: "og:description", content: "A discussion thread from the BAC study community." },
    ],
  }),
  component: DiscussionDetail,
});

function DiscussionDetail() {
  const { discussionId } = Route.useParams();
  const { t, locale } = useI18n();
  const { data, profileById, streakOf, discussionReplies, replyToDiscussion } = useStore();
  const [draft, setDraft] = useState("");

  const discussion = data.discussions.find((d) => d.id === discussionId);

  if (!discussion) {
    return (
      <div className="panel p-6">
        <p className="text-sm text-muted-foreground">{t("search.empty")}</p>
        <Link to="/discussions" className="mt-3 inline-block text-sm font-semibold text-ember">
          {t("action.back")}
        </Link>
      </div>
    );
  }

  const author = profileById(discussion.author_id);
  const replies = discussionReplies(discussion.id);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;
    replyToDiscussion(discussion.id, content);
    setDraft("");
  };

  return (
    <div className="animate-rise mx-auto max-w-3xl space-y-4">
      <Link
        to="/discussions"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {t("discussions.title")}
      </Link>

      <article className="panel p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span className="rounded-full bg-muted px-2 py-0.5 font-semibold">{t(`category.${discussion.category}`)}</span>
          <span>{formatDate(discussion.created_at, locale)}</span>
        </div>
        <h1 className="mt-3 font-display text-2xl font-semibold">{discussion.title}</h1>
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
        <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-foreground/90">{discussion.content}</p>
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
