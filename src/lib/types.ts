/**
 * Data models for BAC COMMUNITY.
 *
 * These shapes intentionally mirror future backend tables (profiles, messages,
 * discussions, discussion_replies, bac_topics, bac_replies, study_sessions,
 * streaks) so the frontend can be wired to a real database later without
 * reshaping the UI. Nothing here is a final schema commitment.
 */

export type ID = string;

export interface Profile {
  id: ID;
  username: string;
  display_name: string;
  /** Token name used for the avatar tint, e.g. "ember" | "ice" | "mint". */
  accent: AvatarAccent;
  bio: string;
  created_at: string;
}

export type AvatarAccent = "ember" | "ice" | "mint" | "violet" | "rose";

export interface Message {
  id: ID;
  author_id: ID;
  content: string;
  created_at: string;
}

export const DISCUSSION_CATEGORIES = ["general", "study", "motivation", "questions"] as const;
export type DiscussionCategory = (typeof DISCUSSION_CATEGORIES)[number];

export interface Discussion {
  id: ID;
  author_id: ID;
  title: string;
  content: string;
  category: DiscussionCategory;
  created_at: string;
}

export interface DiscussionReply {
  id: ID;
  discussion_id: ID;
  author_id: ID;
  content: string;
  created_at: string;
}

export const BAC_SUBJECTS = [
  "mathematics",
  "physics",
  "natural_sciences",
  "arabic",
  "french",
  "english",
  "philosophy",
  "history_geography",
  "islamic_studies",
] as const;
export type BacSubject = (typeof BAC_SUBJECTS)[number];

export interface BacTopic {
  id: ID;
  author_id: ID;
  subject: BacSubject;
  title: string;
  content: string;
  created_at: string;
}

export interface BacReply {
  id: ID;
  topic_id: ID;
  author_id: ID;
  content: string;
  created_at: string;
}

export interface StudySession {
  id: ID;
  profile_id: ID;
  subject: BacSubject;
  planned_seconds: number;
  elapsed_seconds: number;
  started_at: string;
  ended_at: string | null;
  /** True when the countdown reached zero without being stopped early. */
  completed: boolean;
}

export interface Streak {
  profile_id: ID;
  current_streak: number;
  longest_streak: number;
  /** ISO date (YYYY-MM-DD) of the last day with a valid session. */
  last_study_date: string | null;
  total_seconds: number;
}

export interface AppData {
  current_user_id: ID;
  profiles: Profile[];
  messages: Message[];
  discussions: Discussion[];
  discussion_replies: DiscussionReply[];
  bac_topics: BacTopic[];
  bac_replies: BacReply[];
  study_sessions: StudySession[];
  streaks: Streak[];
}
