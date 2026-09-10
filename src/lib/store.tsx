import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { CURRENT_USER_ID, seedData } from "./seed";
import type {
  AppData,
  BacReply,
  BacSubject,
  BacTopic,
  Discussion,
  DiscussionCategory,
  DiscussionReply,
  ID,
  Message,
  Profile,
  Streak,
  StudySession,
} from "./types";

const STORAGE_KEY = "bac-community:data:v1";

/** A session shorter than this does not count toward the streak. */
export const MIN_VALID_SESSION_SECONDS = 60;

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2)}-${Date.now()}`;

const todayKey = (date = new Date()) => date.toISOString().slice(0, 10);
const yesterdayKey = () => todayKey(new Date(Date.now() - 86_400_000));

export type TimerStatus = "idle" | "running" | "paused" | "finished";

export interface TimerState {
  subject: BacSubject;
  plannedSeconds: number;
  remainingSeconds: number;
  elapsedSeconds: number;
  status: TimerStatus;
  startedAt: string | null;
}

const initialTimer: TimerState = {
  subject: "mathematics",
  plannedSeconds: 40 * 60,
  remainingSeconds: 40 * 60,
  elapsedSeconds: 0,
  status: "idle",
  startedAt: null,
};

interface StoreValue {
  data: AppData;
  me: Profile;
  myStreak: Streak;
  profileById: (id: ID) => Profile;
  streakOf: (id: ID) => Streak;
  sendMessage: (content: string) => void;
  createDiscussion: (input: { title: string; content: string; category: DiscussionCategory }) => Discussion;
  replyToDiscussion: (discussionId: ID, content: string) => void;
  createTopic: (input: { title: string; content: string; subject: BacSubject }) => BacTopic;
  replyToTopic: (topicId: ID, content: string) => void;
  discussionReplies: (discussionId: ID) => DiscussionReply[];
  topicReplies: (topicId: ID) => BacReply[];
  todaySeconds: number;
  myPostCount: number;
  myReplyCount: number;
  timer: TimerState;
  timerOpen: boolean;
  setTimerOpen: (open: boolean) => void;
  configureTimer: (input: { subject: BacSubject; minutes: number }) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(seedData);
  const [hydrated, setHydrated] = useState(false);
  const [timer, setTimer] = useState<TimerState>(initialTimer);
  const [timerOpen, setTimerOpen] = useState(false);

  // Load local persistence after hydration so SSR and client markup match.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...seedData, ...(JSON.parse(raw) as AppData) });
    } catch {
      /* ignore unreadable local data */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* storage unavailable */
    }
  }, [data, hydrated]);

const unknownProfile: Profile = {
  id: "unknown",
  username: "unknown",
  display_name: "Unknown",
  accent: "ice",
  bio: "",
  created_at: new Date(0).toISOString(),
};

  const profileById = useCallback(
    (id: ID): Profile => data.profiles.find((p) => p.id === id) ?? data.profiles[0] ?? unknownProfile,
    [data.profiles],
  );

  const streakOf = useCallback(
    (id: ID): Streak =>
      data.streaks.find((s) => s.profile_id === id) ?? {
        profile_id: id,
        current_streak: 0,
        longest_streak: 0,
        last_study_date: null,
        total_seconds: 0,
      },
    [data.streaks],
  );

  const me = profileById(data.current_user_id ?? CURRENT_USER_ID);
  const myStreak = streakOf(me.id);

  const sendMessage = useCallback(
    (content: string) => {
      const message: Message = {
        id: newId(),
        author_id: me.id,
        content,
        created_at: new Date().toISOString(),
      };
      setData((d) => ({ ...d, messages: [...d.messages, message] }));
    },
    [me.id],
  );

  const createDiscussion = useCallback<StoreValue["createDiscussion"]>(
    ({ title, content, category }) => {
      const discussion: Discussion = {
        id: newId(),
        author_id: me.id,
        title,
        content,
        category,
        created_at: new Date().toISOString(),
      };
      setData((d) => ({ ...d, discussions: [discussion, ...d.discussions] }));
      return discussion;
    },
    [me.id],
  );

  const replyToDiscussion = useCallback(
    (discussionId: ID, content: string) => {
      const reply: DiscussionReply = {
        id: newId(),
        discussion_id: discussionId,
        author_id: me.id,
        content,
        created_at: new Date().toISOString(),
      };
      setData((d) => ({ ...d, discussion_replies: [...d.discussion_replies, reply] }));
    },
    [me.id],
  );

  const createTopic = useCallback<StoreValue["createTopic"]>(
    ({ title, content, subject }) => {
      const topic: BacTopic = {
        id: newId(),
        author_id: me.id,
        subject,
        title,
        content,
        created_at: new Date().toISOString(),
      };
      setData((d) => ({ ...d, bac_topics: [topic, ...d.bac_topics] }));
      return topic;
    },
    [me.id],
  );

  const replyToTopic = useCallback(
    (topicId: ID, content: string) => {
      const reply: BacReply = {
        id: newId(),
        topic_id: topicId,
        author_id: me.id,
        content,
        created_at: new Date().toISOString(),
      };
      setData((d) => ({ ...d, bac_replies: [...d.bac_replies, reply] }));
    },
    [me.id],
  );

  /** Records a finished session and advances the streak at most once per day. */
  const recordSession = useCallback(
    (session: StudySession) => {
      setData((d) => {
        const sessions = [session, ...d.study_sessions];
        if (session.elapsed_seconds < MIN_VALID_SESSION_SECONDS) {
          return { ...d, study_sessions: sessions };
        }
        const today = todayKey();
        const streaks = d.streaks.map((s) => {
          if (s.profile_id !== session.profile_id) return s;
          const alreadyToday = s.last_study_date === today;
          const current = alreadyToday
            ? s.current_streak
            : s.last_study_date === yesterdayKey()
              ? s.current_streak + 1
              : 1;
          return {
            ...s,
            current_streak: current,
            longest_streak: Math.max(s.longest_streak, current),
            last_study_date: today,
            total_seconds: s.total_seconds + session.elapsed_seconds,
          };
        });
        return { ...d, study_sessions: sessions, streaks };
      });
    },
    [],
  );

  // Countdown tick.
  const timerRef = useRef(timer);
  timerRef.current = timer;
  useEffect(() => {
    if (timer.status !== "running") return;
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t.status !== "running") return t;
        const remaining = Math.max(0, t.remainingSeconds - 1);
        const elapsed = t.elapsedSeconds + 1;
        if (remaining === 0) {
          return { ...t, remainingSeconds: 0, elapsedSeconds: elapsed, status: "finished" };
        }
        return { ...t, remainingSeconds: remaining, elapsedSeconds: elapsed };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer.status]);

  // When the countdown reaches zero, save the completed session.
  const finishedHandled = useRef(false);
  useEffect(() => {
    if (timer.status !== "finished") {
      finishedHandled.current = false;
      return;
    }
    if (finishedHandled.current) return;
    finishedHandled.current = true;
    recordSession({
      id: newId(),
      profile_id: me.id,
      subject: timer.subject,
      planned_seconds: timer.plannedSeconds,
      elapsed_seconds: timer.elapsedSeconds,
      started_at: timer.startedAt ?? new Date().toISOString(),
      ended_at: new Date().toISOString(),
      completed: true,
    });
  }, [timer, me.id, recordSession]);

  const configureTimer = useCallback(({ subject, minutes }: { subject: BacSubject; minutes: number }) => {
    const seconds = Math.max(1, Math.round(minutes)) * 60;
    setTimer((t) =>
      t.status === "running" || t.status === "paused"
        ? { ...t, subject }
        : {
            subject,
            plannedSeconds: seconds,
            remainingSeconds: seconds,
            elapsedSeconds: 0,
            status: "idle",
            startedAt: null,
          },
    );
  }, []);

  const startTimer = useCallback(() => {
    setTimer((t) => ({
      ...t,
      remainingSeconds: t.plannedSeconds,
      elapsedSeconds: 0,
      status: "running",
      startedAt: new Date().toISOString(),
    }));
  }, []);

  const pauseTimer = useCallback(() => setTimer((t) => (t.status === "running" ? { ...t, status: "paused" } : t)), []);
  const resumeTimer = useCallback(() => setTimer((t) => (t.status === "paused" ? { ...t, status: "running" } : t)), []);

  const stopTimer = useCallback(() => {
    const t = timerRef.current;
    if (t.status === "running" || t.status === "paused") {
      recordSession({
        id: newId(),
        profile_id: me.id,
        subject: t.subject,
        planned_seconds: t.plannedSeconds,
        elapsed_seconds: t.elapsedSeconds,
        started_at: t.startedAt ?? new Date().toISOString(),
        ended_at: new Date().toISOString(),
        completed: false,
      });
    }
    setTimer((prev) => ({
      ...prev,
      remainingSeconds: prev.plannedSeconds,
      elapsedSeconds: 0,
      status: "idle",
      startedAt: null,
    }));
  }, [me.id, recordSession]);

  const resetTimer = useCallback(() => {
    setTimer((prev) => ({
      ...prev,
      remainingSeconds: prev.plannedSeconds,
      elapsedSeconds: 0,
      status: "idle",
      startedAt: null,
    }));
  }, []);

  const todaySeconds = useMemo(() => {
    const today = todayKey();
    return data.study_sessions
      .filter((s) => s.profile_id === me.id && s.started_at.slice(0, 10) === today)
      .reduce((sum, s) => sum + s.elapsed_seconds, 0);
  }, [data.study_sessions, me.id]);

  const myPostCount = useMemo(
    () =>
      data.discussions.filter((d) => d.author_id === me.id).length +
      data.bac_topics.filter((t) => t.author_id === me.id).length,
    [data.discussions, data.bac_topics, me.id],
  );

  const myReplyCount = useMemo(
    () =>
      data.discussion_replies.filter((r) => r.author_id === me.id).length +
      data.bac_replies.filter((r) => r.author_id === me.id).length,
    [data.discussion_replies, data.bac_replies, me.id],
  );

  const discussionReplies = useCallback(
    (discussionId: ID) =>
      data.discussion_replies
        .filter((r) => r.discussion_id === discussionId)
        .sort((a, b) => a.created_at.localeCompare(b.created_at)),
    [data.discussion_replies],
  );

  const topicReplies = useCallback(
    (topicId: ID) =>
      data.bac_replies
        .filter((r) => r.topic_id === topicId)
        .sort((a, b) => a.created_at.localeCompare(b.created_at)),
    [data.bac_replies],
  );

  const value: StoreValue = {
    data,
    me,
    myStreak,
    profileById,
    streakOf,
    sendMessage,
    createDiscussion,
    replyToDiscussion,
    createTopic,
    replyToTopic,
    discussionReplies,
    topicReplies,
    todaySeconds,
    myPostCount,
    myReplyCount,
    timer,
    timerOpen,
    setTimerOpen,
    configureTimer,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
