---
name: bauhaus-ui
description: >
  A generalized dark design language for building bold, editorial, visually exceptional interfaces — 
  particularly finance apps, dashboards, portfolios, crypto platforms, data tools, and any product 
  that needs to feel premium, modern, and alive. Synthesizes: deep atmospheric gradient backgrounds 
  (nebula, mesh, aurora), organic morphing blob shapes as interactive and decorative elements, 
  Bauhaus-rooted typography (enormous display weights, mixed-color headlines, strict label hierarchy), 
  pure geometric punctuation, high-contrast color blocking on dark surfaces, and Swiss-grid structural 
  discipline. Use this skill whenever someone asks to build a finance app, dashboard, crypto/NFT UI, 
  portfolio tracker, data visualization, agency site, digital platform, or any UI that should feel 
  premium and bold. Trigger for phrases like: "dark UI", "bold design", "finance app", "dashboard", 
  "crypto", "editorial style", "atmospheric UI", "gradient background", "modern dark app". 
  ALWAYS use this when design quality matters — never produce generic AI aesthetics.
---

# Dark Atmospheric Design Language

A generalized design system. Not a template — a **set of principles, visual rules, and code patterns** that produce consistently exceptional UIs across any product context. Rooted in Bauhaus discipline, alive with organic gradients and morphing shapes.

---

## The Design DNA

This system fuses two visual philosophies into one language:

**From Constructivist/Bauhaus tradition:**
Pure geometry. Strict typographic hierarchy. Structural grids. Color as signal, not decoration. Everything earns its place.

**From Organic Digital Art:**
Atmospheric depth through gradient light. Shapes that breathe and morph. Color fields that glow from within. Surfaces that feel dimensional, not flat.

The tension between these two — rigid structure vs. organic atmosphere — is what makes the aesthetic feel alive and distinctive.

---

## SURFACES & BACKGROUNDS

The entire system lives on dark. Not flat dark — *layered* dark with atmospheric depth.

### The Background Stack
Think of backgrounds as layers of light depth, not flat fills.

```css
:root {
  /* The void — true black for maximum contrast moments */
  --surface-void:    #000000;
  
  /* Page default — near black, barely lifted */
  --surface-base:    #0A0A0F;
  
  /* Cards, panels — subtly raised */
  --surface-raised:  #12121A;
  
  /* Interactive elements, hover states */
  --surface-high:    #1C1C28;
  
  /* Structural lines — visible but never loud */
  --line-subtle:     rgba(255, 255, 255, 0.06);
  --line-visible:    rgba(255, 255, 255, 0.12);
  --line-emphasis:   rgba(255, 255, 255, 0.25);
}
```

### Atmospheric Gradient Backgrounds
Gradients are light sources inside the dark void — they create dimension and mood. Use as section or page backgrounds, never on text or interactive components.

```css
/* Aurora — cool green/teal glow, feels alive and financial */
--grad-aurora:
  radial-gradient(ellipse 80% 60% at 15% 85%, rgba(0, 200, 120, 0.35) 0%, transparent 60%),
  radial-gradient(ellipse 60% 50% at 85% 20%, rgba(80, 100, 255, 0.25) 0%, transparent 55%),
  var(--surface-base);

/* Cosmic — deep violet nebula, premium crypto/wealth feel */
--grad-cosmic:
  radial-gradient(ellipse 70% 55% at 20% 75%, rgba(100, 40, 220, 0.45) 0%, transparent 60%),
  radial-gradient(ellipse 50% 40% at 80% 30%, rgba(180, 60, 255, 0.20) 0%, transparent 50%),
  var(--surface-void);

/* Ember — warm amber/orange glow, urgency, alerts, energy */
--grad-ember:
  radial-gradient(ellipse 65% 50% at 75% 80%, rgba(220, 100, 0, 0.40) 0%, transparent 60%),
  radial-gradient(ellipse 45% 35% at 25% 25%, rgba(255, 60, 30, 0.20) 0%, transparent 50%),
  var(--surface-void);

/* Frost — cool blue/cyan, data clarity, precision */
--grad-frost:
  radial-gradient(ellipse 75% 55% at 80% 85%, rgba(0, 140, 255, 0.30) 0%, transparent 60%),
  radial-gradient(ellipse 50% 40% at 20% 20%, rgba(0, 200, 220, 0.20) 0%, transparent 50%),
  var(--surface-base);

/* Dusk — purple/pink, wealth, luxury, portfolio */
--grad-dusk:
  radial-gradient(ellipse 80% 60% at 10% 90%, rgba(140, 40, 180, 0.40) 0%, transparent 55%),
  radial-gradient(ellipse 60% 45% at 90% 15%, rgba(220, 80, 140, 0.25) 0%, transparent 50%),
  var(--surface-void);
```

