# Awwwards-Winning Patterns & Hero Section Reference

What separates an Awwwards Site of the Day from a "nice website." Use this as a checklist
and inspiration source for every project.

---

## 🏆 Hero Section Archetypes

### 1. The Kinetic Typography Hero
**What it is**: Large-scale text that animates in letter-by-letter, word-by-word, or with morphing effects.
The text IS the design — minimal imagery, maximum typographic impact.

**Key elements**:
- Oversized headline: `clamp(3rem, 10vw, 12rem)` — dominate the viewport
- Letter-by-letter stagger reveal with `cubic-bezier(0.16, 1, 0.3, 1)` easing
- Split-text animation: each character wrapped in `<span>` with individual transforms
- Rotating/morphing words that cycle through value propositions
- Subtle gradient or color shift on text as it reveals
- Minimal supporting elements: one subline + one CTA max

**Implementation pattern**:
```
┌────────────────────────────────────────────┐
│                                            │
│   [small caps label]                       │
│                                            │
│   MASSIVE                                  │
│   KINETIC                                  │
│   HEADLINE.                                │
│                                            │
│   One-line description        [ CTA → ]    │
│                                            │
│           ↓ scroll indicator               │
└────────────────────────────────────────────┘
```

**Reference sites**: Locomotive.ca, Resn.co.nz, Aristide Benoist portfolio

---

### 2. The Immersive 3D / WebGL Hero
**What it is**: A full-viewport 3D scene or particle system that responds to cursor movement
or scroll position, creating depth and immersion.

**Key elements**:
- Three.js / Spline 3D scene as background
- Parallax layers: foreground text + midground 3D + background particles
- Cursor-reactive: objects follow or repel from mouse position
- Scroll-linked transformation: scene morphs as user scrolls down
- Performance: `<canvas>` rendered at device pixel ratio, capped at 60fps
- Fallback: static gradient for low-power devices / `prefers-reduced-motion`

**Reference sites**: Awwwards.com (their own hero), Linear.app, Stripe.com

---

### 3. The Split-Screen Hero
**What it is**: Viewport divided into two distinct halves — text on one side, visual
(image/video/3D/animation) on the other. Creates tension and visual interest.

**Key elements**:
- Asymmetric split: NOT 50/50 — use 40/60 or golden ratio (38/62)
- The visual side bleeds to the edge (no padding)
- Text side has generous whitespace and clear hierarchy
- On scroll: one side scrolls faster than the other (parallax split)
- Mobile: stacks vertically with visual on top, text below

**Implementation pattern**:
```
┌──────────────────┬─────────────────────────┐
│                  │                         │
│  Headline        │                         │
│  Subtext         │    Full-bleed visual    │
│                  │    (image/video/3D)     │
│  [ CTA ]         │                         │
│                  │                         │
└──────────────────┴─────────────────────────┘
```

**Reference sites**: Apple product pages, Porsche Design, Raoul Gaillard

---

### 4. The Video/Motion Background Hero
**What it is**: Full-viewport ambient video or motion graphic playing behind text, creating
a cinematic first impression.

