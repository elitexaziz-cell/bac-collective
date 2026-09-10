# BAC Study Hub

Build a polished responsive web app called "BAC COMMUNITY".

IMPORTANT:

- This is the first UI/frontend phase.

- Focus on a complete, polished and functional frontend prototype.

- Do NOT create a separate application.

- Do NOT add unnecessary complexity.

- Do NOT spend time building a backend or database yet.

- We will connect Supabase later.

- Keep the architecture clean and ready for Supabase integration.

- Do not use fake functionality or fake buttons.

- Use realistic local state/mock data only where necessary for the prototype.

- Do not hard-code the final database architecture.

PURPOSE:

BAC COMMUNITY is a study community for BAC students.

Students can chat, create discussions, share BAC topics and track their personal study streak and timer.

MAIN NAVIGATION:

- 🏠 Home

- 💬 Group Chat

- 🧠 Discussions

- 🎓 BAC Topics

- 👤 Profile

HOME:

Create a clean dashboard showing:

- Welcome message

- User avatar and username

- 🔥 Current study streak

- Today's study time

- Start Studying button

- Recent discussions

- Recent BAC topics

- Quick access to Chat

GROUP CHAT:

Create a modern Discord-like but much simpler group chat:

- Message list

- Avatar

- Username

- 🔥 streak beside username

- Message time

- Message input

- Send button

- Responsive mobile layout

DISCUSSIONS:

Users can create and view discussion posts.

Each post has:

- Title

- Content

- Category

- Author

- 🔥 streak

- Date

- Reply count

Categories:

- General

- Study

- Motivation

- Questions

Post page:

- Full post

- Replies

- Reply input

BAC TOPICS:

Create a separate section specifically for BAC topics.

Subjects:

- Mathematics

- Physics

- Natural Sciences

- Arabic

- French

- English

- Philosophy

- History & Geography

- Islamic Studies

Users can:

- Create a BAC topic

- Select subject

- Add title/content

- View topic

- Reply

PROFILE:

Create a personal profile page containing:

- Avatar

- Username

- 🔥 Current streak

- Longest streak

- Total study time

- Number of posts

- Number of replies

Keep personal study statistics private.

STUDY TIMER:

Add a personal study timer accessible from Home/Profile.

Features:

- Select subject

- Choose custom duration

- Start

- Pause

- Resume

- Stop

- Countdown

- Progress indicator

IMPORTANT:

- Never force Pomodoro.

- Never force 25/30/45 minutes.

- User controls the duration.

- Timer data should be structured so Supabase can store sessions later.

STREAK:

Create a simple personal study streak system.

- Increase when the user completes a valid study session/day.

- Current streak

- Longest streak

- Never count the same day twice.

- Show 🔥 streak beside username in Chat and Discussions.

- Keep detailed study data private.

SEARCH:

Add a simple global search for:

- Discussions

- BAC topics

DESIGN:

- Modern

- Clean

- Student-focused

- Dark/light mode

- Smooth but subtle animations

- Responsive desktop/tablet/mobile

- No horizontal overflow

- Excellent typography

- Clear visual hierarchy

- Make studying feel motivating, not stressful.

LANGUAGES:

Prepare the UI for:

- Arabic

- English

- French

Arabic must support proper RTL.

DATA ARCHITECTURE:

For this phase, use clean frontend state/local persistence only where needed.

Structure the data models clearly so they can later be connected to Supabase:

- profiles

- messages

- discussions

- discussion_replies

- bac_topics

- bac_replies

- study_sessions

- streaks

Do NOT implement authentication or Supabase yet.

FINAL REQUIREMENT:

Before finishing:

- Check all pages.

- Check navigation.

- Check responsive layouts.

- Check dark/light mode.

- Check Arabic RTL.

- Fix TypeScript/build errors.

- Make sure every visible interaction works in the frontend prototype.

Build the complete frontend now.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c122194a-4ccc-4aea-b321-d6d63191cdcd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