**Gradient usage rules:**
- One gradient per major section — don't stack multiple gradients across adjacent sections
- The gradient's light source should point away from primary content (corner or edge glow)
- Content sits on top; the gradient is atmosphere, not information
- Add subtle noise for tactile depth (see Noise Texture pattern below)

### Noise Texture Overlay
Adds grain that makes gradients feel physical rather than digital. Apply to any gradient surface.

```css
.textured::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  opacity: 0.5;
  mix-blend-mode: overlay;
}
```

---

## COLOR SYSTEM

### Philosophy
Color in this system is **light, not paint**. Colors glow from within dark surfaces. Never add color by filling a rectangle — add it by making something emit light.

```css
:root {
  /* PRIMARY — the one color that owns the screen. Pick one per product. */
  --accent-lime:    #A8FF3E;   /* growth, returns, positive action */
  --accent-violet:  #8B5CF6;   /* premium, wealth, crypto */
  --accent-cyan:    #00D4FF;   /* precision, data, clarity */
  --accent-amber:   #FFB020;   /* alerts, energy, yield */
  --accent-emerald: #00E896;   /* profit, positive, live */

  /* SEMANTIC — consistent meaning across all contexts */
  --color-gain:     #00E896;   /* always: profit, increase, positive */
  --color-loss:     #FF4560;   /* always: loss, decrease, alert */
  --color-neutral:  #6B7280;   /* always: unchanged, pending */
  --color-live:     #00E896;   /* always: live/real-time indicator */

  /* TEXT — opacity-based for natural layering */
  --text-100: rgba(255, 255, 255, 1.00);   /* headlines, key data */
  --text-70:  rgba(255, 255, 255, 0.70);   /* body, secondary labels */
  --text-40:  rgba(255, 255, 255, 0.40);   /* muted, placeholders */
  --text-20:  rgba(255, 255, 255, 0.20);   /* disabled, decorative */
}
```

### Color Application Rules

**One primary accent per product.** It appears on: primary CTA buttons, the hero accent word, active nav states, positive data, progress fills. Everywhere else is white text on dark surfaces.

**Semantic colors are non-negotiable.** Gain is always green. Loss is always red. Never repurpose these for branding.

**Color blocks work on dark.** A block of `--accent-violet` background with white text is a legitimate layout element — use for CTA sections, featured cards, hero sub-sections.

**Never**: gradients on text (except one-off logo moments), multiple accent colors competing, light backgrounds mixed into dark-dominant layouts.

---

## TYPOGRAPHY

### Principle
Type does the heavy lifting. The hierarchy must be so clear that a user understands information priority before reading a word.

```css
/* Font stack — display + text pairing */
/* Import: */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

:root {
  --font-display: 'Syne', sans-serif;       /* all headlines, numbers, display */
  --font-text:    'DM Sans', sans-serif;    /* body, labels, UI text */
  --font-mono:    'JetBrains Mono', 'Fira Code', monospace;  /* data, timers, code */
}
```

### Type Scale

