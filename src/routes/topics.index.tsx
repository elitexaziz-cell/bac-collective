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
import { BAC_SUBJECTS, type BacSubject } from "@/lib/types";

export const Route = createFileRoute("/topics/")({
  head: () => ({
    meta: [
      { title: "BAC Topics — BAC COMMUNITY" },
      {
        name: "description",
        content:
          "Course material and exercises shared by BAC students, sorted by subject: maths, physics, sciences, languages, philosophy and more.",
      },
      { property: "og:title", content: "BAC Topics — BAC COMMUNITY" },
      { property: "og:description", content: "Share and find BAC material by subject." },
    ],
  }),
  component: TopicsPage,
});

function TopicsPage() {
  const { t } = useI18n();
  const { data, profileById, streakOf, topicReplies, createTopic } = useStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<BacSubject | "all">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState<BacSubject>("mathematics");

  const topics = [...data.bac_topics]
    .filter((topic) => filter === "all" || topic.subject === filter)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const created = createTopic({ title: title.trim(), content: content.trim(), subject });
    setTitle("");
    setContent("");
    setFormOpen(false);
    navigate({ to: "/topics/$topicId", params: { topicId: created.id } });
  };

  return (
    <div className="animate-rise space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-semibold">{t("topics.title")}</h1>
          <p className="truncate text-sm text-muted-foreground">{t("topics.subtitle")}</p>
        </div>
        <Button onClick={() => setFormOpen((open) => !open)} className="shrink-0">
          <Plus className="size-4" />
          <span className="hidden sm:inline">{t("action.newTopic")}</span>
        </Button>
      </div>

      {formOpen && (
        <form onSubmit={submit} className="panel animate-rise space-y-3 p-5">
          <h2 className="font-display text-base font-semibold">{t("topics.formTitle")}</h2>
          <div className="grid gap-1.5">
            <Label htmlFor="t-title">{t("field.title")}</Label>
            <Input id="t-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="t-subject">{t("field.subject")}</Label>
            <Select value={subject} onValueChange={(value) => setSubject(value as BacSubject)}>
              <SelectTrigger id="t-subject">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BAC_SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {t(`subject.${s}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="t-content">{t("field.content")}</Label>
            <Textarea id="t-content" rows={5} value={content} onChange={(e) => setContent(e.target.value)} required />
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

      <div className="-mx-1 flex flex-wrap gap-2 px-1">
        <button
          onClick={() => setFilter("all")}
          className={
            filter === "all"
              ? "rounded-full bg-ember/15 px-3 py-1.5 text-xs font-semibold text-ember"
              : "rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          }
        >
          {t("topics.allSubjects")}
        </button>
        {BAC_SUBJECTS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={
              filter === s
                ? "rounded-full bg-ember/15 px-3 py-1.5 text-xs font-semibold text-ember"
                : "rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            {t(`subject.${s}`)}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {topics.length === 0 && (
          <p className="panel p-5 text-sm text-muted-foreground sm:col-span-2">{t("topics.empty")}</p>
        )}
        {topics.map((topic) => {
          const author = profileById(topic.author_id);
          return (
            <Link
              key={topic.id}
              to="/topics/$topicId"
              params={{ topicId: topic.id }}
              className="panel block p-5 transition-colors hover:bg-muted/40"
            >
              <p className="text-xs font-semibold text-ember">{t(`subject.${topic.subject}`)}</p>
              <h2 className="mt-1.5 font-display text-base font-semibold">{topic.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{topic.content}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <UserAvatar profile={author} size="sm" className="size-6 rounded-lg text-[10px]" />
                <span>{author.display_name}</span>
                <StreakBadge count={streakOf(author.id).current_streak} />
                <span>·</span>
                <span>
                  {topicReplies(topic.id).length} {t("discussions.replies")}
                </span>
                <span>·</span>
                <span>{formatRelative(topic.created_at, t)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
