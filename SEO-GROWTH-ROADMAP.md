# Outsound — SEO, Guest-Access & Growth Roadmap

A working checklist for the rebrand + growth push. Pick items off one at a time; each is scoped to be doable independently, but the ordering below is the sane sequence (rebrand → guest access → SEO infra → content → Google presence), since later items assume earlier ones exist.

Decisions already locked in:
- **Brand**: renaming the product to **Outsound** (outsound.in) — touches package.json, site metadata, nav/logo, JSON-LD `Organization` name.
- **Guest scanning**: capped free scans per device/IP (exact number TBD when we build it, e.g. 3), then a sign-up wall — not unlimited/anonymous-only.
- **Google presence**: both Search Console/Analytics (standard SEO infra) *and* a Google Business Profile.

---

## Phase A — Rebrand to Outsound

- [ ] Rename in `package.json` (`name` field), update `<title>`/site metadata default, nav/logo text, any hardcoded "rekurd" strings in UI copy or emails
- [ ] Update `CLAUDE.md` project name/description to Outsound
- [ ] Decide on logo/wordmark treatment (can stay text-based initially; flag if you want a real logo designed)

## Phase B — Guest-accessible scanner (the "get value before signup" flow)

This directly changes the already-approved `/api/scan` design (previous plan required auth via `validateRequest()` — that assumption needs revisiting here).

- [ ] Design the anonymous-usage model: device/session identifier (signed cookie, not just IP — IPs are shared/NAT'd and easy to churn) + IP as a secondary signal, both tracked server-side against a scan-count cap
- [ ] Decide + implement the free-scan cap (e.g. 3 lifetime or 3/day — needs a call) and what happens exactly at the cap: hard block with signup CTA, or let them see a blurred/partial result to create desire before the wall
- [ ] Rework the root route (`/`) so unauthenticated visitors land directly on a functional scanner, not a static marketing splash — likely the existing `(auth)/landing` becomes secondary or gets merged into the new guest-scan landing experience
- [ ] Preserve the just-scanned result across the sign-up flow (don't make signing up feel like it threw away what they just got) — e.g. stash the scan/track id in the post-signup redirect or session
- [ ] Migrate anonymous scan usage to the authenticated user's account on signup (nice-to-have, ties into future scan-history feature)
- [ ] Separate rate-limit path for guests vs. the per-user `Scan` table limiter already planned for authenticated users (different abuse profile — anonymous is higher risk)

## Phase C — SEO infrastructure

- [ ] `src/app/sitemap.ts` (Next.js dynamic sitemap convention) — only public/crawlable routes (landing, public user profiles if applicable, any public track/artist pages once they exist); exclude authenticated-only app screens
- [ ] `src/app/robots.ts` — allow public pages, disallow feed/notifications/settings/chats/radio-moderator/api routes
- [ ] Audit every route for `generateMetadata` (title, description, canonical, Open Graph, Twitter card) — currently inconsistent; landing and any new public pages need this most
- [ ] JSON-LD structured data: sitewide `Organization`/`WebSite` schema, `SoftwareApplication` (or `WebApplication`) schema for the scanner tool itself, `MusicRecording`/`MusicGroup` schema on track-result and artist pages (strong natural fit for this content), `BreadcrumbList` where nesting exists
- [ ] SSR audit: confirm the landing page and any new public/marketing pages render meaningful HTML on the server (not client-only shells) — verify via "view source", not just the rendered DOM
- [ ] Core Web Vitals basics: image optimization pass (`next/image` everywhere, check that `floating_7.jpg` 2.56MB asset flagged during the build), font loading strategy, confirm the PWA service worker isn't interfering with first-load indexing
- [ ] `manifest.json` completeness (icons at all required sizes, correct name/short_name — ties into Phase A rebrand)

## Phase D — More landing/content pages (SEO surface area)

- [ ] Content plan: what pages actually deserve to exist and rank (e.g. a dedicated `/scanner` explainer page, `/radio` public page, `/discover` public-facing version, genre or "for musicians" landing variants) — this needs a real content decision, not just infra; flag when ready to scope it
- [ ] Each new page needs its own metadata + JSON-LD per Phase C, not bolted on after

## Phase E — Google presence & marketing

- [ ] Google Search Console: verify domain ownership, submit the sitemap once Phase C lands
- [ ] Google Analytics (GA4) — decide analytics approach (GA4 vs. a privacy-friendlier alternative) before wiring in
- [ ] Google Business Profile: setup requires an account you own and real-world verification (phone/postcard/video) — this is account-ownership work I can't do on your behalf, but I can prep the listing content (name, category, description, logo/photos) once Phase A branding is settled
- [ ] Reality check to keep in mind: Business Profile is built for entities with a local/physical or "real business" presence — for a pure web app it's allowed under a Software/SaaS-ish category, but it won't itself move organic rankings much; the actual ranking lever is Phase C/D (content + technical SEO), Business Profile mainly helps if/when there's a real-world entity (office, events, local search intent) to anchor it to

---

**"Rank #1 on Google" reality check**: there's no infra step that guarantees a ranking position — Phases C/D build the technical and content foundation that makes ranking *possible*, but actual rank depends on content quality, backlinks, and competition over time. Worth knowing going in so we're optimizing for "solid, correct SEO foundation" as the deliverable, not a guaranteed outcome.