| Level | Use | Size | Weight | Font | Tracking |
|-------|-----|------|--------|------|----------|
| **Display** | Hero statements, brand moments | clamp(56px, 12vw, 140px) | 800 | Syne | -0.03em |
| **H1** | Page titles, section heroes | clamp(36px, 6vw, 72px) | 800 | Syne | -0.025em |
| **H2** | Section headings | clamp(24px, 4vw, 40px) | 700 | Syne | -0.015em |
| **H3** | Card titles, widget headers | 18–22px | 700 | Syne | -0.01em |
| **Data XL** | Key metrics, big numbers | clamp(32px, 5vw, 64px) | 800 | Syne | -0.02em |
| **Data MD** | Supporting numbers | 20–28px | 700 | Syne | -0.01em |
| **Body** | Paragraphs, descriptions | 14–16px | 400 | DM Sans | 0 |
| **Label** | Tags, categories, keys | 10–12px | 600 | DM Sans | 0.12–0.18em + uppercase |
| **Mono** | Prices, IDs, timers | 13–18px | 500–700 | Mono | 0.02em |

### The Mixed-Headline Technique
Every hero/display headline uses weight and color variation within the same line — this is the system's signature typographic move.

```html
<!-- Technique 1: Accent word + weight contrast -->
<h1>
  <span class="t-accent">Tell</span> your<br>
  <em class="t-light">finan</em><strong>cial</strong><br>
  story
</h1>

<!-- Technique 2: Enormous concept word with small label above -->
<div>
  <span class="label-tag">Portfolio Insight</span>
  <h1 class="t-display">Jupiter</h1>
  <p class="t-sub">Only 1% of wallets hold this position</p>
</div>

<!-- Technique 3: Statement sentence, one word breaks out in color -->
<h2>
  We are constantly seeking to strike<br>
  the right <span class="t-accent">balance</span>
</h2>
```

```css
.t-display { font-family: var(--font-display); font-size: clamp(64px, 15vw, 160px); font-weight: 800; line-height: 0.88; letter-spacing: -0.03em; color: var(--text-100); }
.t-h1      { font-family: var(--font-display); font-size: clamp(36px, 7vw, 72px); font-weight: 800; line-height: 0.92; letter-spacing: -0.025em; color: var(--text-100); }
.t-h2      { font-family: var(--font-display); font-size: clamp(24px, 4vw, 40px); font-weight: 700; line-height: 1.0; letter-spacing: -0.015em; color: var(--text-100); }
.t-data-xl { font-family: var(--font-display); font-size: clamp(32px, 6vw, 64px); font-weight: 800; line-height: 1; letter-spacing: -0.02em; color: var(--text-100); }
.t-body    { font-family: var(--font-text); font-size: 15px; font-weight: 400; line-height: 1.6; color: var(--text-70); }
.t-label   { font-family: var(--font-text); font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-40); }
.t-mono    { font-family: var(--font-mono); font-size: 14px; font-weight: 600; letter-spacing: 0.02em; }
.t-accent  { color: var(--accent-lime); }   /* swap for product's chosen accent */
.t-light   { font-weight: 300; font-style: italic; }
.label-tag { font-family: var(--font-text); font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-40); display: block; margin-bottom: 6px; }
```

---

## SHAPE LANGUAGE

Shapes in this system serve two distinct roles. Know which role you're using before placing a shape.

### Role 1 — Geometric Punctuation (Bauhaus influence)
Hard-edged, precise, structural. Used in grids, as dividers, in empty layout cells, as compositional anchors.

```css
/* Rules for geometric punctuation shapes: */
/* — Pure primitives only: circle, half-circle, square, rectangle */
/* — Colors: accent fill, white outline, or muted fill */
/* — Sizes: deliberately large (80px–320px) relative to their cell */
/* — Position: absolute, placed intentionally off-center or bleeding edges */
/* — No animation — these are structural, they don't move */

.shape-circle-outline { border-radius: 50%; border: 1.5px solid var(--line-emphasis); }
.shape-circle-fill    { border-radius: 50%; background: var(--accent-amber); }
.shape-half           { border-radius: 120px 120px 0 0; background: var(--accent-coral, #E8B4A0); }
.shape-square         { background: var(--accent-amber); }  /* no radius — intentional */
```

