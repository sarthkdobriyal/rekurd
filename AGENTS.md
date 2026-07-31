<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes_tool` or `query_graph_tool` instead of Grep
- **Understanding impact**: `get_impact_radius_tool` instead of manually tracing imports
- **Code review**: `detect_changes_tool` + `get_review_context_tool` instead of reading entire files
- **Finding relationships**: `query_graph_tool` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview_tool` + `list_communities_tool`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
| ------ | ---------- |
| `detect_changes_tool` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context_tool` | Need source snippets for review — token-efficient |
| `get_impact_radius_tool` | Understanding blast radius of a change |
| `get_affected_flows_tool` | Finding which execution paths are impacted |
| `query_graph_tool` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes_tool` | Finding functions/classes by name or keyword |
| `get_architecture_overview_tool` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes_tool` for code review.
3. Use `get_affected_flows_tool` to understand impact.
4. Use `query_graph_tool` pattern="tests_for" to check coverage.


<claude-mem-context>
# Memory Context

# [rekurd] recent context, 2026-07-31 1:23am GMT+5:30

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 50 obs (18,539t read) | 336,326t work | 94% savings

### Jul 30, 2026
1217 3:44a 🟣 Implemented login-required UI flow with auto-dialog trigger
1218 " ✅ Dialog close handler resets scanner on login-required dismissal
1219 3:47a ✅ Service errors now count against guest/user scan quota
1223 4:01a 🔵 Scanner results not rendering in UI despite successful API responses
1224 " 🔵 TrackResult component structure expects ScannedTrack data with complete metadata
1225 " 🔵 Scanner page data flow: track state passed to ScannerCenter component
1226 4:02a 🔴 Added isResultState helper to conditionally render result screens
1227 4:03a 🔴 Implemented responsive layout switching for result display using conditional positioning
1240 11:15p ⚖️ Product roadmap defined: progressive onboarding, dashboard/feed, and AI music agent
1241 11:19p 🔵 Scanner page implementation examined to inform progressive onboarding architecture
1242 11:20p 🔄 Waveform bars refactored from linear to radial circular layout around scan button
1243 11:25p 🔄 Waveform bars visualization tuned: increased count, added envelope and jitter for organic appearance
1244 " 🔄 Waveform reverted to linear horizontal layout with bell-curve envelope preserved
S582 Product roadmap documentation, scanner waveform UI polish through iterative refinement—created comprehensive feature specifications, documented product direction, explored and refined waveform visualization across four layout/scaling iterations. (Jul 30, 11:26 PM)
1245 11:26p ✅ Waveform height range expanded for greater visual prominence
S583 Move waveform bars upward on scanner interface (Jul 30, 11:27 PM)
1246 11:37p ✅ Waveform bars repositioned upward
S584 Create plan documentation for app evolution and implement responsive design adjustments for the scanner page component (Jul 30, 11:41 PM)
S585 Design system refactor: migrate app colors to OKLCH and consolidate mobile navigation (Jul 30, 11:41 PM)
1247 11:43p 🔵 Project Color System Configuration in globals.css
1248 " 🔵 Scanner Page Waveform Animation Already Implemented
1249 " 🔵 Tailwind Color System Architecture Maps CSS Variables
1250 11:44p 🔵 Project Typography System and UploadThing Integration
1251 " ✅ Migrated Primary and Ring Colors from HSL to OKLCH Color Space
1252 " ✅ Migrated Accent Color from HSL to OKLCH Color Space
1253 11:45p ✅ Converted Color Variables from HSL to OKLCH Format in globals.css
1254 " 🔄 Removed Mobile Navigation from Scanner Page
S586 Design system consolidation and mobile viewport fixes for scanner page (Jul 30, 11:45 PM)
1255 11:48p 🔵 Project Uses Tailwind CSS v3.4.1
1256 11:49p ✅ Fixed Mobile Viewport Height Using dvh Unit
S587 Refine and expand OpenDesign prompts in PRODUCT-ROADMAP.md for dashboard, profile screens (with two tiers), and post-login scanner to enable professional design handoff with complete specifications and design system consistency. (Jul 30, 11:49 PM)
### Jul 31, 2026
1257 12:01a 🔵 Comprehensive design roadmap with 10 detailed UI/UX prompts exists for all major screens
1258 " ✅ Dashboard design spec expanded with detailed visual language and platform-specific layouts
1259 12:02a ⚖️ Profile flow split into three screens with progressive branching and musician EPK reframing
1260 " ✅ Post-login scanner screen variant specified with minimal auth-aware modifications
S590 Plan post-authentication user routing: determine where users land after signup/login from scanner modal vs. direct login, and redesign onboarding from mandatory gate to progressive overlays. (Jul 31, 12:02 AM)
1261 12:09a 🔵 Onboarding routing present in authentication flows
1262 " 🔵 Onboarding redirect logic and conditional routing based on completion status
1263 " 🔵 Main app route structure mapped
1264 " 🔵 Setup-profile page discovered as alternative post-auth flow
S591 Redesign authentication user journey: eliminate mandatory onboarding gate, implement seamless modal-based auth from scanner page, and preserve guest scan history when users authenticate mid-scan (Jul 31, 12:10 AM)
1265 12:11a 🔵 Complete authentication redirect logic examined
1266 12:12a 🔵 Song scanner hook handles login-required state for modal auth
1267 12:13a 🔵 Scan API implements guest tracking and login-required flow for scan limit
1268 " 🟣 Guest-scan-to-account migration utility implemented
1269 12:14a 🔄 Consolidated GUEST_ID_COOKIE constant to guest-scan utility
1270 " ✅ Signup action modified to skip onboarding redirect and migrate guest scans
1271 " ✅ Login action modified to remove onboarding gate and migrate guest scans
1272 12:15a ✅ LoginForm refactored to support both modal and direct login flows
1273 " ✅ SignUpForm refactored to support both modal and direct signup flows
1275 " ✅ Google OAuth callback imports guest scan migration and reads post-auth redirect destination
1276 12:16a ✅ Google OAuth callback for existing users: removed onboarding gate, added guest scan migration, uses dynamic redirect
1277 " ✅ Google OAuth callback for new users: removed onboarding gate, added guest scan migration, uses dynamic redirect
1278 " ✅ GoogleSignInButton now accepts optional next prop for post-auth redirect
1279 " ✅ Scanner page AuthContent wired to support modal auth flow with guest scan migration
1280 12:17a ✅ Scanner page added handleAuthenticated callback for modal auth success
S594 Confirm code-review-graph integration was successfully added to rekurd project (Jul 31, 12:17 AM)
1293 1:22a 🟣 Code-review-graph MCP integration added and operational
1294 1:23a ✅ Code-review-graph incrementally updated and synchronized to HEAD
S595 Confirm code-review-graph integration and synchronize graph to current HEAD commit (Jul 31, 1:23 AM)
**Investigated**: Verified code-review-graph MCP tool availability; checked graph status, node/edge statistics, and commit alignment; executed incremental update scan against HEAD

**Learned**: Graph incremental update mechanism scans all changed files but only mutates nodes/edges if source code changed. Post-processing pipeline (signatures, FTS indexing, flow detection, community detection, summaries) completes in ~57ms. The 33 files that changed since last build were all configuration/documentation (AI tool integrations, GitHub Actions, IDE settings, linting rules, MCP configs, project documentation) — no source code changes detected. Graph structure remains stable at 689 nodes, 5198 edges across 250 files.

**Completed**: Code-review-graph confirmed operational and fully indexed rekurd project. Incremental update successfully synchronized graph to HEAD commit (4040d757b451b97e1dd30f888454b3e0314b4488). Graph age now zero seconds and head_matches_build flag set to true. All post-processing phases completed successfully. Graph ready for change detection and impact analysis on future source code commits.

**Next Steps**: Graph is current and operational. Awaiting future source code changes or user requests to perform code review tasks (detect_changes, get_affected_flows, get_review_context, get_architecture_overview, etc.). Optional: enable semantic search by computing vector embeddings.


Access 336k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>