**Key elements**:
- Autoplaying, muted, looping `<video>` (never autoplay with sound)
- Dark overlay gradient for text readability: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7))`
- Compressed video: WebM + MP4 fallback, max 3-5MB
- Poster image for instant display before video loads
- Text positioned with `position: absolute` over the video
- Pause video when not in viewport (Intersection Observer)

**Reference sites**: Apple keynote pages, Nike campaigns, Airbnb Experiences

---

### 5. The Bento Grid Hero
**What it is**: A grid of varying-sized cards showcasing multiple features/products at once,
inspired by Apple's feature pages.

**Key elements**:
- CSS Grid with `grid-template-areas` for named, asymmetric regions
- Each card has its own micro-animation on hover (tilt, glow, expand)
- Cards stagger-animate in on page load
- Interactive cards: some are clickable, some show live demos
- Responsive: collapses to 1-2 columns on mobile with priority ordering

**Reference sites**: Apple (iPhone feature pages), Vercel dashboard cards, Linear changelog

---

### 6. The Scroll-Storytelling Hero
**What it is**: The hero isn't one screen — it's a scroll-driven narrative that reveals
content progressively as the user scrolls. The entire first fold is an animated journey.

**Key elements**:
- Pinned sections with scroll-driven progress (`position: sticky`)
- Content transforms: fade, scale, translate, blur tied to scroll position
- Progress indicator (subtle bar or dots showing scroll progress)
- GSAP ScrollTrigger with `scrub: true` for smooth scroll-linked animation
- Each "chapter" reveals with a distinct animation
- Total scroll distance: 3-5x viewport height for the hero sequence

**Reference sites**: Apple AirPods Pro page, Stripe Atlas, Once Upon a Time in Hollywood promo

---

### 7. The Minimal / Zen Hero
**What it is**: Maximum whitespace, minimum elements. The hero is a single line of text,
maybe one subtle animation, and vast emptiness. Confidence through restraint.

**Key elements**:
- One headline, one CTA — nothing else
- 60%+ of viewport is intentional whitespace
- Extremely subtle entrance animation (opacity only, slow)
- Typography does ALL the work — perfect font choice, weight, spacing
- No background effects, no gradients — pure structure
- Scroll indicator is the only visual accent

**Reference sites**: Hector (hfrm.io), Berkshire Hathaway (intentionally), Studio Dumbar

---

## ✨ What Makes Awwwards Sites Stand Out

### 1. Scroll Experience Design
The scroll IS the experience. Every section transitions into the next with purpose.

**Techniques**:
- **Horizontal scroll sections**: Content moves sideways while user scrolls vertically
- **Pinned transitions**: Section pins while internal content animates through states
- **Scroll-speed variation**: Some sections scroll faster/slower for rhythm
- **Reveal on scroll**: Elements appear only when scrolled into view (not before)
- **Progress-linked animations**: Animations scrub with scroll position, not on trigger

**Implementation with Lenis + GSAP**:
```javascript
// Smooth scroll base
const lenis = new Lenis({ duration: 1.2, smoothWheel: true });

// Pin section and animate children
gsap.timeline({
  scrollTrigger: {
    trigger: '.feature-section',
    start: 'top top',
    end: '+=200%',
    pin: true,
    scrub: 1,
  }
})
.from('.feature-1', { opacity: 0, y: 60 })
.from('.feature-2', { opacity: 0, y: 60 }, '+=0.5')
.from('.feature-3', { opacity: 0, y: 60 }, '+=0.5');
```

---

### 2. Cursor & Pointer Design
The cursor becomes part of the design language.

**Patterns**:
- **Custom cursor**: Replace default cursor with a branded dot/ring that scales on hover
- **Cursor follower**: A trailing element that follows the cursor with spring physics
- **Magnetic elements**: Buttons/links that "attract" toward the cursor within a radius
- **Cursor text**: Display contextual text around the cursor ("View", "Play", "Drag")
- **Cursor blend mode**: `mix-blend-mode: difference` for automatic contrast

**Implementation**:
```css
/* Custom cursor base */
.cursor {
  width: 20px;
  height: 20px;
  border: 2px solid var(--text-primary);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: var(--z-max);
  transition: width 0.3s, height 0.3s, border-color 0.3s;
  mix-blend-mode: difference;
}

.cursor--hover {
  width: 60px;
  height: 60px;
  border-color: var(--color-primary-500);
}