### Role 2 — Organic Blobs (Digital Art influence)
Fluid, morphing, alive. Used as: interactive card backgrounds, category selectors, featured section fills, decorative shape in atmospheric sections.

```css
/* The blob is defined by its border-radius rhythm */
/* Standard starting shape — always override with animation */
.blob {
  border-radius: 62% 38% 46% 54% / 60% 44% 56% 40%;
}

/* Morph animation — every blob instance should have a unique offset */
@keyframes blob-drift {
  0%  { border-radius: 62% 38% 46% 54% / 60% 44% 56% 40%; }
  25% { border-radius: 40% 60% 70% 30% / 48% 62% 38% 52%; }
  50% { border-radius: 55% 45% 35% 65% / 52% 38% 62% 48%; }
  75% { border-radius: 38% 62% 55% 45% / 66% 34% 58% 42%; }
  100%{ border-radius: 62% 38% 46% 54% / 60% 44% 56% 40%; }
}

.blob--slow   { animation: blob-drift 10s ease-in-out infinite; }
.blob--medium { animation: blob-drift 7s  ease-in-out infinite; }
.blob--fast   { animation: blob-drift 4s  ease-in-out infinite; }

/* Stagger via delay so sibling blobs don't sync */
.blob:nth-child(1) { animation-delay: 0s; }
.blob:nth-child(2) { animation-delay: -3s; }
.blob:nth-child(3) { animation-delay: -6s; }
.blob:nth-child(4) { animation-delay: -2s; }
```

**Blob color rule**: Blobs are always richly saturated — never pastel, never muted. They glow against dark backgrounds.
```css
/* Finance blob palette */
.blob--violet   { background: #7C3AED; }
.blob--emerald  { background: #059669; }
.blob--cobalt   { background: #2563EB; }
.blob--crimson  { background: #DC2626; }
.blob--amber    { background: #D97706; }
.blob--fuchsia  { background: #A21CAF; }
```

**Blob usage in finance contexts:**
- Category/asset-class selectors (Equities, Bonds, Crypto, Real Estate)
- Featured insight cards where data lives on a colorful organic surface
- Section dividers between major page areas
- Loading/skeleton states that feel alive
- Background fill for empty dashboard widgets

### Combining Both Shape Roles
In the same section: geometric shapes anchor structure, blobs provide atmosphere. They don't compete — they operate at different depths. Blobs sit in the background layer; geometric shapes sit in the foreground structural layer.

---

## LAYOUT & GRID

### The Core Grid Principle
Use CSS Grid with **zero gap and 1px line-color backgrounds** to create structural dividers. This is cleaner and more intentional than margin/padding tricks.

```css
/* Base: any section with visible structural grid */
.structural-grid {
  display: grid;
  gap: 1px;
  background: var(--line-visible); /* the 1px gap shows this as a line */
}
.structural-grid > * {
  background: var(--surface-base); /* cells cover the line background */
}

/* Common column patterns */
.grid-12   { grid-template-columns: repeat(12, 1fr); }
.grid-4-8  { grid-template-columns: 4fr 8fr; }         /* asymmetric editorial */
.grid-5-7  { grid-template-columns: 5fr 7fr; }
.grid-label-content { grid-template-columns: 80px 1fr; } /* Swiss label + content */
.grid-3-equal { grid-template-columns: repeat(3, 1fr); }
.grid-2-equal { grid-template-columns: repeat(2, 1fr); }
```

### Swiss Label Pattern (Type B influence — discipline for finance data)
Every significant piece of data has a label above it. Labels are always uppercase, tracked, muted. This is the visual grammar for all data display.

```html
<div class="data-block">
  <span class="t-label">Portfolio Value</span>
  <span class="t-data-xl">$248,391</span>
  <span class="delta delta--up">↑ 4.2% today</span>
</div>
```

```css
.data-block { display: flex; flex-direction: column; gap: 4px; }
.delta { font-family: var(--font-text); font-size: 13px; font-weight: 600; }
.delta--up   { color: var(--color-gain); }
.delta--down { color: var(--color-loss); }
```

