# Missing Public Pages Referenced by UI

**Last updated:** 2026-01-13

This doc lists public-facing pages that are referenced by navigation/footer/CTAs, but do not appear to exist in the current `src/app` route tree (based on the analysis so far).

## 1) Referenced by Footer

Source: `src/components/layout/Footer.tsx`

### 1.1 Customer Care

- `/contact`
- `/shipping`
- `/returns`
- `/size-guide`
- `/faq`

### 1.2 Company

- `/about`
- `/careers`
- `/sustainability`
- `/press`
- `/blog`

### 1.3 Legal

- `/privacy`
- `/terms`

## 2) Referenced by CMS defaults / content schemas

Source: `src/domain/value-objects/content-schemas.ts`

- Hero default `ctaLink`: `/collections` (but `/collections` index is currently a stub)
- Brand story default `ctaLink`: `/about` (page missing)

## 3) Referenced elsewhere (to confirm)

This section will be expanded as more UI components are reviewed.

## 4) Recommendation

- Either:
  - implement minimal versions of these pages (even simple static pages) to avoid dead links
  - or remove/disable links until implemented

A good approach is to create a `/legal/*` and `/help/*` structure later, but for now having placeholder routes is better than 404s.
