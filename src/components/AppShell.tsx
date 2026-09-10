import { Link } from "@tanstack/react-router";
import { Flame, Home, MessageCircle, MessagesSquare, Moon, Search, Sun, Timer, User } from "lucide-react";
import { useState, type ReactNode } from "react";

import { SearchDialog } from "@/components/SearchDialog";
import { StudyTimerDialog } from "@/components/StudyTimerDialog";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LOCALES, LOCALE_LABELS, useI18n, type Locale } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";

const navItems = [
  { to: "/", labelKey: "nav.home", icon: Home },
  { to: "/chat", labelKey: "nav.chat", icon: MessageCircle },
  { to: "/discussions", labelKey: "nav.discussions", icon: MessagesSquare },
  { to: "/topics", labelKey: "nav.topics", icon: Flame },
  { to: "/profile", labelKey: "nav.profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { t, locale, setLocale } = useI18n();
  const { theme, toggle } = useTheme();
  const { me, myStreak, setTimerOpen } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1400px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-e border-border bg-sidebar p-4 lg:flex">
          <Link to="/" className="flex items-center gap-3 px-1 py-2">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-ember/15 font-display text-lg font-bold text-ember">
              B
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-semibold">BAC COMMUNITY</span>
              <span className="label-caps">{t("app.tagline")}</span>
            </span>
          </Link>

          <nav className="mt-6 flex flex-col gap-1">
            {navItems.map(({ to, labelKey, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[status=active]:bg-muted data-[status=active]:text-foreground"
              >
                <Icon className="size-4 shrink-0" />
                <span className="truncate">{t(labelKey)}</span>
              </Link>
            ))}
          </nav>

          <Button className="mt-6" onClick={() => setTimerOpen(true)}>
            <Timer className="size-4" />
            {t("action.openTimer")}
          </Button>

          <div className="mt-auto panel p-3">
            <p className="label-caps">{t("home.streak")}</p>
            <p className="mt-1 font-display text-2xl font-semibold">
              <span className="animate-flame inline-block">🔥</span> {myStreak.current_streak}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t("home.encouragement")}</p>
          </div>
        </aside>

        {/* Content column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
              <div className="flex min-w-0 items-center gap-2">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-ember/15 font-display font-bold text-ember lg:hidden">
                  B
                </span>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-start text-sm text-muted-foreground transition-colors hover:bg-muted sm:max-w-sm"
                >
                  <Search className="size-4 shrink-0" />
                  <span className="truncate">{t("search.placeholder")}</span>
                </button>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Select value={locale} onValueChange={(value) => setLocale(value as Locale)}>
                  <SelectTrigger className="h-9 w-[86px]" aria-label={t("language")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCALES.map((code) => (
                      <SelectItem key={code} value={code}>
                        {LOCALE_LABELS[code]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={toggle}
                  aria-label={theme === "dark" ? t("theme.light") : t("theme.dark")}
                >
                  {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </Button>
                <Link to="/profile" aria-label={t("nav.profile")}>
                  <UserAvatar profile={me} size="md" className="rounded-xl" />
                </Link>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 pb-28 pt-5 sm:px-6 sm:pt-6 lg:pb-10">{children}</main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {navItems.map(({ to, labelKey, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground data-[status=active]:text-ember"
            >
              <Icon className="size-5" />
              <span className="max-w-full truncate px-1">{t(labelKey)}</span>
            </Link>
          ))}
        </div>
      </nav>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <StudyTimerDialog />
    </div>
  );
}