### Asymmetric Editorial Split (2-col sections)
For feature rows, insight cards, hero sections with image/content pairing:

```css
.editorial { display: grid; grid-template-columns: 5fr 7fr; min-height: 400px; }
.editorial--reversed { grid-template-columns: 7fr 5fr; }
/* Content in one column, visual (image, blob, chart, shape) in the other */
/* Columns share a 1px border: border-right: 1px solid var(--line-visible) on left col */
```

---

## COMPONENT PATTERNS

### Cards
Cards in this system are not generic containers. They have a defined hierarchy within them.

```css
/* Base card — used for all data/content cards */
.card {
  background: var(--surface-raised);
  border: 1px solid var(--line-subtle);
  border-radius: 16px;         /* only border-radius allowed for cards: 0, 12-16px, or full pill */
  padding: 20px 22px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s ease;
}
.card:hover { border-color: var(--line-emphasis); }

/* Card with blob background — for featured/highlight cards */
.card--featured {
  background: transparent;
  border: none;
  /* The blob IS the card background */
}

/* KPI Card — colored background, data inside */
.card--kpi {
  border-radius: 16px;
  padding: 18px 20px;
  color: #fff;
  /* background set via inline style or modifier class per card */
}
.card--kpi .t-label { color: rgba(255,255,255,0.65); }
.card--kpi .t-data-xl { color: #fff; }
```

### Data Row — the atomic finance display unit
```html
<div class="data-row">
  <span class="t-label">Total Sales</span>
  <div class="data-row__values">
    <span class="t-data-xl">52</span>
    <span class="data-row__divider"></span>
    <span class="t-data-xl t-accent">3.2 eth</span>
    <span class="data-row__divider"></span>
    <span class="t-data-xl">8 <span class="t-label">owners</span></span>
  </div>
</div>
```
```css
.data-row { border-top: 1px solid var(--line-subtle); padding: 16px 0; }
.data-row__values { display: flex; align-items: baseline; gap: 20px; margin-top: 6px; }
.data-row__divider { width: 1px; height: 32px; background: var(--line-visible); flex-shrink: 0; }
```

### Rotating Text Badge (Type D signature element)
Used to mark: live sections, featured items, brand moments, status indicators.

```html
<div class="badge" style="--badge-bg: var(--accent-lime); --badge-text-color: #000">
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <defs>
      <path id="badge-path" d="M 50,50 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0"/>
    </defs>
    <text font-family="DM Sans" font-size="8.5" font-weight="700" letter-spacing="3.5" fill="currentColor">
      <textPath href="#badge-path">LIVE • PORTFOLIO • OPEN •</textPath>
    </text>
  </svg>
  <span class="badge__center">↗</span>
</div>
```
```css
.badge {
  width: 80px; height: 80px;
  border-radius: 50%;
  background: var(--badge-bg, var(--accent-lime));
  color: var(--badge-text-color, #000);
  position: relative;
  display: flex; align-items: center; justify-content: center;
  animation: badge-spin 12s linear infinite;
  flex-shrink: 0;
}
.badge__center {
  position: absolute;
  font-size: 20px; font-weight: 700;
  pointer-events: none;
}
@keyframes badge-spin { to { transform: rotate(360deg); } }
```

### Stat Summary Row (hero data section — Type D)
```html
<div class="stats-bar">
  <div class="stat">
    <span class="t-label">AUM</span>
    <span class="t-data-xl">$2.4B</span>
  </div>
  <div class="stats-bar__rule"></div>
  <div class="stat">
    <span class="t-label">Active Clients</span>
    <span class="t-data-xl">14,820</span>
  </div>
  <div class="stats-bar__rule"></div>
  <div class="stat">
    <span class="t-label">Avg Return</span>
    <span class="t-data-xl t-accent">18.4%</span>
  </div>
</div>
```
```css
.stats-bar { display: flex; align-items: center; gap: 24px; padding: 20px 0; border-top: 1px solid var(--line-visible); }
.stats-bar__rule { width: 1px; height: 44px; background: var(--line-visible); flex-shrink: 0; }
.stat { display: flex; flex-direction: column; gap: 4px; }
```

