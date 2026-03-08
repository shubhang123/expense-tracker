# RICE Scoring Guide

## What is RICE?

RICE is a prioritization framework developed by Intercom. It scores features by four factors:

**RICE = (Reach × Impact × Confidence) / Effort**

---

## Factor Definitions

### Reach (per quarter)
How many users will be affected by this feature in a given quarter?

Use a relative scale of 1–10 based on your user base:
- **1–2**: Only a small niche of power users
- **3–4**: A meaningful segment (e.g., mobile users, paid users)
- **5–6**: Majority of active users
- **7–8**: Nearly all active users
- **9–10**: All users, including new sign-ups

### Impact (per user affected)
How much will this move the needle for each user it touches?

Use Intercom's scale:
- **3** = Massive impact (core workflow improvement, significant time saved)
- **2** = High impact (noticeably better experience)
- **1** = Medium impact (slight improvement, user would appreciate it)
- **0.5** = Low impact (minor convenience)
- **0.25** = Minimal impact (barely noticeable)

### Confidence (%)
How confident are you this feature will achieve the expected reach and impact?

- **100%** = You have strong data, user research, or precedent
- **80%** = You have some evidence (competitor success, user requests)
- **60%** = You have a reasonable hypothesis
- **40%** = It's mostly an assumption
- **20%** = It's a guess / experimental

Convert to decimal: 80% = 0.8

### Effort (person-weeks)
Total engineering + design + PM time, expressed in person-weeks.

- **0.5** = A few hours (config change, copy tweak)
- **1** = 1 engineer for 1 week
- **2** = 1 engineer for 2 weeks, or 2 engineers for 1 week
- **4** = A typical sprint for a small team
- **8** = A major feature (1–2 month build)
- **16+** = A large project

---

## Example Calculations

### Example 1: Push Notifications
- Reach: 8 (affects most active users)
- Impact: 2 (high — brings users back)
- Confidence: 0.8 (retention data from competitors shows it works)
- Effort: 2 (standard mobile push implementation)
- **RICE = (8 × 2 × 0.8) / 2 = 6.4**

### Example 2: Dark Mode
- Reach: 6 (requested by many users)
- Impact: 0.5 (low — nice to have, not core)
- Confidence: 0.9 (we know users want it)
- Effort: 3 (requires theming overhaul)
- **RICE = (6 × 0.5 × 0.9) / 3 = 0.9**

### Example 3: AI-Powered Search
- Reach: 9 (all users use search)
- Impact: 3 (massive — transforms core workflow)
- Confidence: 0.6 (promising but uncertain)
- Effort: 12 (significant build)
- **RICE = (9 × 3 × 0.6) / 12 = 1.35**

---

## Interpreting RICE Scores

| Score Range | Interpretation |
|-------------|----------------|
| 10+ | Top priority — high ROI, do first |
| 5–10 | Strong priority — schedule soon |
| 2–5 | Medium priority — plan for next cycle |
| 1–2 | Lower priority — backlog |
| < 1 | Deprioritize — low ROI |

---

## Common Mistakes

1. **Inflating confidence** — Be honest. Most features are 60–70% confidence at best.
2. **Underestimating effort** — Always add 30% buffer to initial estimates.
3. **Ignoring dependencies** — A feature with a RICE of 8 that needs 3 other features first is effectively a RICE of 2 today.
4. **Using RICE in isolation** — Combine with strategic alignment. A RICE-2 feature that is strategically critical may trump a RICE-6 feature.