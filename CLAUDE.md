# rekurd — Project Guide

A social network for musicians ("JAM" connections instead of "follow"): posts, live radio station with a moderated song queue, real-time chat, geolocation-based discovery, and an AI songwriting assistant.

> Note: the repo's `README.md` is leftover React Native boilerplate from `@react-native-community/cli` and does not describe this project. Ignore it — this file is the source of truth. Consider deleting the README or replacing it.

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Database**: PostgreSQL (Supabase-hosted) via Prisma ORM 5, with the `postgis` extension for geolocation and `uuid-ossp`
- **Auth**: Lucia Auth v3 (session cookies) — username/password and Google OAuth (via `arctic`)
- **Styling/UI**: Tailwind CSS, shadcn/ui (Radix primitives), Ant Design (`antd`) for some components, Framer Motion, Lenis smooth scroll
- **State/data fetching**: TanStack Query (React Query)
- **File uploads**: UploadThing v7
- **Real-time**: Socket.IO — implemented via the Next.js **Pages Router** API (`src/pages/api/web-socket/*`), since the App Router doesn't support long-lived socket servers
- **AI**: Replicate API (LLM-backed songwriting/creativity chatbot)
- **PWA**: `@ducanh2912/next-pwa`, service worker generated at build time
- **Rich text**: Tiptap (post editor)

## Project Structure

The app uses Next.js route groups to separate concerns:

- `src/app/(auth)` — landing, login, signup, logout action, Google OAuth login redirect
- `src/app/(onboarding)` — multi-step profile setup wizard (instruments, genres, bio, avatar, location) after signup
- `src/app/(main)` — the authenticated app shell: feed/posts, user profiles, discover, search, bookmarks, notifications, radio, AI chatbot
- `src/app/(messaging)` — 1:1 chat/conversations
- `src/app/api/*` — App Router REST-style route handlers (posts, likes, comments, bookmarks, connections, notifications, uploadthing, genres/instruments seed data, nearby-user search)
- `src/pages/api/web-socket/*` — **Pages Router** API routes hosting the Socket.IO server (`io.ts`) and radio/chat/message event handlers. This split exists because Socket.IO needs a persistent Node server instance that the App Router's route handlers can't provide.
- `prisma/schema.prisma` — data model (see below)

## Data Model (Prisma)

Core entities: `User`, `Session` (Lucia), `Post`/`Media`/`Like`/`Comment`/`Bookmark`, `Connection` (JAM requests — `PENDING`/`CONNECTED`, replaces "follow"), `Follow` (legacy/parallel model, appears unused by current connection UI — verify before removing), `Notification` (`LIKE`/`FOLLOW`/`COMMENT`/`ACCEPT_CONNECTION`), `Conversation`/`Message` (chat), `MusicalInfo`/`Instrument`/`Genre` (musician profile data), `UserContact`/`SocialLink`, `UserLocation` (PostGIS `geography(Point,4326)` for nearby-user discovery), and the radio subsystem: `RadioModerator`, `RadioSongRequest`, `RadioQueue`, `RadioPlaybackState`, `RadioChatMessage`.

## Features (working as of the Next 15 / React 19 upgrade)

- **Auth**: email+password signup/login (Argon2 password hashing via `@node-rs/argon2`), Google OAuth, session-cookie auth via Lucia, logout
- **Onboarding**: 6-step profile wizard tracked by `User.onboardingStep`
- **Posts**: create/edit posts with rich text (Tiptap) + image/video attachments (UploadThing), like, comment, bookmark, infinite-scroll feeds ("for you" / "following")
- **Connections ("JAM")**: send/accept/reject connection requests between users, connection counts, pending-request UI
- **Notifications**: like/follow/comment/accept-connection notifications with read/unread state
- **Discover / Search**: browse artists, text search
- **Nearby users**: PostGIS-backed geolocation search (`/api/find-nearby-users`)
- **Messaging**: 1:1 conversations backed by Socket.IO for live delivery
- **Radio**: a shared live "station" — users submit songs (uploaded via UploadThing), moderators approve/queue/reorder/skip tracks, playback state and listener chat are synced in real time over Socket.IO
- **AI Chatbot**: Replicate-backed songwriting/creativity assistant (`/api/ai-chat` and `/(main)/ai-chatbot`)
- **PWA**: installable, offline-capable via generated service worker

## External Services / Connections

All configured via `.env` (see `.env` for current values — **never commit real secrets or paste them into chat/docs**):