### Status Pill
```css
.pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 14px; border-radius: 50px;
  font-family: var(--font-text); font-size: 11px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase;
}
.pill--outline { border: 1.5px solid var(--line-emphasis); color: var(--text-70); }
.pill--live    { background: rgba(0, 232, 150, 0.12); border: 1.5px solid var(--color-live); color: var(--color-live); }
.pill--alert   { background: rgba(255, 69, 60, 0.12); border: 1.5px solid var(--color-loss); color: var(--color-loss); }
.pill::before  { content: '●'; font-size: 8px; }
```

---

## BUTTONS

Two shapes only. No ambiguity.

```css
/* PILL — all primary and secondary actions */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  border-radius: 50px; padding: 13px 28px;
  font-family: var(--font-text); font-size: 14px; font-weight: 700;
  letter-spacing: 0.02em; cursor: pointer; border: none;
  transition: opacity 0.15s ease, transform 0.1s ease;
}
.btn:active { transform: scale(0.97); }

.btn--primary  { background: var(--accent-lime); color: #000; }
.btn--secondary{ background: var(--surface-high); color: var(--text-100); border: 1px solid var(--line-emphasis); }
.btn--ghost    { background: transparent; color: var(--text-100); border: 1.5px solid var(--line-emphasis); }
.btn--danger   { background: rgba(255, 69, 60, 0.15); color: var(--color-loss); border: 1.5px solid var(--color-loss); }
.btn--full     { width: 100%; }

.btn--primary:hover  { opacity: 0.88; }
.btn--ghost:hover    { border-color: var(--line-emphasis); background: var(--surface-raised); }

/* SHARP — editorial contexts, large section CTAs, section navigators */
.btn-sharp {
  border-radius: 0;
  padding: 16px 36px;
  font-family: var(--font-display); font-size: 13px; font-weight: 800;
  letter-spacing: 0.08em; text-transform: uppercase;
  background: var(--text-100); color: var(--surface-void);
  border: none; cursor: pointer;
}

/* Circle arrow — section scroll indicators, next-step buttons */
.btn-circle {
  width: 52px; height: 52px; border-radius: 50%; border: none;
  background: var(--accent-lime); color: #000;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; cursor: pointer;
}
```

---

## NAVIGATION

```css
.nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 20px; height: 60px;
  border-bottom: 1px solid var(--line-subtle);
  background: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(16px);
  position: sticky; top: 0; z-index: 100;
}

/* Logo */
.nav-logo { font-family: var(--font-display); font-size: 15px; font-weight: 800; letter-spacing: 0.04em; color: var(--text-100); }

/* Links */
.nav-link { font-family: var(--font-text); font-size: 14px; font-weight: 500; color: var(--text-40); text-decoration: none; transition: color 0.15s; }
.nav-link:hover  { color: var(--text-70); }
.nav-link--active { color: var(--text-100); }

/* Mobile: bottom tab bar */
.tab-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  display: flex; justify-content: space-around; align-items: center;
  height: 64px; padding-bottom: env(safe-area-inset-bottom);
  background: var(--surface-raised); border-top: 1px solid var(--line-subtle);
}
.tab-item { display: flex; flex-direction: column; align-items: center; gap: 3px; opacity: 0.4; transition: opacity 0.15s; }
.tab-item--active { opacity: 1; color: var(--accent-lime); }
```

---

## ANIMATION PRINCIPLES

### Entrance: Fade Up
Every element entering the viewport gets this treatment. Stagger siblings.

```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.enter { animation: fade-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.enter:nth-child(1) { animation-delay: 0ms; }
.enter:nth-child(2) { animation-delay: 70ms; }
.enter:nth-child(3) { animation-delay: 140ms; }
.enter:nth-child(4) { animation-delay: 210ms; }
```

