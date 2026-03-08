# Animation Recipes

Copy-paste animation code for common UI patterns. Each recipe includes the recommended library
and a complete implementation.

---

## 1. Fade-In on Scroll (Intersection Observer)

**Library**: Vanilla JS (no dependency needed)

```javascript
// Reusable scroll reveal
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
```

```css
[data-reveal] {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

[data-reveal].revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children */
[data-reveal-stagger] > * {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

[data-reveal-stagger].revealed > *:nth-child(1) { transition-delay: 0ms; }
[data-reveal-stagger].revealed > *:nth-child(2) { transition-delay: 75ms; }
[data-reveal-stagger].revealed > *:nth-child(3) { transition-delay: 150ms; }
[data-reveal-stagger].revealed > *:nth-child(4) { transition-delay: 225ms; }
[data-reveal-stagger].revealed > *:nth-child(5) { transition-delay: 300ms; }

[data-reveal-stagger].revealed > * {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  [data-reveal], [data-reveal-stagger] > * {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

---

## 2. Magnetic Button

**Library**: Vanilla JS

```javascript
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
    btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  btn.addEventListener('mouseenter', () => {
    btn.style.transition = 'none';
  });
});
```

---

## 3. Glassmorphic Card Hover

**Library**: CSS only

```css
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15),
              0 0 40px rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
}

@media (prefers-reduced-motion: reduce) {
  .glass-card { transition: none; }
  .glass-card:hover { transform: none; }
}
```

---

## 4. Kinetic Text Reveal (Framer Motion)

```tsx
import { motion } from 'framer-motion';

const KineticText = ({ text }: { text: string }) => {
  const words = text.split(' ');

  return (
    <h1 className="text-hero font-bold">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, rotateX: -40 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.8,
            delay: i * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: 'inline-block', marginRight: '0.3em' }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
};
```

---

## 5. Smooth Number Counter

**Library**: Framer Motion

```tsx
import { useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

const Counter = ({ target, duration = 2 }: { target: number; duration?: number }) => {
  const [display, setDisplay] = useState(0);
  const motionValue = useMotionValue(0);

  useEffect(() => {
    const controls = animate(motionValue, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [target, duration, motionValue]);

  return <span>{display.toLocaleString()}</span>;
};
```

---

## 6. Skeleton Loading Shimmer

**Library**: CSS only

```css
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.03) 25%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.03) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 0.5rem;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-text {
  height: 1em;
  margin-bottom: 0.5em;
}

.skeleton-title {
  height: 1.5em;
  width: 60%;
  margin-bottom: 1em;
}

.skeleton-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; }
}
```

---

## 7. Page Transition (Framer Motion + Next.js)

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

const pageVariants = {
  initial: { opacity: 0, y: 20, filter: 'blur(4px)' },
  enter: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: 'blur(4px)',
    transition: { duration: 0.3, ease: [0.7, 0, 0.84, 0] }
  },
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={router.pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
```

---

## 8. GSAP ScrollTrigger Parallax

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Parallax hero background
gsap.to('.hero-bg', {
  yPercent: -30,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
});

// Staggered card reveal
gsap.from('.feature-card', {
  y: 80,
  opacity: 0,
  duration: 0.8,
  ease: 'expo.out',
  stagger: 0.1,
  scrollTrigger: {
    trigger: '.features-grid',
    start: 'top 80%',
  },
});
```

---

## 9. Smooth Scroll (Lenis)

```javascript
import Lenis from '@studio-freight/lenis';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
```

---

## 10. 3D Card Tilt

**Library**: Vanilla JS

```javascript
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `
      perspective(1000px)
      rotateY(${x * 10}deg)
      rotateX(${y * -10}deg)
      scale(1.02)
    `;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
  });
});
```

---

## Easing Reference

| Name | CSS Value | Use Case |
|------|-----------|----------|
| Ease Out Expo | `cubic-bezier(0.16, 1, 0.3, 1)` | Element entering/appearing |
| Ease In Expo | `cubic-bezier(0.7, 0, 0.84, 0)` | Element exiting/disappearing |
| Ease In Out Expo | `cubic-bezier(0.87, 0, 0.13, 1)` | State change (toggle, switch) |
| Ease Out Back | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful overshoot (tooltips, badges) |
| Ease Out Circ | `cubic-bezier(0, 0.55, 0.45, 1)` | Smooth deceleration (page transitions) |
| Spring | Framer Motion: `{ type: "spring", stiffness: 300, damping: 30 }` | Natural, physics-based motion |