| Service | Env vars | Purpose |
|---|---|---|
| Supabase Postgres | `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL` | Primary database (pooled + direct connection for Prisma migrations) |
| UploadThing | `UPLOADTHING_SECRET`, `UPLOADTHING_APP_ID`, `NEXT_PUBLIC_UPLOADTHING_APP_ID` | Post media, avatars, radio song file uploads |
| Google OAuth | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | "Sign in with Google" |
| Replicate | `REPLICATE_API_TOKEN` | AI chatbot completions |
| Geocoding API | `NEXT_PUBLIC_GEOCODING_API` | Resolving/reverse-geocoding user location for nearby-user search |
| App | `NEXT_PUBLIC_BASE_URL`, `NODE_ENV`, `CRON_SECRET` | Base URL for absolute links/redirects; secret to authorize scheduled/cron-triggered routes |

## Conventions & Notes for Future Work

- **Route handler params/searchParams and `cookies()`/`headers()` are async** (Next.js 15 requirement) — always `await` them. This was the biggest source of breakage during the framework upgrade; new dynamic routes must follow the same pattern (`{ params }: { params: Promise<{...}> }`, then `await params`).
- Dynamic route folder names must match the param name destructured in the handler (a mismatch — `[userId]` folder vs. `followerId` param — was found and fixed in `src/app/api/users/[userId]/connection/route.ts`).
- React 19 type changes to be aware of: `JSX.Element` must come from `React.JSX.Element` (or `import type { JSX } from "react"`), and `useRef<T>(null)` now types as `RefObject<T | null>`, not `RefObject<T>`.
- Socket.IO logic intentionally lives under `src/pages/api/web-socket/`, not `src/app/api/`. Don't try to migrate it to the App Router without a real reason — App Router route handlers are stateless/serverless-friendly and don't support a persistent `io` server instance.
- `stream-chat` / `stream-chat-react` were removed from dependencies — they were unused leftovers from an earlier messaging approach; the app rolled its own chat with Prisma + Socket.IO instead.
- The project mixes shadcn/ui (Radix-based) and Ant Design for UI — no strong convention yet on when to use which; check the surrounding component before introducing a third UI kit.
- `prisma` is pinned at v5 (v7 is available upstream) and `@lucia-auth/adapter-prisma`/`lucia` v3 are both deprecated upstream in favor of Lucia's newer "roll your own" guidance — fine to leave as-is for now, but worth knowing before adding new auth features.

## Standing Working Guidelines (always apply, every session)

This project is moving toward production. These rules are not optional per-task suggestions — apply them by default on every change, without being asked again:

- **Security first, no exceptions.** Never compromise security for convenience or speed. Treat every user-facing input (form fields, query params, route params, headers, uploaded files, webhook payloads, third-party API responses) as untrusted.
- **Strict input validation everywhere.** Use `zod` (already a dependency) to validate and parse all API route handler bodies/params/query strings and all Server Action inputs at the boundary — never trust client-sent data, including values that "should" be safe (IDs, enums, numeric ranges). Reject and return a clear error rather than coercing silently.
- **Auth/authorization on every mutation.** Every route handler and Server Action that reads or writes user data must call `validateRequest()` and check ownership/permissions (not just "is logged in") before acting — mirror the existing pattern in `src/app/api/*/route.ts`.
- **Standard web vulnerability classes to actively guard against**: SQL injection (Prisma parameterizes by default — never drop to raw SQL without parameterization), XSS (sanitize/escape any user content rendered as HTML, especially rich-text/Tiptap output), SSRF (validate/allowlist any server-side outbound URL built from user input, e.g. proxying playlist/track links), IDOR (always scope Prisma queries by the authenticated user's ID, don't just trust an ID from the URL), unrestricted file upload (validate file type/size server-side, not just via UploadThing's config), secrets exposure (never log secrets, never put non-`NEXT_PUBLIC_` env vars in client code), and rate limiting on expensive or abusable endpoints (auth, scanning/fingerprinting, AI calls).
- **UI/UX is a first-class deliverable, not an afterthought.** Every new feature needs real states designed and implemented: loading, empty, error, and success — not just the happy path. Prefer optimistic UI where it's safe (e.g. likes/bookmarks pattern already in the codebase) and give explicit feedback for slow/async operations (scanning, AI calls, uploads).
- **When a task is large or has real architectural decisions** (new external APIs, schema changes, cost-bearing services), propose a plan and get alignment before writing code, rather than guessing silently.

## Common Commands

```bash
npm run dev      # start dev server
npm run build    # production build (also runs prisma generate via postinstall)
npm run start    # run production build
npm run lint     # eslint
npx prisma studio        # browse the database
npx prisma migrate dev   # create/apply a migration after schema changes
```
