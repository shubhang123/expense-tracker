# Component Specifications

Detailed specs for reusable UI components. Each spec defines structure, states, styling,
accessibility, and animation behavior.

---

## 1. Button

### Variants
| Variant | Use Case |
|---------|----------|
| `primary` | Main CTA — filled with primary gradient or solid color |
| `secondary` | Secondary action — outlined or subtle fill |
| `ghost` | Tertiary action — transparent background, text only |
| `danger` | Destructive action — red toned |
| `icon` | Icon-only button — circular or square |

### Sizes
| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| `sm` | 32px | 12px 16px | 13px |
| `md` | 40px | 12px 20px | 14px |
| `lg` | 48px | 14px 28px | 16px |
| `xl` | 56px | 16px 32px | 18px |

### States
- **Default**: Base appearance
- **Hover**: Lighten/darken 10%, subtle scale(1.02), shadow increase
- **Active/Pressed**: Scale(0.98), darken further
- **Focus-visible**: 2px primary-colored ring, 2px offset
- **Disabled**: 40% opacity, cursor: not-allowed, no interactions
- **Loading**: Spinner replaces text, width maintained, pointer-events: none

### Animation
```css
.btn {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.btn:hover { transform: translateY(-1px); }
.btn:active { transform: translateY(0) scale(0.98); }
```

### Accessibility
- `role="button"` (if not `<button>`)
- `aria-disabled="true"` when disabled
- `aria-busy="true"` when loading
- Minimum 44x44px touch target
- Visible focus ring on keyboard navigation

---

## 2. Card

### Anatomy
```
┌───────────────────────────┐
│  Image (optional)         │
├───────────────────────────┤
│  Category / Tag           │
│  Title                    │
│  Description (2-line max) │
│  ─────────────────────── │
│  Metadata    │    CTA     │
└───────────────────────────┘
```

### Variants
| Variant | Description |
|---------|-------------|
| `default` | Standard card with shadow |
| `glass` | Glassmorphic with blur backdrop |
| `outlined` | Border-only, no fill |
| `elevated` | Higher elevation shadow |
| `interactive` | Hover lift + glow effect |

### States
- **Default**: Resting position
- **Hover**: translateY(-4px), shadow expands, optional border glow
- **Focus-within**: Focus ring around entire card
- **Loading**: Replace content with skeleton shimmer

### Specs
```css
.card {
  border-radius: var(--radius-xl);  /* 16px */
  padding: var(--space-6);          /* 24px */
  gap: var(--space-4);              /* 16px between elements */
}
```

---

## 3. Input / Text Field

### Anatomy
```
  Label (optional)
┌─────────────────────────────────┐
│ Icon (opt) │ Placeholder / Value │
└─────────────────────────────────┘
  Helper text / Error message
```

### States
| State | Border Color | Background | Label |
|-------|-------------|------------|-------|
| Default | `--border-default` | `--bg-secondary` | Static |
| Hover | `--border-default` lightened | Unchanged | Static |
| Focus | `--primary-500` | Unchanged | Floats up, shrinks, primary color |
| Filled | `--border-default` | Unchanged | Stays floated |
| Error | `--error` | `--error-light` subtle | Error color |
| Disabled | `--border-subtle` | `--bg-tertiary` | Muted |

### Floating Label Animation
```css
.input-wrapper .label {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--text-base);
  color: var(--text-muted);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

.input:focus ~ .label,
.input:not(:placeholder-shown) ~ .label {
  top: 0;
  transform: translateY(-50%) scale(0.85);
  color: var(--primary-500);
  font-weight: var(--font-medium);
}
```

### Accessibility
- `<label>` linked via `htmlFor`/`id`
- `aria-describedby` pointing to helper/error text
- `aria-invalid="true"` on error
- `aria-required="true"` for required fields

---

## 4. Modal / Dialog

### Anatomy
```
┌──── Overlay (dimmed background) ────┐
│  ┌───────────────────────────────┐  │
│  │  Header: Title  │  Close (X)  │  │
│  ├───────────────────────────────┤  │
│  │                               │  │
│  │  Body Content                 │  │
│  │                               │  │
│  ├───────────────────────────────┤  │
│  │  Footer: Cancel  │  Confirm   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Sizes
| Size | Max Width | Use Case |
|------|-----------|----------|
| `sm` | 400px | Confirmation dialogs |
| `md` | 560px | Forms, settings |
| `lg` | 720px | Complex content |
| `xl` | 900px | Data tables, media |
| `full` | 95vw | Full-screen takeover |

### Animation
```tsx
// Framer Motion
const modalVariants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  },
  exit: {
    opacity: 0, scale: 0.97, y: 5,
    transition: { duration: 0.2, ease: [0.7, 0, 0.84, 0] }
  },
};