.cursor--text::after {
  content: attr(data-cursor-text);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  white-space: nowrap;
}
```

---

### 3. Page Transitions
Navigation between pages should feel like scenes in a film, not URL changes.

**Patterns**:
- **Overlay wipe**: A colored div slides across the screen, revealing the new page underneath
- **Content morph**: Shared elements (like a card image) morph into the new page's hero
- **Fade + blur**: Current page blurs and fades as new page sharpens into focus
- **Clip-path reveal**: New page reveals through an expanding circle or polygon
- **Staggered exit → enter**: Current page elements exit (stagger up), then new page elements enter (stagger down)

**Libraries**: Barba.js (multi-page), Framer Motion `AnimatePresence` (SPA)

---

### 4. Typography as Design
On Awwwards sites, typography isn't just readable — it's the centerpiece.

**Techniques**:
- **Display fonts at extreme sizes**: Headlines at `8-15vw` — text AS layout
- **Mixed weights in one line**: "Build **something** great" — contrast within a sentence
- **Outlined text**: `color: transparent; -webkit-text-stroke: 1px white` for emphasis
- **Text clipping with images/video**: Background-clip text with moving media behind it
- **Vertical text**: Rotated labels on the side for editorial feel
- **Marquee/ticker text**: Continuously scrolling text strips for energy
- **Staggered baselines**: Words at different vertical positions for dynamic composition

**CSS for text-clip video**:
```css
.text-clip {
  background: url('video.mp4') center/cover;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: clamp(4rem, 12vw, 12rem);
  font-weight: 900;
}
```

---

### 5. Micro-Interaction Obsession
Every clickable, hoverable, or interactive element tells a story through motion.

**Must-have micro-interactions**:

| Element | Interaction | Animation |
|---------|------------|-----------|
| **Button** | Hover | Slight scale up (1.02), color shift, optional arrow slide |
| **Button** | Click | Scale down (0.98), ripple effect from click point |
| **Link** | Hover | Underline draws from left to right, or text color shifts |
| **Card** | Hover | Lift (translateY -4px), shadow expands, border glows |
| **Image** | Hover | Slight zoom (scale 1.05) with overflow hidden |
| **Nav item** | Active | Spring-animated underline/indicator moves to active position |
| **Toggle** | Switch | Thumb slides with overshoot spring, track color morphs |
| **Checkbox** | Check | SVG path draws the checkmark stroke |
| **Input** | Focus | Border color transitions, label floats up and shrinks |
| **Accordion** | Open | Height animates with content, chevron rotates |
| **Toast** | Enter/Exit | Slides in from edge, exits with fade + translate |
| **Modal** | Open | Overlay fades, modal scales up from 0.95 with blur-in |
| **Number** | Change | Count-up animation when entering viewport |
| **Progress** | Load | Bar fills with eased animation, percentage counts up |

---

### 6. Visual Rhythm & Spacing
Awwwards sites have a rhythm — alternating dense and spacious sections.

**Rules**:
- **Section spacing**: Alternate between tight (4rem) and generous (8-12rem) padding
- **Content density wave**: Dense section → spacious section → dense → spacious
- **Asymmetric margins**: Don't center everything — offset content for editorial feel
- **Breathing room around CTAs**: CTAs need 2-3x more whitespace than other elements
- **Consistent vertical rhythm**: All text baselines align to a shared grid (8px)
- **Section transitions**: Each section boundary has a visual transition (gradient fade, line, shape divider, or animated element)

---

### 7. Loading & First Impression
The first 0-3 seconds define the emotional response.

**Patterns**:
- **Preloader animation**: Branded loading animation (logo morph, counter, progress bar)
- **Reveal sequence**: After load, elements cascade in with staggered timing:
  1. Background color/gradient (0ms)
  2. Navigation (200ms)
  3. Hero headline (400ms, with kinetic animation)
  4. Supporting text (600ms)
  5. CTA (800ms)
  6. Scroll indicator (1200ms, subtle pulse)
- **Above-the-fold priority**: Critical content loads instantly, below-fold lazy-loads
- **Skeleton → content**: Show shimmer skeletons that morph into real content

---

### 8. Dark Mode Done Right
Not just "invert colors" — a completely re-thought visual experience.

**Principles**:
- **Elevation through brightness**: Higher elements are slightly lighter (not shadowed)
- **Reduced saturation**: Colors should be slightly desaturated in dark mode
- **Glow instead of shadow**: Replace `box-shadow` with subtle colored `box-shadow` glows
- **Emissive accents**: Primary colors appear to "glow" against dark backgrounds
- **Adjusted contrast**: Not maximum — use off-black (`#0a0a0f`) not pure black
- **Glassmorphism**: Translucent elements with `backdrop-filter: blur()` shine in dark mode

