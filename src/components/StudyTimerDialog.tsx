import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatClock } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { BAC_SUBJECTS, type BacSubject } from "@/lib/types";

export function StudyTimerDialog() {
  const { t } = useI18n();
  const {
    timer,
    timerOpen,
    setTimerOpen,
    configureTimer,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
  } = useStore();
  const [minutesInput, setMinutesInput] = useState(String(Math.round(timer.plannedSeconds / 60)));

  const idle = timer.status === "idle";
  const progress =
    timer.plannedSeconds > 0 ? Math.min(1, timer.elapsedSeconds / timer.plannedSeconds) : 0;

  const statusLabel =
    timer.status === "running"
      ? t("timer.running")
      : timer.status === "paused"
        ? t("timer.paused")
        : timer.status === "finished"
          ? t("timer.finished")
          : t("timer.idle");

  const applyMinutes = (value: string) => {
    setMinutesInput(value);
    const minutes = Number(value);
    if (Number.isFinite(minutes) && minutes >= 1) configureTimer({ subject: timer.subject, minutes });
  };

  return (
    <Dialog open={timerOpen} onOpenChange={setTimerOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{t("timer.title")}</DialogTitle>
          <DialogDescription>{t("timer.hint")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <div className="relative grid size-44 place-items-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(var(--ember) 0 ${progress * 360}deg, var(--muted) ${progress * 360}deg 360deg)`,
                WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 9px), #000 calc(100% - 9px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 9px), #000 calc(100% - 9px))",
              }}
            />
            <div className="text-center">
              <div className="font-display text-4xl font-semibold tabular-nums">
                {formatClock(timer.remainingSeconds)}
              </div>
              <div className="label-caps mt-1">{statusLabel}</div>
            </div>
          </div>

          {timer.status === "finished" ? (
            <p className="text-center text-sm text-mint">{t("timer.finishedHint")}</p>
          ) : (
            <p className="text-center text-xs text-muted-foreground">{t("timer.minValid")}</p>
          )}
        </div>

        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>{t("field.subject")}</Label>
            <Select
              value={timer.subject}
              onValueChange={(value) =>
                configureTimer({ subject: value as BacSubject, minutes: Number(minutesInput) || 40 })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BAC_SUBJECTS.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {t(`subject.${subject}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="timer-minutes">{t("field.duration")}</Label>
            <Input
              id="timer-minutes"
              type="number"
              min={1}
              max={600}
              inputMode="numeric"
              disabled={!idle && timer.status !== "finished"}
              value={minutesInput}
              onChange={(event) => applyMinutes(event.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {timer.status === "idle" && (
            <Button className="flex-1" onClick={startTimer}>
              {t("action.start")}
            </Button>
          )}
          {timer.status === "running" && (
            <Button className="flex-1" onClick={pauseTimer}>
              {t("action.pause")}
            </Button>
          )}
          {timer.status === "paused" && (
            <Button className="flex-1" onClick={resumeTimer}>
              {t("action.resume")}
            </Button>
          )}
          {timer.status === "finished" && (
            <Button className="flex-1" onClick={resetTimer}>
              {t("action.reset")}
            </Button>
          )}
          {(timer.status === "running" || timer.status === "paused") && (
            <Button variant="secondary" onClick={stopTimer}>
              {t("action.stop")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
