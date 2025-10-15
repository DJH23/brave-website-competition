# Brave Website Competition — Privacy‑First Creator Hub

This repo hosts a Vue 3 (Composition API) + NestJS monorepo for the Brave Website Challenge.

What's included

- Frontend: Vue 3 + Vite + TypeScript + TailwindCSS + a minimal Three.js hero
- Backend: NestJS API with a basic health endpoint
- Monorepo: npm workspaces (apps/\*)
- CI: Node build workflow (optional steps if scripts exist)
- Security: CodeQL workflow

Prereqs

- Node.js 20.x or 18.x LTS (recommended 20.x)
- npm 8+ (npm workspaces)

Getting started

1. Install dependencies at the repo root
   - This installs for all workspaces
2. Run both servers in dev mode

Scripts

- From the repo root:
  - `npm run dev` — Runs web (Vite) and api (Nest) concurrently
  - `npm run build` — Builds both apps
  - `npm run start` — Starts API (prod) and serves the built web preview

App URLs (default)

- Web: <http://localhost:5173>
- API: <http://localhost:3000> (GET /health => { status: 'ok' })

Notes

- Dark theme and Brave-inspired gradient background are enabled by default
- The 3D hero uses Three.js (simple rotating cube placeholder)
- CI steps are resilient: lint/test/build only run if scripts exist

Roadmap

1. Phase 1 — Scaffold ✅
2. Phase 2 — Design system ✅
3. Phase 3 — BAT/Brave integration + content (this PR)
4. Phase 4 — Final polish and optimization

## Design System

Phase 2 introduces a cohesive design system:

### Tailwind Tokens

- Brand colors: `brand-purple`, `brand-orange`, `brand-blue`
- Typography: Inter (sans), JetBrains Mono (mono), with semantic scale
- Spacing: Extended scale (18, 88, 128)
- Shadows: Glow effects (`glow-purple`, `glow-orange`, `glow-blue`)
- Animations: `fade-in`, `slide-up`, `glow`

### UI Components

- `Button.vue`: Three variants (primary, secondary, ghost), three sizes (sm, md, lg), accessible focus states
- `Card.vue`: Default and highlight variants, hover lift effect
- `DarkModeToggle.vue`: Toggles dark/light theme with animated icon switch

### Layout Enhancements

- Animated header with dark mode toggle
- Enhanced footer with external links
- Three-column card grid (responsive)
- Hover/focus micro-interactions

### Usage

```vue
<Button variant="primary" size="md">Click Me</Button>
<Card title="My Card" variant="highlight">Content here</Card>
```

## Phase 3 — Content & BAT Integration

### New Features

**Portfolio Section** (`Portfolio.vue`)

- Development projects showcase with tags and links
- Music productions with BAT-powered streaming
- Responsive grid layout

**Privacy Demos** (`PrivacyDemos.vue`)

- Interactive tracker blocking demo
- Ad blocker visualization
- Privacy score calculator
- Live statistics and animations

**BAT Integration** (`BATIntegration.vue`)

- Brave Wallet connection stub (demo)
- BAT tipping interface
- Balance display and transaction UI
- Educational content about BAT

### Competition Scoring Checklist

✅ **Videos (5 points)**: YouTube embed demo video  
✅ **Images (5 points)**: Screenshot cards, visual placeholders  
✅ **External links (5 points)**: Brave.com, BAT.org, Brave Rewards, Support docs  
✅ **Social media integration (5 points)**: GitHub, Twitter/X, SoundCloud  
✅ **Mobile experience (10 points)**: Responsive design, sticky header, mobile-first  
🔄 **No broken links (5 points)**: All external links tested  
🔄 **Design/Aesthetics (35 points)**: Dark theme, gradients, animations, 3D hero  
🔄 **Brave/BAT Integration (10 points)**: Wallet stub, tipping UI, BAT education

### External Links

- [Brave Browser](https://brave.com)
- [Basic Attention Token](https://basicattentiontoken.org)
- [Brave Rewards](https://brave.com/brave-rewards/)
- [Brave Support](https://support.brave.com)
