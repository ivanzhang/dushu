# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**墨潮小说** (MoChao Novel) — a static front-end novel/fiction website template. Pure HTML/CSS/JS with no build tools, no framework, and no backend. All data is client-side mock data; state (subscriptions, orders, reader preferences) is persisted in `localStorage`.

## Development

No build step. Open any `.html` file directly in a browser, or serve with any static server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

There are no tests, linters, or package managers configured.

## Architecture

### Pages (all top-level `.html` files)

Each page sets `data-page="<name>"` on `<body>` for nav highlighting. Pages share a common header/nav/footer structure (duplicated, not templated).

| Page | Purpose |
|---|---|
| `index.html` | Homepage — hero, featured books, new books |
| `category.html` | Category browsing with filter chips |
| `book.html` | Book detail + chapter catalog (paywall on ch7+) |
| `reader.html` | Chapter reader with font/theme/progress controls |
| `bookshelf.html` | User's reading list with progress bars |
| `login.html` | Login/register tabs (UI only, no real auth) |
| `subscription.html` | Membership tier selection (3 paid plans) |
| `checkout.html` | Payment simulation (`?plan=starter|plus|pro`) |
| `payment-success.html` / `payment-failed.html` | Post-payment result pages (`?order=<id>`) |
| `orders.html` | Order history table from localStorage |

### Assets (`assets/`)

- **`mock-data.js`** — `window.NovelSiteData` global: 6 sample books, chapter titles, chapter content, ranking list. Loaded first on every page.
- **`main.js`** — Single IIFE containing all page logic. Detects current page via `document.body.dataset.page` and runs relevant render functions. Key systems:
  - **Subscription/commerce**: `SUBSCRIPTION_PLANS` array, `getCurrentPlan()`/`setCurrentPlan()` backed by localStorage, `canAccess(level)` for paywall gating.
  - **Order management**: `createOrder()`/`addOrder()`/`readOrders()` — localStorage-based order CRUD.
  - **Reader controls**: font size, line height, progress, theme (default/sepia/dark) — all persisted to localStorage.
  - **Nav injection**: `injectCommerceNav()` dynamically adds subscription/orders links to nav on every page.
- **`styles.css`** — All styling. CSS custom properties for theming. Reader themes via `reader-theme-sepia`/`reader-theme-dark` body classes. Mobile responsive with `.nav-toggle`.

### Key Patterns

- No routing — direct `.html` file navigation with query params (`?plan=`, `?order=`).
- All render functions are safe to call on any page — they silently no-op if their target DOM elements don't exist.
- Commerce flow: `subscription.html` → `checkout.html?plan=X` → simulate pay → `payment-success.html?order=Y` or `payment-failed.html?order=Y`.
- The `plan.md` file is a product roadmap document (V1/V1.5/V2 phases), not code.

### localStorage Keys

| Key | Usage |
|---|---|
| `novel-subscription-tier` | Current plan ID (`free`/`starter`/`plus`/`pro`) |
| `novel-subscription-updated-at` | ISO timestamp of last plan change |
| `novel-orders` | JSON array of order objects |
| `reader-font-size` / `reader-line-height` / `reader-progress` / `reader-theme` | Reader preferences |
