import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { StreakBadge, UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatTimeOfDay } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Group Chat — BAC COMMUNITY" },
      {
        name: "description",
        content: "Talk with other BAC students in one shared study chat: quick questions, answers and support.",
      },
      { property: "og:title", content: "Group Chat — BAC COMMUNITY" },
      { property: "og:description", content: "One shared chat for BAC students: ask, answer, keep going." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const { t, locale } = useI18n();
  const { data, me, profileById, streakOf, sendMessage } = useStore();
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = [...data.messages].sort((a, b) => a.created_at.localeCompare(b.created_at));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;
    sendMessage(content);
    setDraft("");
  };

  return (
    <div className="animate-rise panel flex h-[calc(100vh-13rem)] min-h-[26rem] flex-col lg:h-[calc(100vh-9rem)]">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-5">
        <span className="size-2 shrink-0 rounded-full bg-mint" />
        <h1 className="min-w-0 truncate font-display text-base font-semibold">{t("chat.title")}</h1>
        <span className="ms-auto shrink-0 text-xs text-muted-foreground">{data.profiles.length}</span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
        {messages.length === 0 && <p className="text-sm text-muted-foreground">{t("chat.empty")}</p>}
        {messages.map((message) => {
          const author = profileById(message.author_id);
          return (
            <div key={message.id} className="flex items-start gap-3">
              <UserAvatar profile={author} size="sm" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 text-xs">
                  <span className="font-semibold text-foreground">{author.display_name}</span>
                  <StreakBadge count={streakOf(author.id).current_streak} />
                  <span className="text-muted-foreground">{formatTimeOfDay(message.created_at, locale)}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-foreground/90">{message.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={submit} className="flex items-center gap-2 border-t border-border px-3 py-3 sm:px-5">
        <UserAvatar profile={me} size="sm" className="hidden sm:grid" />
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t("chat.placeholder")}
          className="min-w-0 flex-1"
        />
        <Button type="submit" size="icon" disabled={draft.trim().length === 0} aria-label={t("action.send")}>
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}