---

### 9. Sound Design (Subtle)
Some Awwwards winners use optional, subtle audio cues.

**Rules**:
- ALWAYS off by default — require explicit opt-in
- Micro-sounds: soft clicks, whooshes, chimes (< 100ms each)
- Volume: barely perceptible, never startling
- Spatial audio: sounds pan based on element position
- Mute toggle clearly visible and memorable
- Skip entirely if the project doesn't call for it

---

### 10. Accessibility as a Feature, Not an Afterthought
The best Awwwards sites prove that accessible ≠ boring.

**Premium accessible patterns**:
- **Custom focus indicators**: Animated focus rings that are beautiful AND visible
- **Reduced motion mode**: Not just "no animation" — a simplified, elegant version
- **High-contrast mode**: A third theme option with maximum contrast ratios
- **Skip navigation**: Styled beautifully, appears on Tab
- **Screen reader narratives**: `aria-live` regions that narrate state changes
- **Keyboard shortcuts**: Power user shortcuts with a visible shortcut reference (⌘K)

---

## 🎯 Section-by-Section Playbook

### Navigation
- Glassmorphic background that solidifies on scroll
- Logo animation on load (SVG path draw or morph)
- Menu items stagger-fade on page load
- Mobile: full-screen takeover with giant staggered links, NOT a tiny slide-out drawer

### Features / Benefits Section
- Bento grid OR alternating image-text rows
- Each feature card has its own icon animation (Lottie or CSS)
- Numbers/stats use animated count-up on scroll into view
- Tabbed or accordion content to reduce page length

### Testimonials / Social Proof
- Horizontal marquee of logos (auto-scrolling, pause on hover)
- Testimonial cards with photo, name, role, quote
- Star ratings with animated fill on scroll
- Video testimonials with custom play button overlay

### Pricing
- Interactive toggle (monthly/annual) with spring animation
- "Most popular" card slightly elevated with glow border
- Feature comparison with animated checkmarks
- CTA buttons with hover glow effect

### Footer
- NOT an afterthought — treat it as a design element
- Mega-footer with newsletter signup, social links, navigation
- Subtle background gradient or pattern different from main content
- Logo lockup with tagline
- Back-to-top button with smooth scroll animation

### 404 Page
- A FULL design moment — creative, memorable, on-brand
- Interactive element (mini-game, animation, Easter egg)
- Clear path back to safety (home link, search)
- NEVER a generic white page with "Page not found"

---

## 🏅 Awwwards Judging Criteria (Self-Score Before Shipping)

Score yourself out of 10 on each:

| Criterion | What Judges Look For |
|-----------|---------------------|
| **Design** (40%) | Visual quality, layout, typography, color, consistency, premium feel |
| **Usability** (20%) | Navigation clarity, content readability, intuitive interactions, mobile UX |
| **Creativity** (20%) | Originality, innovation, unexpected delight, boundary-pushing |
| **Content** (20%) | Copy quality, information architecture, messaging clarity |

**Minimum for SOTD nomination**: Average 8.0+
**Minimum for SOTY consideration**: Average 9.0+

### Quick Self-Test
Before considering any design "done," ask:

1. Would I screenshot this and share it on Twitter? → If no, it's not impressive enough
2. Can I describe what makes this unique in one sentence? → If no, it's too generic
3. Does the scroll experience have at least 3 "wow" moments? → If no, add more
4. Would this look dated in 2 years? → If yes, push the design forward
5. Does EVERY element have a hover/interaction state? → If no, it's not finished
