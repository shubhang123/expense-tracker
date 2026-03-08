# Design Tokens System

> **⚠️ All color values in this file are STRUCTURAL TEMPLATES, not final values.**
> Actual hex/HSL values must be derived per-project by analyzing the app's industry,
> audience, emotional tone, and competitive landscape (see SKILL.md Color System section).

---

## Token Architecture

### 1. Primitive Tokens (Generated Per-Project)

Generate each scale using HSL manipulation from the chosen base hue.

```css
/* PRIMARY — derived from project analysis */
--color-primary-50:  /* lightest tint */;
--color-primary-100: ;
--color-primary-200: ;
--color-primary-300: ;
--color-primary-400: ;
--color-primary-500: /* base — the primary brand color */;
--color-primary-600: ;
--color-primary-700: ;
--color-primary-800: ;
--color-primary-900: ;
--color-primary-950: /* darkest shade */;

/* ACCENT — complementary or analogous to primary */
--color-accent-50:  ;
--color-accent-100: ;
--color-accent-200: ;
--color-accent-300: ;
--color-accent-400: ;
--color-accent-500: /* base accent */;
--color-accent-600: ;
--color-accent-700: ;
--color-accent-800: ;
--color-accent-900: ;
--color-accent-950: ;

/* GRAY — warm or cool depending on project tone */
--color-gray-50:  ;
--color-gray-100: ;
--color-gray-200: ;
--color-gray-300: ;
--color-gray-400: ;
--color-gray-500: ;
--color-gray-600: ;
--color-gray-700: ;
--color-gray-800: ;
--color-gray-900: ;
--color-gray-950: ;

/* SEMANTIC — adjust warmth/coolness to match overall palette */
--color-success: /* contextual green */;
--color-success-light: ;
--color-warning: /* contextual amber */;
--color-warning-light: ;
--color-error: /* contextual red */;
--color-error-light: ;
--color-info: /* contextual blue */;
--color-info-light: ;
```

### How to Generate Scales

Given a base color (e.g., HSL `220, 70%, 50%`):

| Shade | Lightness Adjustment |
|-------|---------------------|
| 50 | L: 96–98% |
| 100 | L: 90–93% |
| 200 | L: 80–85% |
| 300 | L: 65–72% |
| 400 | L: 55–62% |
| 500 | L: 45–52% (base) |
| 600 | L: 38–42% |
| 700 | L: 30–35% |
| 800 | L: 22–28% |
| 900 | L: 15–20% |
| 950 | L: 8–12% |

Increase saturation slightly for lighter shades, decrease for darker shades.

---

## 2. Semantic Tokens (Theme-Aware)

These reference primitives and switch based on light/dark theme.

### Light Mode Template
```css
[data-theme="light"], .light {
  --bg-primary:       var(--color-gray-50);
  --bg-secondary:     #ffffff;
  --bg-tertiary:      var(--color-gray-100);
  --text-primary:     var(--color-gray-900);
  --text-secondary:   var(--color-gray-600);
  --text-muted:       var(--color-gray-400);
  --border-default:   var(--color-gray-200);
  --border-subtle:    var(--color-gray-100);
  --surface-card:     rgba(255, 255, 255, 0.8);
  --surface-overlay:  rgba(255, 255, 255, 0.9);
  --shadow-sm:        0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md:        0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg:        0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
  --shadow-glow:      0 0 40px color-mix(in srgb, var(--color-primary-500) 10%, transparent);
}
```

### Dark Mode Template
```css
[data-theme="dark"], .dark {
  --bg-primary:       var(--color-gray-950);
  --bg-secondary:     var(--color-gray-900);
  --bg-tertiary:      var(--color-gray-800);
  --text-primary:     var(--color-gray-50);
  --text-secondary:   var(--color-gray-400);
  --text-muted:       var(--color-gray-600);
  --border-default:   rgba(255, 255, 255, 0.08);
  --border-subtle:    rgba(255, 255, 255, 0.04);
  --surface-card:     rgba(255, 255, 255, 0.03);
  --surface-overlay:  rgba(0, 0, 0, 0.8);
  --shadow-sm:        0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md:        0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg:        0 10px 15px -3px rgba(0, 0, 0, 0.5);
  --shadow-glow:      0 0 40px color-mix(in srgb, var(--color-primary-500) 15%, transparent);
}
```

