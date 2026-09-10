import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n();
  const { data } = useStore();
  const [query, setQuery] = useState("");

  const term = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!term) return { discussions: [], topics: [] };
    const match = (...fields: string[]) => fields.some((f) => f.toLowerCase().includes(term));
    return {
      discussions: data.discussions.filter((d) => match(d.title, d.content, d.category)).slice(0, 6),
      topics: data.bac_topics.filter((tp) => match(tp.title, tp.content, tp.subject)).slice(0, 6),
    };
  }, [term, data.discussions, data.bac_topics]);

  const empty = term.length > 0 && results.discussions.length === 0 && results.topics.length === 0;

  const close = () => {
    onOpenChange(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">{t("search.title")}</DialogTitle>
        </DialogHeader>
        <Input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("search.placeholder")}
        />
        <div className="max-h-72 space-y-4 overflow-y-auto">
          {results.discussions.length > 0 && (
            <div>
              <p className="label-caps mb-2">{t("search.discussions")}</p>
              <div className="space-y-1">
                {results.discussions.map((d) => (
                  <Link
                    key={d.id}
                    to="/discussions/$discussionId"
                    params={{ discussionId: d.id }}
                    onClick={close}
                    className="block rounded-xl px-3 py-2 text-sm hover:bg-muted"
                  >
                    <span className="font-medium">{d.title}</span>
                    <span className="ms-2 text-xs text-muted-foreground">{t(`category.${d.category}`)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {results.topics.length > 0 && (
            <div>
              <p className="label-caps mb-2">{t("search.topics")}</p>
              <div className="space-y-1">
                {results.topics.map((topic) => (
                  <Link
                    key={topic.id}
                    to="/topics/$topicId"
                    params={{ topicId: topic.id }}
                    onClick={close}
                    className="block rounded-xl px-3 py-2 text-sm hover:bg-muted"
                  >
                    <span className="font-medium">{topic.title}</span>
                    <span className="ms-2 text-xs text-muted-foreground">{t(`subject.${topic.subject}`)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {empty && <p className="px-1 py-4 text-sm text-muted-foreground">{t("search.empty")}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
