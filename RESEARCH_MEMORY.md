# RESEARCH_MEMORY.md — Cares4ME Design Agent

## USER: mithilgajera1
Last updated: 2026-03-21

## LEARNED PREFERENCES

### ✅ Loves
- Hero layout: Fixed glassmorphism signature (full-screen, centered)
- CTA amount: $100 impact messaging always
- Stats layout: 4-column grid with gradient numbers
- Gallery: 3D hover cards with gradient placeholders
- Trust signals: "100% goes to programs" badge in hero
- Testimonials: Real names + gradient placeholder photos

### ❌ Avoid
- Stock photos (never)
- $25 CTA messaging (always $100)
- Hero experimentation
- AI clichés in copy

### 📊 Research Answers (Locked)
- Competitor inspiration: St. Jude Children's Research Hospital (stjude.org)
- Mobile traffic: 70%
- Social proof style: Real names + placeholder photos (not anonymous)
- Tone: Hope + dignity + waste-free efficiency (10th-grade reading level)
- Load target: <1.5s Core Web Vitals A grade

## THEMES BUILT
1. ✅ health-hope — "Restoring Health. Renewing Hope." → caresforu.com/health-hope
   - Brief: research/health-hope-brief.json
   - Page: src/app/health-hope/page.tsx

## PROJECT PROGRESS (as of 2026-03-22)

### Key Achievements
- Discord bot upgraded to discord.js v14, runs with `npm run bot`, processes image uploads in real time.
- .env.local configured with Discord bot token and webhook.
- Next.js frontend runs locally, logo image issues fixed (now using `/loggoo.jpg`).
- Public folder contains all required assets.
- Clarified Discord bot must run continuously; Vercel deploys only frontend.
- Provided git commit/push instructions for Vercel deployment.

### Next Steps
- Integrate Discord bot uploads with Google Sheets for metadata.
- Update gallery to fetch/filter images from Google Sheets.
- Consider background/auto-start for Discord bot.

## NEXT THEME
- Awaiting rating + Love/Change + next theme from user