---

## 3. Spacing Scale (Static — applies to all projects)

```css
--space-0:    0;
--space-px:   1px;
--space-0.5:  0.125rem;   /* 2px */
--space-1:    0.25rem;    /* 4px */
--space-1.5:  0.375rem;   /* 6px */
--space-2:    0.5rem;     /* 8px */
--space-3:    0.75rem;    /* 12px */
--space-4:    1rem;       /* 16px */
--space-5:    1.25rem;    /* 20px */
--space-6:    1.5rem;     /* 24px */
--space-8:    2rem;       /* 32px */
--space-10:   2.5rem;     /* 40px */
--space-12:   3rem;       /* 48px */
--space-16:   4rem;       /* 64px */
--space-20:   5rem;       /* 80px */
--space-24:   6rem;       /* 96px */
--space-32:   8rem;       /* 128px */
```

---

## 4. Typography (Choose fonts per-project)

### Font Family Tokens
```css
/* Select fonts based on project tone:
   - Professional: Inter, Söhne, Geist
   - Creative: Clash Display, Cabinet Grotesk, Space Grotesk
   - Technical: JetBrains Mono, Fira Code, IBM Plex Mono
   - Elegant: Playfair Display, Cormorant, Fraunces
   - Friendly: Nunito, Poppins, DM Sans
   - Modern minimal: Satoshi, General Sans, Outfit
*/
--font-heading: /* chosen based on project tone */;
--font-body: /* chosen based on project tone */;
--font-mono: /* always a monospace option */;
```

### Font Weights
```css
--font-light:     300;
--font-regular:   400;
--font-medium:    500;
--font-semibold:  600;
--font-bold:      700;
--font-extrabold: 800;
```

### Line Heights
```css
--leading-none:    1;
--leading-tight:   1.1;
--leading-snug:    1.25;
--leading-normal:  1.5;
--leading-relaxed: 1.625;
--leading-loose:   2;
```

### Letter Spacing
```css
--tracking-tighter: -0.05em;
--tracking-tight:   -0.025em;
--tracking-normal:  0;
--tracking-wide:    0.025em;
--tracking-wider:   0.05em;
--tracking-widest:  0.1em;
```

---

## 5. Border Radius

```css
--radius-none: 0;
--radius-sm:   0.25rem;   /* 4px */
--radius-md:   0.5rem;    /* 8px */
--radius-lg:   0.75rem;   /* 12px */
--radius-xl:   1rem;      /* 16px */
--radius-2xl:  1.5rem;    /* 24px */
--radius-3xl:  2rem;      /* 32px */
--radius-full: 9999px;
```

---

## 6. Opacity Scale

```css
--opacity-0:   0;
--opacity-3:   0.03;
--opacity-5:   0.05;
--opacity-10:  0.1;
--opacity-20:  0.2;
--opacity-40:  0.4;
--opacity-60:  0.6;
--opacity-80:  0.8;
--opacity-100: 1;
```

---

## 7. Z-Index Scale

```css
--z-behind:   -1;
--z-base:     0;
--z-dropdown: 10;
--z-sticky:   20;
--z-overlay:  30;
--z-modal:    40;
--z-popover:  50;
--z-toast:    60;
--z-tooltip:  70;
--z-max:      9999;
```

---

## 8. Glassmorphism Presets (Adjust colors to match derived palette)

```css
.glass-light {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-medium {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-heavy {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(80px);
  -webkit-backdrop-filter: blur(80px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
```

---

## 9. Gradient Presets (Use derived primary/accent colors)

```css
/* These reference the generated primitive tokens */
--gradient-primary: linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500));
--gradient-subtle:  linear-gradient(135deg,
  color-mix(in srgb, var(--color-primary-500) 10%, transparent),
  color-mix(in srgb, var(--color-accent-500) 10%, transparent));
--gradient-mesh:    radial-gradient(at 40% 20%,
                      color-mix(in srgb, var(--color-primary-500) 15%, transparent) 0px, transparent 50%),
                    radial-gradient(at 80% 0%,
                      color-mix(in srgb, var(--color-accent-500) 10%, transparent) 0px, transparent 50%);
--gradient-border:  linear-gradient(135deg,
  var(--color-primary-400), var(--color-accent-400), var(--color-primary-400));
```
