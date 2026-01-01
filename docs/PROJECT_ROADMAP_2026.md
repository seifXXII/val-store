# Val Store — 2026 Project Roadmap

_Last updated: 2025-12-30_

This roadmap condenses all open work into a clear, time-boxed plan. It is organised by phase, each with a target duration, explicit exit criteria and the GitHub labels / milestones you should use when filing issues.

> NOTE All dates are **estimates** assuming a two-developer team working full-time (≈ 35 effective hrs/week each). Adjust as velocity data becomes available.

---

## Phase A – Critical Commerce Flow 🗓 Jan 8 → Feb 2 (4 weeks)

Focus on un-blocking revenue generation: cart → checkout → payment → order email.

| Epic                     | Key Deliverables                                                                                                                       | Exit Criteria                                     |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **A1 Admin Fix**         | • Resolve blank dashboard<br>• Smoke-test existing admin routes                                                                        | Dashboard and sidebar render w/ no console errors |
| **A2 Cart MVP**          | • `<CartProvider>` + localStorage sync<br>• Drawer + `/cart` page w/ qty, remove<br>• Add-to-cart buttons on product cards             | Add, update, remove items works across refresh    |
| **A3 Checkout + Stripe** | • `/checkout` wizard (shipping → payment)<br>• Stripe PaymentIntent integration<br>• Webhook: `payment_intent.succeeded` updates order | Complete paid order visible in DB & admin         |
| **A4 Order Emails**      | • Resend config<br>• Basic order-receipt template                                                                                      | Customer receives email within 30 sec of payment  |

---

## Phase B – Customer Account & Wishlist 🗓 Feb 5 → Feb 23 (3 weeks)

Improve post-purchase experience and retention.

| Epic                 | Key Deliverables                                  | Exit Criteria                           |
| -------------------- | ------------------------------------------------- | --------------------------------------- |
| **B1 Account Area**  | Dashboard, profile, address book, password change | All pages reachable, data persists      |
| **B2 Order History** | `/account/orders` list + detail page              | Past purchase visible w/ items & totals |
| **B3 Wishlist**      | DB repo, API, UI (heart icon, `/wishlist`)        | Add / remove / move-to-cart works       |

---

## Phase C – Admin Operations 🗓 Feb 26 → Mar 29 (4 weeks)

Give staff the tools to run the store day-to-day.

| Epic                | Key Deliverables                                      | Exit Criteria                            |
| ------------------- | ----------------------------------------------------- | ---------------------------------------- |
| **C1 Inventory**    | Overview, low-stock alerts, adjust stock, history log | Stock adjusted via UI reflects in DB     |
| **C2 Customers**    | List, detail, order list, deactivate/reactivate       | Admin can deactivate & it blocks login   |
| **C3 Coupons**      | CRUD UI, validation in checkout, usage stats          | Valid coupon reduces total, bad code msg |
| **C4 Analytics v1** | Revenue charts, top products, export CSV              | 5 core KPIs load < 2 s on prod data      |

---

## Phase D – Quality & Scaling 🗓 Apr 1 → Apr 26 (4 weeks)

Harden the codebase and prepare for traffic.

| Epic                      | Key Deliverables                              | Exit Criteria                         |
| ------------------------- | --------------------------------------------- | ------------------------------------- |
| **D1 Testing Suite**      | Vitest unit, tRPC integration, Playwright E2E | 80% lines, checkout E2E green in CI   |
| **D2 Error Handling**     | Global `<ErrorBoundary>`, API error mapper    | 500 UI page + toast errors everywhere |
| **D3 Rate Limiting**      | Upstash-rate-limit on auth & critical APIs    | 5 bad logins/IP ➜ 429 for 15 min      |
| **D4 SEO / Static Pages** | About, FAQ, privacy, robots.txt, sitemap.xml  | Lighthouse SEO score ≥ 95             |

---

## Phase E – Enhancements & CMS 🗓 Apr 29 → May 31 (5 weeks)

Polish and add marketing power.

| Epic                      | Key Deliverables                                                                              | Exit Criteria                            |
| ------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------- |
| **E1 Product Reviews**    | Review entity, API, UI w/ stars + moderation                                                  | Customers can submit & admin approve     |
| **E2 Admin CMS**          | Implement tasks in `docs/ADMIN_CMS_TASKS.md` :<br>site settings, content sections, versioning | Hero, announcement bar editable by admin |
| **E3 OAuth Login**        | Google & Facebook via Better Auth                                                             | Social buttons functional in prod        |
| **E4 Advanced Analytics** | Funnel, LTV, export PDFs                                                                      | Monthly PDF emailed to admins            |

---

## Cross-Phase Quick Wins (Any Sprint)

1. Skeleton loaders on all list/grid pages
2. 404 / 500 custom pages
3. Meta-tags per product & category
4. Centralised toast success/error util
5. Upgrade to latest Next JS minor versions promptly

---

## Milestone Mapping

Use these GitHub milestones when filing issues:

- `A-Critical-Commerce`
- `B-Account-Wishlist`
- `C-Admin-Operations`
- `D-Quality-Scaling`
- `E-Enhancements-CMS`

---

## RACI Overview

| Phase | Responsible         | Accountable | Consulted    | Informed     |
| ----- | ------------------- | ----------- | ------------ | ------------ |
| A     | Dev-Team            | PM          | Designer, QA | Stakeholders |
| B     | Dev-Team            | PM          | QA           | Stakeholders |
| C     | Dev-Team            | PM          | Ops, QA      | Stakeholders |
| D     | Dev-Team & QA       | Tech Lead   | DevOps       | Stakeholders |
| E     | Dev-Team / Designer | PM          | Marketing    | Stakeholders |

---

## Review & Update Cadence

• **Weekly** – Stand-up & board grooming  
• **Bi-weekly** – Demo & retrospective  
• **Monthly** – Roadmap checkpoint; adjust estimates if slipped >20%  
• **Post-launch (Q3 2026)** – Convert roadmap to maintenance backlog
