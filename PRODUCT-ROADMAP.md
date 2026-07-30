# Outsound — Product Roadmap: Onboarding, Dashboard/Feed & AI Music Agent

Companion doc to `CLAUDE.md` (architecture/conventions) and `SEO-GROWTH-ROADMAP.md` (growth/SEO). This file is the source of truth for *product direction* — read it before proposing onboarding, feed, profile, or AI-agent work, and keep it updated as decisions change. Written so it carries full context into a fresh session or a different model.

## Where we are

- Scan-to-Discover (ACRCloud-backed song scanning) is live and is the app's current first screen (`src/app/(public)/scanner` — see `CLAUDE.md`/`SEO-GROWTH-ROADMAP.md` for scanner implementation state).
- UI is being designed in **OpenDesign**. The first screen (scanner) is done. Next up: dashboard/feed and post-login screens, informed by the onboarding redesign below — see [OpenDesign prompts](#opendesign-prompts-dashboard--post-login) at the bottom.
- Current onboarding (`src/app/(onboarding)`, multi-step wizard tracked by `User.onboardingStep`) is upfront and long. This roadmap replaces it with progressive onboarding (Section 1) — the wizard's fields get migrated into contextual prompts, not deleted outright until the new flow is built and verified.

---

## 1. Onboarding Redesign — Progressive, Not Upfront

**Principle:** Never ask for information before the user has experienced why it's worth giving. Every prompt must unlock something visible immediately.

**Flow:**
1. **Sign up → straight into the scanner.** No profile forms, no interest pickers, no permission walls beyond what's needed to scan (mic). The first scan is the wow moment.
2. **After first successful scan:** small prompt — "Set a username + photo." Two fields max, skippable.
3. **After 2–3 sessions (or on visiting the feed):** prompt — "Are you a musician? Add your instrument and genres to get discovered by musicians nearby." This creates the **musician profile**, which is optional forever.
4. **Contextual asks:** location permission is requested only when the user opens the Nearby feed (with a one-line explanation), Spotify connect only when they open the AI/persona feature.

**Profile tiers:**
- **Minimal profile** (default): username, photo, taste profile built silently from scans. Fully functional app experience.
- **Musician profile** (opt-in, highlighted): instrument(s), genres, city, short bio, audio/video clips (mini portfolio). Gets visual emphasis — badge, clips section on profile card, priority in nearby/discovery for other musicians.

**Remove:** all existing upfront onboarding steps. Migrate any data they collected into the progressive prompts above.

---

## 2. Dashboard / Feed

**Three tabs or filters:**
- **Friends** — scans and posts from people you follow.
- **Nearby** — scans around the user, clustered ("Trending near you tonight", "12 people scanned this within 1km"). Location must be per-scan, opt-in, and coarse (neighborhood-level radius) — never show precise location publicly. Global default in settings.
- **Discover** — public scans and posts ranked by the existing taste-matching system.

**Scan post card:** large album art; track + artist; who scanned; coarse where/when; quick actions: play preview / open in Spotify, save. Tap opens the rich track screen with similarity recommendations.

**Additional post types (keep everything music-anchored; no generic text posts):**
- **Clip posts** — 30–60s recordings of the user playing (primary format for musician discovery).
- **Looking-for posts** — structured: role wanted, genre, city (e.g., "drummer for psych band"), searchable/filterable.
- **Track/playlist shares** — recommend without scanning.

---

## 3. AI Persona + Music Agent

### Data in
- Spotify OAuth: top artists, tracks, genres (verify current API access; audio-features endpoint is restricted — don't depend on it).
- Scan history (strongest signal — weight highest).
- In-app signals: saves, follows, posts.
- Optional: Last.fm connect for serious listeners.

### Persona generation
- An LLM summarizes the above into a structured taste persona: top genres/subgenres, moods, eras, adventurousness, a few descriptive sentences.
- Stored server-side; regenerated periodically (e.g., weekly or after N new scans), **not** per message. Cache aggressively.

### Music chat agent
- Chat screen; each conversation injects the persona + recent scan history into the LLM context.
- Handles conversational discovery: "find me something like X but heavier."
- **Grounding rule:** the LLM converses and reasons; actual track recommendations should be validated/supplemented by the audio-embedding similarity engine so suggestions aren't hallucinated. LLM proposes, embeddings + metadata APIs verify the tracks exist and match.
- Post-scan: AI-generated "you might also like" suggestions on the track result screen (persona + embedding similarity combined).

### Career agent (musician profiles only)
- Same chat, separate mode. Context: instrument, genres, city, clips, activity.
- Scope: practical guidance — release checklists, gigging and local-scene tactics, promotion basics, profile improvement, suggesting collaborators from within the app (via taste/genre/location match).
- **Framing requirement:** present as guidance, not industry authority; no promised outcomes.

---

## 4. Monetization (personalized AI, user pays)

- **Freemium:** free tier = persona + limited agent messages/month + basic recommendations. **Pro subscription** (~$4–8/mo range, decide per market) = unlimited chat, career agent, advanced discovery.
- Prefer subscription over per-message credits (metered chat kills usage psychologically). Credits only if strict pay-per-use is required.
- Cost control: cheap/fast model class for chat and persona generation; cache personas; rate-limit free tier; log per-user token usage from day one.

---

## Build Order

1. Progressive onboarding (cheap, immediately improves activation).
2. Dashboard/feed with scan posts + privacy-safe Nearby.
3. Persona generation + music chat agent (free while validating).
4. Additional post types (clips, looking-for).
5. Career agent mode.
6. Subscription gating once chat engagement is proven.

## Definition of Done

A new user signs up and is scanning within 30 seconds with zero forms; profile details are collected progressively; the feed shows friends/nearby/discover with music-anchored post types; any user can chat with an AI agent that knows their taste from scans/Spotify and gives grounded recommendations; musicians get an optional highlighted profile and career-guidance mode; AI usage is metered and ready to gate behind a subscription.

---

## OpenDesign Prompts (Dashboard & Post-Login)

Use these as starting prompts in OpenDesign, one screen at a time. Each assumes the scanner screen's visual language (already designed) as the base style — dark, music-forward, large album art, minimal chrome — and should stay visually consistent with it. Fill in `[brand tone/colors]` from the scanner screen once locked.

### Prompt A — Post-scan micro-onboarding (username + photo)
> Design a lightweight bottom-sheet or modal that appears once, immediately after a user's first successful song scan. It should feel like a reward moment, not a form: the just-scanned album art still visible/blurred in the background, a short congratulatory line ("Nice find — want to save your scans?"), two inputs max (username, profile photo upload with a default avatar option), a primary "Continue" button and a clear "Skip for now" text link. No progress bar, no multi-step indicator — this is one step only. Match the dark, music-forward aesthetic of the scanner screen.

### Prompt B — Musician opt-in prompt
> Design a single card/modal shown after a user's 2nd–3rd scanning session (or first visit to the feed), asking "Are you a musician?" with a one-line value prop ("Get discovered by musicians nearby"). Two clear paths: a primary CTA "Yes, set up my musician profile" (leads to Prompt C) and a secondary dismiss "Not right now" that never blocks the app. Should feel optional and low-pressure, not a gate.

### Prompt C — Musician profile setup (opt-in, short)
> Design a short form (single screen, not a multi-step wizard) for the opt-in musician profile: instrument(s) multi-select, genre tags multi-select, city (text/autocomplete), short bio (1–2 lines), optional audio/video clip upload. Include a visual preview of how this will appear as a "musician badge" on their profile card. Keep it skippable/editable later — no field should feel mandatory.

### Prompt D — Dashboard / Feed home (the post-login landing screen)
> Design the screen a user lands on immediately after logging in — this replaces the current generic dashboard entirely. Follow the exact visual language already established on the scanner screen (near-black `#0a0a0a` background, coral accent `oklch(62% 0.2 28)`, thin uppercase tracking labels, subtle `white/[0.07]` hairline borders, pill-shaped buttons, italic wordmark logo, radiating waveform/pulse motifs) — this should feel like a continuation of that screen's world, not a different app. It should read as a **live music discovery wall built around scans**, not a generic social feed or an admin-style dashboard with widgets/stat cards.
>
> Structure:
> - **Nav**: desktop — logo left, center Scan/Feed/Discover links, avatar + notifications right; mobile — compact header + persistent bottom tab bar (Feed/Discover/Scan/Profile), consistent with the scanner screen's chrome.
> - **Quick-scan entry point**: a compact, always-visible "Scan a song" affordance near the top (small pulsing bolt button/pill, echoing the big scan button's glow — not the full-screen scanner), since every post in this feed originates from a scan.
> - **Filter row**: Friends / Nearby / Discover as a segmented pill control directly under the quick-scan entry, horizontally scrollable on mobile.
> - **Feed — scan post card** (the primary and default card type): large album art, track + artist, avatar + username of who scanned it, coarse time/place ("Brooklyn · 2h ago"), a small waveform-strip micro-visualization on the card itself (reuse the scanner's bar-waveform motif at small scale), and quick actions (play preview, open in Spotify, save) as icon buttons. Tapping opens the rich track detail screen.
> - **Nearby tab**: show a clustering header above the feed ("12 people scanned this within 1km tonight").
> - **Desktop layout**: feed as a center column (similar width to the scanner's community-scans column), with a right rail showing "Recently scanned by you" and trending scans — echo the existing desktop community-scans list styling for that rail.
> - **Empty state**: a first-time user with nothing in their feed yet should see an inviting prompt to scan or connect with friends, not a blank page — keep it in the same voice as the scanner's own empty/error states.
>
> Deliver both mobile and desktop compositions.

### Prompt E — Nearby location permission prompt
> Design a small, contextual permission prompt shown only when a user first taps the "Nearby" tab — not on app launch. One line explaining why ("See what musicians near you are listening to — we only ever show your neighborhood, never your exact location"), Allow / Not now buttons. Should visually match native OS permission-prompt conventions but styled to the app's theme.

### Prompt F — Track detail / rich result screen
> Design the screen a user lands on after tapping a scan post or completing a scan: large hero album art, track + artist + album, action row (save, share, open in Spotify/Apple Music), an "AI similarity" section below showing 4–6 recommended tracks in a horizontal scroll with short one-line "why this" tags (e.g. "similar tempo & mood"), and a comments/reactions section if viewing a social post rather than a fresh scan.

### Prompt G — AI music chat screen
> Design a chat interface for the music discovery AI agent. Standard chat bubble layout but with music-specific message types: when the AI recommends tracks, render them as small inline card chips (art thumbnail + track/artist, tappable) rather than plain text. Include a persistent input bar with a suggestion chip row above it for common prompts ("Something moodier", "More upbeat", "Like my last scan but acoustic"). Include a subtle "Pro" badge/upsell state design for when a free-tier user hits their monthly message limit — should show remaining messages count, not just block silently.

### Prompt H — Career agent mode (musician profiles only)
> Design a mode-switch within the same chat screen (Prompt G) for musicians: a toggle or segmented control at the top ("Discover" / "Career") that changes the chat's system framing. Career mode's empty state should show a few starter prompt chips specific to musicians ("Help me plan a release", "Local gigging tips", "Find a collaborator near me"). Include a small disclaimer strip ("Guidance, not guarantees") persistently visible in this mode to satisfy the framing requirement — practical guidance, not promised outcomes.

### Prompt I1 — First-visit profile setup ("Are you a musician?" branch)
> Design the single screen shown the first time a user opens their own profile (progressive onboarding, not part of signup). Same dark/coral theme as the rest of the app. One branching question — "Are you a musician?" — presented as two large tappable choice cards (side by side on desktop, stacked on mobile):
> - **"Just here to listen"** → leads to the minimal profile (Prompt I2).
> - **"I'm a musician"** → visually more prominent, coral-badge-accented card → leads to the musician profile setup (Prompt I3).
> Include a "Skip for now" text link that defaults to the minimal profile and is reversible later from settings. No progress bar or step indicator — this is a single, low-pressure, optional decision.

### Prompt I2 — Minimal (normal) profile
> Design the normal/minimal user profile page, mobile + desktop. Header: avatar, display name/username, "Edit profile" button (own profile) or JAM/connect + message buttons (viewing someone else), a simple stats row (scans count, connections count). Below: a grid (desktop) / grid-or-list (mobile) of the user's scanned tracks — album art tiles, reverse-chronological, tapping opens track detail. Deliberately lightweight — no bio, no extra sections. It should still feel complete and non-empty with just an avatar and a scan grid, not like a stripped-down or unfinished version of the musician profile.

### Prompt I3 — Musician profile (the "modern resume")
> Design the musician profile page, mobile + desktop — a visually upgraded tier from the minimal profile, using coral-accent badge treatment to mark it as a musician account. This is the app's version of a musician's resume/EPK. Sections top to bottom:
> - **Header**: avatar/photo, stage name (with real username shown secondary/smaller), musician badge, instrument + genre tag chips, city, short bio, primary action buttons (JAM/connect, message, or "Edit profile" if own).
> - **Social/platform links row**: Instagram, Spotify, YouTube, and similar, as compact icon chips that link out — should read as credibility signals, styled consistently with the rest of the icon language already used in the scanner UI (outline icons, coral on interaction).
> - **Clips/portfolio section** (the centerpiece): horizontally scrollable row (mobile) / grid (desktop) of video/audio performance clips, each a thumbnail with a play-on-tap overlay and duration badge.
> - **Scans section**: the same scan-history grid as the minimal profile (Prompt I2), placed below the portfolio — secondary to it, not competing with it.
> - **Optional "Looking for" pinned card**: if the user has an active looking-for post (e.g. "drummer for psych band"), show it as a small pinned card near the header.
> Desktop: two-column layout — portfolio/clips and links in a wider main column, stats/contact/social rail on the side. Mobile: single column in the same section order.

### Prompt J — Subscription / Pro upsell screen
> Design a single-screen paywall for Pro (not a multi-step checkout flow): clear price ($X/mo), 3–4 benefit rows (unlimited AI chat, career agent access, advanced discovery, ad-free/priority — adjust to actual final feature list), a primary subscribe CTA, and a low-pressure "Maybe later" dismiss. Should feel like an unlock, not a hard wall — reachable from the chat message-limit state (Prompt G) and from the musician profile screen.

### Prompt K — Post-login scanner
> Design the authenticated version of the scan screen. Same core layout and interaction already built on the public scanner screen (center pulsing bolt scan button with radial waveform burst, community-scans list on desktop, recently-scanned strip on mobile) — this is not a redesign, it's the same screen adapted for a signed-in user:
> - Replace the header's "Log in / Sign up free" controls with the user's avatar + a notifications icon.
> - Remove the guest login-required bottom sheet/dialog entirely — a successful scan for a logged-in user posts straight to their profile/feed with no signup wall in the way.
> - Keep the persistent mobile bottom tab bar (Feed/Discover/Scan/Profile) visible here, since authenticated navigation needs it — unlike the guest-facing scanner, which intentionally has none.
> Deliver both mobile and desktop, matching the existing scanner screen's visual language exactly.

---

**Status of this doc:** plan agreed; implementation not yet started. Update the Build Order checkboxes / add a "Progress" section here once coding begins, so this stays the live source of truth alongside `CLAUDE.md`.
