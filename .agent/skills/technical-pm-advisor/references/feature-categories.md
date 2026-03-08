# Feature Categories & Benchmarks

## Feature Taxonomy

### 1. Core UX Features
Features that are part of the primary user workflow.
- **Typical Effort**: Medium–High
- **Impact when missing**: Churn-causing
- **Examples**: Onboarding flow, primary action (create/send/publish), navigation

### 2. Retention Features
Features that bring users back and build habits.
- **Typical Effort**: Medium
- **Impact when missing**: Slow DAU/MAU decline
- **Examples**: Notifications, streaks, progress tracking, email digests, re-engagement flows

### 3. Growth / Viral Features
Features that help the product acquire new users organically.
- **Typical Effort**: Medium
- **Impact when present**: Can reduce CAC significantly
- **Examples**: Referral programs, shareable content, embeds, public profiles, social proof

### 4. Monetization Features
Features that convert users to paying customers or increase revenue.
- **Typical Effort**: Low–Medium (if model is clear)
- **Risk**: Can damage trust if implemented poorly
- **Examples**: Paywalls, pricing pages, upgrade prompts, billing management, trial flows

### 5. Collaboration Features
Features that enable multiple users to work together.
- **Typical Effort**: High (requires real-time or async infrastructure)
- **Impact**: Can expand deal size (B2B) or social graph (consumer)
- **Examples**: Shared workspaces, comments, permissions/roles, presence indicators

### 6. Developer Experience (DevEx) Features
For developer-facing products: APIs, SDKs, documentation, integrations.
- **Typical Effort**: Medium
- **Impact**: Directly affects adoption and time-to-value
- **Examples**: API keys, webhooks, SDKs, sandbox environments, detailed error messages

### 7. Analytics & Insights Features
Features that give users data about their own usage or outcomes.
- **Typical Effort**: Medium
- **Impact**: Increases perceived value, reduces churn
- **Examples**: Dashboards, reports, exports, benchmarks, usage stats

### 8. Administrative / Settings Features
Account management, security, compliance, preferences.
- **Typical Effort**: Low–Medium
- **Often undervalued but causes B2B churn if missing**
- **Examples**: SSO, 2FA, audit logs, data export, account deletion, billing history

### 9. Integration Features
Connecting to third-party tools users already use.
- **Typical Effort**: Medium per integration
- **Impact**: Increases stickiness and workflow fit
- **Examples**: Zapier, Slack, Google Workspace, CRM integrations, API integrations

### 10. AI / Intelligent Features
Features that use ML or AI to automate or enhance user tasks.
- **Typical Effort**: High (but decreasing with modern APIs)
- **Competitive signal**: Rapidly becoming table stakes in most categories
- **Examples**: Smart suggestions, auto-categorization, natural language input, anomaly detection

---

## Effort Benchmarks by Category

| Feature Category | Typical Effort (person-weeks) |
|-----------------|-------------------------------|
| Copy / UI tweak | 0.5 |
| Simple settings | 1 |
| New page / screen | 1–2 |
| Notification system | 2–4 |
| OAuth integration | 1–2 |
| Stripe billing | 3–5 |
| Real-time collaboration | 8–16 |
| ML/AI feature (using API) | 4–8 |
| Mobile app (from web) | 12–20 |
| Full API + docs | 6–10 |
| Admin panel | 4–8 |
| Analytics dashboard | 4–6 |

---

## Competitive Table Stakes by Product Category

### SaaS B2B Tool — Must Haves
- SSO / SAML
- Role-based permissions
- Audit logs
- Data export (CSV/API)
- Team management
- SLA / uptime page

### Consumer Mobile App — Must Haves
- Push notifications
- Onboarding tutorial
- Dark mode
- Offline support (or graceful error)
- Share / invite flow
- Settings & account management

### Developer Tool / API — Must Haves
- API key management
- Comprehensive docs + quickstart
- SDKs in top 3 languages
- Sandbox/test mode
- Status page + alerts
- Webhooks

### Marketplace / Two-Sided Platform — Must Haves
- Search + filters
- Trust signals (ratings/reviews)
- Identity verification
- Messaging between parties
- Dispute resolution
- Payment handling