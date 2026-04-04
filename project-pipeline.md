# Care4ME Project Pipeline & Optimization Plan

## Revenue & Key Missing Features

### Revenue
- Donations (Venmo.me, PayPal.me, Stripe free tier)
- Grants (track in Google Sheets)
- In-kind donations (track in Google Sheets)

### Key Missing Features (from analysis)
- Backend API & database for all forms
- Authentication/admin access
- Email routing (Formspree/EmailJS)
- Payment gateway hardening, logging, reconciliation, and production operations
- QR code system for forms/campaigns
- 3D image/model support
- Admin CMS for content/media
- SEO/AI content generation
- Accessibility & analytics

## Deployment Safety Notes

- Keep short-lived backup branches for significant releases before merging to `main`
- Current backup branch for campaign payment rollout: `backup/campaign-paypal-2026-04-04`
- Current backup branch for singleton CMS rollout: `backup/singleton-cms-2026-04-04`
- Keep backup branch until production behavior is stable, then delete local and remote copies
- Preferred rollback path is `git revert` on `main`; backup branch is secondary restore point
- When deleting later:
	- local: `git branch -d backup/campaign-paypal-2026-04-04`
	- remote: `git push origin --delete backup/campaign-paypal-2026-04-04`
	- local: `git branch -d backup/singleton-cms-2026-04-04`
	- remote: `git push origin --delete backup/singleton-cms-2026-04-04`

## Current Pipeline Status

- **Foundation / frontend shell**: complete
- **Blog publishing workflow**: complete first version via Discord bot + JSON/file storage
- **Campaign management workflow**: complete first version via Discord bot + JSON/file storage
- **Singleton page editing workflow**: complete first version via Discord bot + JSON/file storage
- **Campaign payment flow**: complete first version using PayPal Smart Buttons with Venmo eligibility through PayPal
- **Backend API + database platform**: pending
- **Admin authentication**: pending
- **Form submission/data layer**: pending
- **QR code system**: pending
- **3D media support**: pending
- **Analytics / accessibility hardening**: pending

---

## 1. Backend Editing & Media Upload (Tier 1)
- Build admin backend for easy content/media editing (Strapi Community Edition, Directus, or simple Next.js API routes)
- Media upload API (images, 3D, video)
- Store files in /public or free cloud
- Gallery: Upload all images from public folder, enable tagging/captioning for each image

## 1A. Singleton CMS Expansion
- Extend `!page-edit` coverage to the remaining content-driven singleton sections where page owners need Discord control
- Keep `content/pages/*.json` as the source of truth until a backend/admin system replaces file-based editing
- Preserve shared loader approach so homepage featured campaign, campaign pages, and singleton pages all read through centralized access logic

## 2. 3D Image Support (Past Phase)
- Integrate 3D image viewer for gallery/campaigns (Three.js, react-three-fiber – both free)
- Backend: Store 3D models (GLTF/GLB) and images in /public or free cloud (Cloudinary free tier)

- Build admin backend for easy content/media editing (Strapi Community Edition, Directus, or simple Next.js API routes)
- Media upload API (images, 3D, video)
- Store files in /public or free cloud

## 3. Form Generation
- Auto-generate forms for volunteers, donations, etc. (React Hook Form, Formik – free)
- Volunteer hours form with logo, data storage (Google Sheets API, Supabase free tier)
- QR code for each form (qrcode.react or goqr.me), link to social/subscribe

## 4. Data Management
- Store all form submissions securely (Supabase, Google Sheets, or SQLite – all free)
- Dashboard for admin review (simple Next.js page, or free Strapi/Directus dashboard)

## 5. SEO & AI Content
- Use Karpathy's autoresearch (open source) + Alli AI (if free tier available) for SEO
- AI blog post generator (OpenAI free tier, Ollama, or HuggingFace models)
- Use https://github.com/msitarzewski/agency-agents for agents: frontend-developer, database-optimizer, ui-designer

## 6. Marketing Tools
- QR code generator for forms/socials (qrcode.react, goqr.me)
- Social subscribe links
- Email routing for all inquiries (Formspree, EmailJS, or Gmail SMTP – all have free plans)
- PayPal Smart Buttons with Venmo eligibility for donations; next step is operational hardening and reporting

## 7. Further Optimization
- Use only free/open-source tools and APIs
- Add Google Analytics 4 (free), Fathom Lite (open source), or Plausible (free self-hosted)
- Accessibility: Use axe-core, Lighthouse (both free)
- Research and implement more free tools as needed

---

This file is a living reference for the Care4ME pipeline and optimization plan. All tools listed are free or have a free tier. Update as features are completed or new needs arise.
