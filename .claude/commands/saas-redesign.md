---
description: Redesign the Vue 3 UI into a modern SaaS layout with a left vertical sidebar, consistent spacing, and polished visual styling.
---

# SaaS UI Redesign

Transform the application's UI into a modern SaaS-style interface: replace the top navigation with a **fixed vertical sidebar on the left**, apply a consistent spacing/typography scale, and give every view a polished, professional finish.

This is a **visual/layout refactor only** — do not change routes, API calls, component logic, or data flow.

---

## 1. Audit the current layout

Read these files to understand what exists before changing anything:

- `client/src/App.vue` — current shell, nav, and global styles
- `client/src/main.js` — route definitions (these become sidebar items)
- `client/src/views/*.vue` — scan page-level padding/headers for consistency gaps
- `client/src/components/FilterBar.vue` and any header/nav components

Note: which routes exist, where global CSS variables live, and whether views hard-code their own page padding.

---

## 2. Target design system

Apply these tokens as CSS custom properties in `App.vue` (`:root` or top-level style block) so every component inherits them.

**Spacing scale (4px base):**
```
--space-1: 4px   --space-2: 8px    --space-3: 12px
--space-4: 16px  --space-5: 24px   --space-6: 32px
--space-7: 48px  --space-8: 64px
```

**Layout:**
```
--sidebar-width: 248px
--topbar-height: 60px        /* slim utility bar above content, optional */
--content-max-width: 1400px
--page-padding: var(--space-6)
--radius-sm: 6px   --radius-md: 10px   --radius-lg: 14px
```

**Color (keep the existing slate palette, extend only as needed):**
```
--bg-app: #f8fafc        --bg-surface: #ffffff
--bg-sidebar: #0f172a    --text-sidebar: #cbd5e1   --text-sidebar-active: #ffffff
--border: #e2e8f0        --text: #0f172a           --text-muted: #64748b
--accent: #2563eb        --accent-soft: #eff6ff
```

**Typography:**
```
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
--text-xs: 12px   --text-sm: 13px   --text-base: 14px
--text-lg: 16px   --text-xl: 20px   --text-2xl: 28px
font-weight: 400 body / 500 labels / 600 headings
```

**Elevation:**
```
--shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.06)
--shadow-md: 0 4px 12px rgba(15, 23, 42, 0.08)
```

---

## 3. Target layout structure

`App.vue` template should become a two-column shell:

```
┌──────────────┬─────────────────────────────────────┐
│              │  (optional slim topbar: page title, │
│   SIDEBAR    │   profile menu, language switcher)  │
│   fixed      ├─────────────────────────────────────┤
│   248px      │                                     │
│              │   <router-view />                   │
│  - logo      │   padding: var(--page-padding)      │
│  - nav list  │   background: var(--bg-app)         │
│  - footer    │                                     │
│    (profile) │                                     │
└──────────────┴─────────────────────────────────────┘
```

**Sidebar requirements:**
- Fixed position, full viewport height, `width: var(--sidebar-width)`
- Dark background (`--bg-sidebar`), light text
- Logo/app name at top with `--space-5` padding
- One `<router-link>` per route; vertical list, `--space-2` gap
- Nav item: `padding: 10px 14px`, `border-radius: var(--radius-sm)`, icon + label
- Active state via `.router-link-active`: `background: rgba(255,255,255,0.08)`, `color: var(--text-sidebar-active)`, optional 3px accent left border
- Hover: `background: rgba(255,255,255,0.04)`
- Profile/utility controls pinned to the bottom with `margin-top: auto`

**Main content area:**
- `margin-left: var(--sidebar-width)`, `min-height: 100vh`
- Each view gets a consistent page header: `<h1>` at `--text-2xl/600` + optional subtitle at `--text-sm/--text-muted`, `margin-bottom: var(--space-5)`
- FilterBar sits directly under the page header, not in the sidebar

**Cards & tables (apply globally):**
- Card: `background: var(--bg-surface)`, `border: 1px solid var(--border)`, `border-radius: var(--radius-md)`, `padding: var(--space-5)`, `box-shadow: var(--shadow-sm)`
- Table: header row `--text-xs uppercase --text-muted`, rows `border-top: 1px solid var(--border)`, row padding `var(--space-3) var(--space-4)`

---

## 4. Implement (delegate to vue-expert)

Per project rules, **all `.vue` file creation/modification MUST go through the `vue-expert` subagent**. Send it a single, complete brief — do not drip-feed.

Spawn `vue-expert` with a prompt that includes:
1. The full design-token block from §2 (verbatim)
2. The layout structure from §3
3. Explicit file-by-file instructions:
   - **`client/src/App.vue`** — replace top nav with the sidebar+main shell; add all CSS custom properties to the global `<style>`; move ProfileMenu/LanguageSwitcher into sidebar footer or slim topbar
   - **`client/src/components/AppSidebar.vue`** *(new)* — extract the sidebar into its own component; build nav links from the route list; use `<router-link>` with active styling
   - **Each `client/src/views/*.vue`** — normalize the outer wrapper: remove ad-hoc page padding (the shell now owns it), ensure a consistent `<header class="page-header">` block, convert top-level panels to the shared `.card` style
   - **`client/src/components/FilterBar.vue`** — restyle to sit on `--bg-surface` with `--radius-md` and `--space-4` internal padding; align control heights
4. Constraints: no logic changes, no route changes, no emoji, keep `<script setup>` blocks intact, preserve all existing functionality

After vue-expert returns, **read the diff yourself** — confirm tokens were added, sidebar exists, and views were normalized.

---

## 5. Verify in the browser

Use Playwright MCP against `http://localhost:3000`:

1. Navigate to `/` and take a screenshot — confirm sidebar is rendered on the left, content is offset correctly, no horizontal scroll
2. Click each sidebar link — confirm `.router-link-active` styling applies and the correct view loads
3. Navigate to `/inventory` and `/orders` — confirm FilterBar still works and tables render inside cards
4. Resize viewport to 1280px and 1680px — confirm content padding stays consistent and nothing overlaps the sidebar
5. Check browser console for errors

If any view looks broken (double padding, missing header, content under sidebar), send a follow-up fix to vue-expert with the specific file and screenshot description.

---

## 6. Report

Summarize in ≤6 bullets: files changed, new component(s) added, design tokens introduced, any views that needed special handling, and screenshot confirmation.