const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
```

### Accessibility
- Focus trapped inside modal when open
- `Escape` key closes modal
- `aria-modal="true"` and `role="dialog"`
- `aria-labelledby` pointing to title
- Return focus to trigger element on close

---

## 5. Toast / Notification

### Variants
| Variant | Icon | Color |
|---------|------|-------|
| `success` | ✓ Checkmark | Green |
| `error` | ✕ Cross | Red |
| `warning` | ⚠ Triangle | Amber |
| `info` | ℹ Circle | Blue |

### Behavior
- Appears from top-right (desktop) or top-center (mobile)
- Auto-dismiss after 5 seconds (configurable)
- Hover pauses auto-dismiss timer
- Swipe to dismiss on mobile
- Stack up to 3 visible toasts, queue the rest

### Animation
```css
.toast-enter {
  animation: toast-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.toast-exit {
  animation: toast-out 0.3s cubic-bezier(0.7, 0, 0.84, 0) forwards;
}

@keyframes toast-in {
  from { opacity: 0; transform: translateX(100%) scale(0.9); }
  to { opacity: 1; transform: translateX(0) scale(1); }
}

@keyframes toast-out {
  from { opacity: 1; transform: translateX(0) scale(1); }
  to { opacity: 0; transform: translateX(100%) scale(0.9); }
}
```

---

## 6. Navigation Bar

### Desktop
```
┌───────────────────────────────────────────────────┐
│  Logo  │  Nav Links...   │  Search │ CTA │ Avatar │
└───────────────────────────────────────────────────┘
```

### Mobile
```
┌───────────────────────────┐
│  Logo         │  Menu (☰) │
└───────────────────────────┘
        ↓ (opens)
┌───────────────────────────┐
│  Full-screen nav overlay  │
│  with staggered link      │
│  entrance animations      │
└───────────────────────────┘
```

### Scroll Behavior
```css
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: var(--z-sticky);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.navbar--transparent {
  background: transparent;
}

.navbar--solid {
  background: var(--surface-overlay);
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-sm);
}
```

### Active Link Indicator
```css
.nav-link {
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-500);
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}
```

---

## 7. Data Table

### Features
- Sortable headers with icon indicator (▲/▼)
- Row hover highlight
- Inline actions (edit, delete) on hover
- Checkbox selection with bulk actions
- Pagination or infinite scroll
- Responsive: horizontal scroll on mobile, or card view

### Header Sort Animation
```css
.sort-icon {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.sort-asc .sort-icon { transform: rotate(0deg); }
.sort-desc .sort-icon { transform: rotate(180deg); }
```

### Row Styles
```css
.table-row {
  transition: background 0.15s ease;
  border-bottom: 1px solid var(--border-subtle);
}

.table-row:hover {
  background: rgba(59, 130, 246, 0.04);
}

.table-row--selected {
  background: rgba(59, 130, 246, 0.08);
}
```

---

## 8. Empty State

### Anatomy
```
┌───────────────────────────────┐
│                               │
│      Illustration / Icon      │
│                               │
│      Title (what's empty)     │
│      Description (what to do) │
│                               │
│      [ Primary CTA Button ]   │
│                               │
└───────────────────────────────┘
```

### Guidelines
- Always provide a clear CTA — never leave users stuck
- Use a relevant illustration, not a generic one
- Title: state what's empty ("No projects yet")
- Description: guide the action ("Create your first project to get started")
- Center the content both vertically and horizontally

---

## 9. Command Palette (⌘K)

### Behavior
- Trigger: `⌘K` (Mac) / `Ctrl+K` (Windows)
- Fuzzy search across all actions, pages, and content
- Keyboard navigation with arrow keys
- `Enter` to select, `Escape` to close
- Recently used items shown by default
- Grouped results by category

### Animation
```tsx
const commandPaletteVariants = {
  initial: { opacity: 0, scale: 0.96, y: -10 },
  animate: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
  },
  exit: {
    opacity: 0, scale: 0.98,
    transition: { duration: 0.15 }
  },
};
```

### Accessibility
- `role="dialog"` with `aria-label="Command palette"`
- `role="combobox"` for the search input
- `role="listbox"` for results
- `aria-activedescendant` tracking keyboard selection
- Focus trapped when open
