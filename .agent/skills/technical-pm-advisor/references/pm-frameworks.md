# PM Frameworks Reference

## 1. KANO Model

Use when deciding whether a feature is worth building at all.

| Type | Description | Example | Effect if absent |
|------|-------------|---------|-----------------|
| **Must-be** | Expected baseline | Password reset | Causes dissatisfaction |
| **One-dimensional** | More = better | Faster load time | Proportional satisfaction |
| **Attractive** | Unexpected delight | AI-powered suggestion | Increases delight when present |
| **Indifferent** | Users don't care | Backend refactor | No effect |
| **Reverse** | Unwanted | Intrusive popups | Causes dissatisfaction |

**How to use**: Before building any feature, classify it. Focus on Must-bes first, then One-dimensional, then Attractive.

---

## 2. Jobs-to-be-Done (JTBD)

Use when evaluating feature value from the user's perspective.

Framework: *"When [situation], I want to [motivation], so I can [outcome]."*

Example:
> "When I finish a project, I want to share it with my client, so I can get feedback without a back-and-forth email chain."

**How to use**: Write a JTBD statement for each proposed feature. If you can't write a clear one, the feature probably isn't solving a real need.

---

## 3. MoSCoW Prioritization

Use as a fast secondary check on roadmap placement.

| Category | Meaning |
|----------|---------|
| **Must Have** | Non-negotiable for launch/sprint |
| **Should Have** | Important but not critical |
| **Could Have** | Nice to have if time allows |
| **Won't Have** | Out of scope for now |

---

## 4. North Star Metric Framework

Every product should have ONE North Star Metric (NSM) that represents core user value.

- Airbnb: Nights booked
- Slack: DAUs sending messages
- Spotify: Time spent listening
- Notion: Documents created per user

**How to use**: When evaluating features, ask "Does this feature move the North Star Metric?" Features that don't connect to the NSM should be questioned.

---

## 5. The Pirate Metrics (AARRR)

Map every feature to a funnel stage:

| Stage | What it measures | Relevant features |
|-------|-----------------|-------------------|
| **Acquisition** | New users coming in | SEO, ads, referral, virality |
| **Activation** | First "aha moment" | Onboarding, quick wins, templates |
| **Retention** | Coming back | Notifications, habits, value delivery |
| **Revenue** | Paying | Upgrade prompts, pricing, billing |
| **Referral** | Inviting others | Share, invite, referral program |

**How to use**: When suggesting new features, assign each to a funnel stage. A balanced product has features at every stage.

---

## 6. Effort/Impact Matrix

Quick 2×2 for visual prioritization:

```
        HIGH IMPACT
             │
  DO FIRST   │   PLAN CAREFULLY
  (Quick Win)│   (Major Project)
─────────────┼──────────────────── EFFORT
  FILL TIME  │   AVOID / DELEGATE
  (Low value)│   (Time sink)
             │
         LOW IMPACT
```

Map every feature on this matrix before assigning to a sprint.

---

## 7. Feature Scoring Weights (Suggested)

When combining multiple frameworks, use these weights for a composite score:

| Factor | Weight |
|--------|--------|
| User Value (KANO Must-be / JTBD) | 30% |
| RICE Score | 25% |
| Strategic Alignment (NSM) | 20% |
| Technical Feasibility | 15% |
| Competitive Necessity | 10% |

**Composite Priority Score = sum of (weight × normalized score) for each factor**