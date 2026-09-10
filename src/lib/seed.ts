import type { AppData } from "./types";

const now = Date.now();
const minutesAgo = (m: number) => new Date(now - m * 60_000).toISOString();
const daysAgo = (d: number) => new Date(now - d * 86_400_000).toISOString();
const isoDay = (d: number) => new Date(now - d * 86_400_000).toISOString().slice(0, 10);

export const CURRENT_USER_ID = "p-you";

export const seedData: AppData = {
  current_user_id: CURRENT_USER_ID,
  profiles: [
    {
      id: CURRENT_USER_ID,
      username: "yasmine",
      display_name: "Yasmine",
      accent: "ember",
      bio: "BAC 2026 · Sciences. Studying a little every single day.",
      created_at: daysAgo(64),
    },
    {
      id: "p-rania",
      username: "rania",
      display_name: "Rania",
      accent: "ice",
      bio: "Philosophy notes and long library nights.",
      created_at: daysAgo(120),
    },
    {
      id: "p-sami",
      username: "sami",
      display_name: "Sami",
      accent: "mint",
      bio: "Maths first, coffee second.",
      created_at: daysAgo(90),
    },
    {
      id: "p-amine",
      username: "amine",
      display_name: "Amine",
      accent: "violet",
      bio: "Physics exercises every evening.",
      created_at: daysAgo(45),
    },
    {
      id: "p-lina",
      username: "lina",
      display_name: "Lina",
      accent: "rose",
      bio: "Languages: Arabic, French, English.",
      created_at: daysAgo(30),
    },
  ],
  messages: [
    {
      id: "m-1",
      author_id: "p-rania",
      content: "Anyone else still on the optics exercises from chapter 4?",
      created_at: minutesAgo(52),
    },
    {
      id: "m-2",
      author_id: "p-sami",
      content: "Yes, part C is brutal. I got 0.42 m for the focal distance.",
      created_at: minutesAgo(48),
    },
    {
      id: "m-3",
      author_id: "p-amine",
      content: "Same answer here. The trick is converting to metres before the formula.",
      created_at: minutesAgo(41),
    },
    {
      id: "m-4",
      author_id: CURRENT_USER_ID,
      content: "Thanks, that was exactly my mistake. Starting a session now.",
      created_at: minutesAgo(33),
    },
    {
      id: "m-5",
      author_id: "p-lina",
      content: "I'm reviewing French verb tenses tonight if anyone wants to join.",
      created_at: minutesAgo(12),
    },
  ],
  discussions: [
    {
      id: "d-1",
      author_id: "p-rania",
      title: "How do you structure a philosophy essay?",
      content:
        "I keep losing points on the plan. My teacher says the problem statement is too vague. This is the structure I use now:\n\n1. Introduction with the problem clearly stated\n2. Thesis with two examples\n3. Antithesis with a real objection\n4. Synthesis that actually answers the question\n\nWhat works for you in the exam?",
      category: "study",
      created_at: daysAgo(1),
    },
    {
      id: "d-2",
      author_id: "p-sami",
      title: "Staying consistent when you're tired",
      content:
        "Some days I open the book and nothing goes in. What helped me: a short honest session instead of a heroic one I never start. Twenty real minutes beats a planned three hours that never happens.",
      category: "motivation",
      created_at: daysAgo(2),
    },
    {
      id: "d-3",
      author_id: "p-amine",
      title: "Difference between momentum and impulse?",
      content:
        "I understand the formulas but I mix them up under pressure. Can someone explain it in one sentence each?",
      category: "questions",
      created_at: daysAgo(3),
    },
    {
      id: "d-4",
      author_id: "p-lina",
      title: "Introduce yourself here",
      content: "New to the group? Say your stream, your subjects and one thing you're working on.",
      category: "general",
      created_at: daysAgo(6),
    },
  ],
  discussion_replies: [
    {
      id: "dr-1",
      author_id: "p-sami",
      discussion_id: "d-1",
      content:
        "I write the problem statement as a real question first, then check that my conclusion answers it word for word.",
      created_at: daysAgo(1),
    },
    {
      id: "dr-2",
      author_id: CURRENT_USER_ID,
      discussion_id: "d-1",
      content: "Keeping one strong example per part instead of three weak ones raised my grade.",
      created_at: minutesAgo(300),
    },
    {
      id: "dr-3",
      author_id: "p-lina",
      discussion_id: "d-2",
      content: "This is why I stopped setting fixed session lengths. I pick the duration by how I feel.",
      created_at: daysAgo(1),
    },
    {
      id: "dr-4",
      author_id: "p-rania",
      discussion_id: "d-3",
      content:
        "Momentum is how much motion a body has. Impulse is how much momentum you gave or took away.",
      created_at: daysAgo(2),
    },
  ],
  bac_topics: [
    {
      id: "t-1",
      author_id: "p-sami",
      subject: "mathematics",
      title: "Integrals: chapter 4 exercise set",
      content:
        "Posting the exercises we did in class with the method for each one. Substitution first, then integration by parts only if substitution fails.",
      created_at: daysAgo(1),
    },
    {
      id: "t-2",
      author_id: "p-amine",
      subject: "physics",
      title: "Wave equations summary sheet",
      content: "One page with every formula we need: period, frequency, wavelength, and the relation between them.",
      created_at: daysAgo(2),
    },
    {
      id: "t-3",
      author_id: "p-rania",
      subject: "philosophy",
      title: "Essay plans for the freedom / determinism question",
      content: "Two full plans, one leaning on Sartre, one on Spinoza. Use them as a skeleton, not a script.",
      created_at: daysAgo(4),
    },
    {
      id: "t-4",
      author_id: "p-lina",
      subject: "french",
      title: "Le conditionnel: quand l'utiliser",
      content: "Résumé court des trois emplois principaux avec des exemples de BAC.",
      created_at: daysAgo(5),
    },
    {
      id: "t-5",
      author_id: "p-lina",
      subject: "arabic",
      title: "النهايات والاتصال: تمارين محلولة",
      content: "تمارين مع الحل خطوة بخطوة، مفيدة للمراجعة قبل الامتحان.",
      created_at: daysAgo(7),
    },
    {
      id: "t-6",
      author_id: CURRENT_USER_ID,
      subject: "natural_sciences",
      title: "Immunology vocabulary I keep forgetting",
      content: "A short list of the terms that cost me marks in the last test, with definitions in my own words.",
      created_at: daysAgo(8),
    },
  ],
  bac_replies: [
    {
      id: "br-1",
      topic_id: "t-1",
      author_id: CURRENT_USER_ID,
      content: "Exercise 7 is the one worth redoing twice. Thank you for the method notes.",
      created_at: minutesAgo(180),
    },
    {
      id: "br-2",
      topic_id: "t-2",
      author_id: "p-sami",
      content: "Printing this. Could you add the damped oscillation case?",
      created_at: daysAgo(1),
    },
    {
      id: "br-3",
      topic_id: "t-3",
      author_id: "p-amine",
      content: "The Spinoza plan helped me a lot last week.",
      created_at: daysAgo(3),
    },
  ],
  study_sessions: [
    {
      id: "s-1",
      profile_id: CURRENT_USER_ID,
      subject: "physics",
      planned_seconds: 2700,
      elapsed_seconds: 2700,
      started_at: minutesAgo(200),
      ended_at: minutesAgo(155),
      completed: true,
    },
    {
      id: "s-2",
      profile_id: CURRENT_USER_ID,
      subject: "mathematics",
      planned_seconds: 3600,
      elapsed_seconds: 2340,
      started_at: minutesAgo(120),
      ended_at: minutesAgo(81),
      completed: false,
    },
    {
      id: "s-3",
      profile_id: CURRENT_USER_ID,
      subject: "philosophy",
      planned_seconds: 1800,
      elapsed_seconds: 1800,
      started_at: daysAgo(1),
      ended_at: daysAgo(1),
      completed: true,
    },
  ],
  streaks: [
    {
      profile_id: CURRENT_USER_ID,
      current_streak: 12,
      longest_streak: 18,
      last_study_date: isoDay(0),
      total_seconds: 137_400,
    },
    { profile_id: "p-rania", current_streak: 27, longest_streak: 41, last_study_date: isoDay(0), total_seconds: 0 },
    { profile_id: "p-sami", current_streak: 14, longest_streak: 22, last_study_date: isoDay(0), total_seconds: 0 },
    { profile_id: "p-amine", current_streak: 6, longest_streak: 9, last_study_date: isoDay(1), total_seconds: 0 },
    { profile_id: "p-lina", current_streak: 21, longest_streak: 21, last_study_date: isoDay(0), total_seconds: 0 },
  ],
};
