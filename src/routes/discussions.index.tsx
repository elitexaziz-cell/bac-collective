import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

import { StreakBadge, UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatRelative } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { DISCUSSION_CATEGORIES, type DiscussionCategory } from "@/lib/types";

export const Route = createFileRoute("/discussions/")({
  head: () => ({
    meta: [
      { title: "Discussions — BAC COMMUNITY" },
      {
        name: "description",
        content:
          "Read and start discussions with BAC students across general, study, motivation and question categories.",
      },
      { property: "og:title", content: "Discussions — BAC COMMUNITY" },
      { property: "og:description", content: "Ask, answer and share what actually works for the BAC." },
    ],
  }),
  component: DiscussionsPage,
});

function DiscussionsPage() {
  const { t } = useI18n();
  const { data, profileById, streakOf, discussionReplies, createDiscussion } = useStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<DiscussionCategory | "all">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<DiscussionCategory>("general");

  const discussions = [...data.discussions]
    .filter((d) => filter === "all" || d.category === filter)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const created = createDiscussion({ title: title.trim(), content: content.trim(), category });
    setTitle("");
    setContent("");
    setFormOpen(false);
    navigate({ to: "/discussions/$discussionId", params: { discussionId: created.id } });
  };

  return (
    <div className="animate-rise space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-semibold">{t("discussions.title")}</h1>
          <p className="truncate text-sm text-muted-foreground">{t("discussions.subtitle")}</p>
        </div>
        <Button onClick={() => setFormOpen((open) => !open)} className="shrink-0">
          <Plus className="size-4" />
          <span className="hidden sm:inline">{t("action.newDiscussion")}</span>
        </Button>
      </div>

      {formOpen && (
        <form onSubmit={submit} className="panel animate-rise space-y-3 p-5">
          <h2 className="font-display text-base font-semibold">{t("discussions.formTitle")}</h2>
          <div className="grid gap-1.5">
            <Label htmlFor="d-title">{t("field.title")}</Label>
            <Input id="d-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="d-category">{t("field.category")}</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as DiscussionCategory)}>
              <SelectTrigger id="d-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DISCUSSION_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {t(`category.${c}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="d-content">{t("field.content")}</Label>
            <Textarea id="d-content" rows={5} value={content} onChange={(e) => setContent(e.target.value)} required />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={!title.trim() || !content.trim()}>
              {t("action.post")}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>
              {t("action.cancel")}
            </Button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        {(["all", ...DISCUSSION_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={
              filter === c
                ? "rounded-full bg-ember/15 px-3 py-1.5 text-xs font-semibold text-ember"
                : "rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            {t(`category.${c}`)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {discussions.length === 0 && <p className="panel p-5 text-sm text-muted-foreground">{t("discussions.empty")}</p>}
        {discussions.map((discussion) => {
          const author = profileById(discussion.author_id);
          return (
            <Link
              key={discussion.id}
              to="/discussions/$discussionId"
              params={{ discussionId: discussion.id }}
              className="panel block p-5 transition-colors hover:bg-muted/40"
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <span className="rounded-full bg-muted px-2 py-0.5 font-semibold">
                  {t(`category.${discussion.category}`)}
                </span>
                <span>{author.display_name}</span>
                <StreakBadge count={streakOf(author.id).current_streak} />
                <span>{formatRelative(discussion.created_at, t)}</span>
              </div>
              <div className="mt-2 flex items-start gap-3">
                <UserAvatar profile={author} size="sm" />
                <div className="min-w-0">
                  <h2 className="font-display text-base font-semibold">{discussion.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{discussion.content}</p>
                </div>
              </div>
              <p className="mt-3 text-xs font-medium text-ember">
                {discussionReplies(discussion.id).length} {t("discussions.replies")}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