### Numbers: Count Up
All key financial metrics animate from 0 on entrance.
```js
function countUp(el, target, duration = 1200) {
  const start = performance.now();
  const update = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
    el.textContent = formatNumber(Math.floor(ease * target));
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = formatNumber(target);
  };
  requestAnimationFrame(update);
}
```

### Hover States
```css
/* Cards — lift, don't scale */
.card { transition: border-color 0.2s, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.card:hover { border-color: var(--line-emphasis); transform: translateY(-3px); }

/* Buttons — opacity, don't scale except on :active */
.btn { transition: opacity 0.15s; }
.btn:hover  { opacity: 0.85; }
.btn:active { transform: scale(0.97); }

/* Links — color only */
a { transition: color 0.15s; }
```

---

## SECTION ARCHETYPES

These are not templates — they're **structural patterns** that apply across any product. Mix and sequence them as the content demands.

### HERO STATEMENT
Purpose: First impression, brand moment, primary value prop.
Structure: Full-bleed atmospheric gradient → mixed-weight display headline → supporting stat bar → primary CTA
The gradient light source sits opposite the text — text is always fully legible.

### DATA OVERVIEW
Purpose: Show primary financial summary at a glance.
Structure: Page-width section → label row above → large numbers side-by-side with vertical dividers → secondary chart or sparkline below
Never show raw numbers without labels. Never show labels without numbers.

### FEATURE GRID / ASSET CARDS
Purpose: Browse items, assets, positions, categories.
Structure: Card grid (2–3 col) → each card has label + title + key value + delta + optional chart sparkline
Use blob backgrounds on featured/promoted cards. Plain surface-raised for standard cards.

### INSIGHT / EDITORIAL ROW
Purpose: Explain a concept, show an analysis, present a narrative.
Structure: Asymmetric 2-col split → left: headline + body + CTA → right: visual (blob composition, chart, image)
This is the section type where blobs do most of their work — they ARE the visual content on the right side.

### KPI DASHBOARD STRIP
Purpose: Compact at-a-glance performance indicators.
Structure: Horizontal row or 2×N grid → each cell is a colored KPI card with label + large value + delta
Each card gets its own color from the accent palette. Violet, amber, emerald, cobalt, crimson — rotate through these.

### ATMOSPHERE / CTA SECTION
Purpose: Emotional moment, sign-up push, feature highlight.
Structure: Full-section gradient background (choose one gradient — this section owns its own mood) → centered or left-aligned large statement → single primary button → optional blob decoration in corner
This is where gradient and blob work together: gradient as sky, blob as a floating form in the foreground.

---

## ANTI-PATTERNS

These break the design language. Avoid unconditionally.

**Structure violations:**
- `box-shadow` for card elevation — use `border` + contrast instead
- Random border-radius values — only: `0`, `12–16px` for cards, `50px+` for pills, `50%` for circles
- Centered alignment as a default — left-align everything; center only for full-page hero moments
- Inline style borders on arbitrary elements — structural lines come from the grid system

**Color violations:**
- Gradients on text elements — gradients are only for section/page backgrounds
- Light/white backgrounds in dark-dominant layouts — stay in the dark system
- Pastel colors anywhere — if it wouldn't glow on a dark surface, don't use it
- Repurposing semantic colors (green/red gain/loss) for branding

**Typography violations:**
- `font-weight: 400` on any display or heading — minimum 700
- Missing letter-spacing on uppercase labels — always `0.12em` minimum
- More than 2 typefaces — display (Syne) + text (DM Sans) only
- Body text in Syne — Syne is display-only
- Small body text below 13px — stay at 14–16px for readability on dark

**Shape violations:**
- Pastel blobs — blobs are saturated, bold, alive
- Geometric shapes as random decoration — they go in defined structural zones
- Animated geometric shapes (punctuation shapes are static)
- Non-animated blobs (blobs always drift slowly)

**Motion violations:**
- `transform: scale()` on hover for cards — use `translateY(-3px)` only
- Instant transitions — minimum 150ms, prefer 200–300ms
- All elements entering simultaneously — always stagger by 60–80ms