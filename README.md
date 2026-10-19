<div align="center">

# Pabitra Mohan Singh – Portfolio & Projects

**A personal portfolio and showcase of software engineering work, built with Astro, Tailwind CSS, and TypeScript.**

[![Astro](https://img.shields.io/badge/Astro-7.x-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Hono](https://img.shields.io/badge/Hono-E36002?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=0F0F0F)](https://orm.drizzle.team/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.7.x-0a0a0a?style=for-the-badge&logo=betterauth&logoColor=white)](https://www.better-auth.com/)

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

</div>

---

## 📸 Demo & Screenshots

**Live Site:** [pabitramohansingh.com](https://pabitramohansingh.com)  
**Featured Projects:** [Letters](https://letters.pabitramohansingh.com) · [Toolkit](https://toolpabitrams.pages.dev)

*(Add your screenshots here – see the reference for desktop/mobile light/dark image grids.)*

---

## ✨ Features

- **SEO Optimized for 2026** – Includes `sitemap.xml`, `robots.txt`, `llms.txt`, `humans.txt`, `security.txt`, and advanced JSON-LD `@graph` schemas for Google, Bing, and AI search engines.
- **Zero-JS by Default** – Powered by Astro's islands architecture for lightning-fast page loads.
- **Fully Responsive** – Mobile-first layout designed with Tailwind CSS.
- **Dark / Light Theme** – Seamless client-side toggle with local storage persistence.
- **Dynamic Project Pages** – Uses Astro Content Collections for MDX-based project write-ups.
- **Interactive 404 Page** – Custom animated avatar and a typewriter effect.
- **Accessible** – Semantic landmarks, heading hierarchy, and skip-to-main-content link.
- **TypeScript** – End-to-end strict type checking.
- **Modular CSS Architecture** – Cascade layers with tokens, base, components, and animations.

---

## 🛠️ Technology Stack

### Core
- **Framework**: [Astro](https://astro.build/) (v7.x, server output)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4.x)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (v7.x)

### Project Specific (Letters & Toolkit)
- **Frontend**: [React](https://react.dev/) (v19.x) + [Vite](https://vitejs.dev/) (v6.x)
- **Backend**: [Hono](https://hono.dev/) (v4.x) on [Cloudflare Workers](https://workers.cloudflare.com/)
- **Database**: [Drizzle ORM](https://orm.drizzle.team/) (v0.45.x) + [Cloudflare D1](https://developers.cloudflare.com/d1/)
- **Auth**: [Better Auth](https://www.better-auth.com/) (v1.7.x)
- **AI Moderation**: Llama Guard 3 via Cloudflare AI

### Tooling & Deployment
- **Bundler**: Vite (integrated with Astro)
- **Package Manager**: PNPM (or npm)
- **Version Control**: Git & GitHub
- **Deployment**: Cloudflare Pages / Workers Builds

---

## 🏗️ Architecture Overview

The codebase follows a feature-based architecture designed for clarity and maintainability.

### Core Layers
- **`src/core/`** – Shared infrastructure (auth, database)
- **`src/shared/`** – Reusable UI, SEO, scripts, and styles used across the site
- **`src/features/`** – Self-contained feature modules (home, guestbook)
- **`src/layouts/`** – Page shell (`BaseLayout.astro`)
- **`src/pages/`** – Route definitions and API endpoints
- **`src/styles/`** – Global design tokens, base styles, and animation utilities
- **`src/db/`** – Drizzle schema and database client

### Dependency Flow

pages → layouts → features → shared → core → db

- Pages import from layouts, features, and shared
- Features import from shared and core
- Shared imports from core
- Core imports from db

This hierarchy prevents circular dependencies and keeps the codebase predictable.

### Feature Module Structure

features/<name>/
├── components/     # Astro components
├── scripts/        # Client-side behavior
└── styles/         # Feature-scoped CSS (when needed)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22.x
- PNPM 10.x (or npm)
- Cloudflare account (for deployment)
- Google OAuth credentials (for guestbook sign-in)

### Installation
git clone https://github.com/thepabitrams/the.git
cd the
pnpm install

### Local Environment
Create `.dev.vars` at the project root:

BETTER_AUTH_SECRET=<your-secret>
BETTER_AUTH_URL=http://localhost:4321
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>

`.dev.vars` is gitignored. Never commit it.

### Database Setup (Letters Project)
Generate and apply Drizzle migrations locally:

npx drizzle-kit generate
npx wrangler d1 migrations apply guestbook-db --local

### Development
Start the dev server:

pnpm dev

The site will be available at `http://localhost:4321`.

### Production Build

pnpm build

### Manual Deploy

pnpm build
npx wrangler deploy

---

## 🌐 Deployment

Production deployment is automated via **Cloudflare Workers Builds**.

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `pnpm run build` |
| Deploy command | `npx wrangler deploy` |
| Preview command | `npx wrangler versions upload` |

Push to `main` triggers a production deploy. Pushes to any other branch create preview versions.

### Required Secrets
Set once via Wrangler:

npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET

### Cloudflare Bindings
Configured in `wrangler.jsonc`:
- DB – D1 database (guestbook-db)
- SESSION – KV namespace (auto-provisioned)
- AI – Workers AI binding
- IMAGES – Cloudflare Images binding
- ASSETS – Static asset binding

---

## 📁 Folder Structure

src/
├── core/                # Shared infrastructure
├── db/                  # Drizzle schema and client
├── features/            # Feature modules
├── layouts/             # Page shell
├── pages/               # Routes and API endpoints
├── shared/              # Reusable UI and utilities
└── styles/              # Modular CSS architecture

public/                  # Static assets
astro.config.mjs         # Astro configuration
wrangler.jsonc           # Cloudflare Workers configuration
drizzle.config.ts        # Drizzle ORM configuration
tsconfig.json            # TypeScript configuration
package.json             # Project manifest

---

## 🤝 Contributing

Issues and PRs are welcome. Please ensure your changes are tested and follow the existing code style.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE). See [LICENSES](./LICENSES/) for third-party attributions.

---

## 📚 Documentation

- [CSS Architecture](./src/styles/README.md) – Design system, cascade layers, and usage guidelines.

---

## 🙏 Acknowledgements

Built with Astro, Tailwind CSS, and TypeScript. Designed with a modular, scalable architecture for maintainability and developer experience.

---

<div align="center">

**Made by [Pabitra Mohan Singh](https://www.linkedin.com/in/pabitramohansingh)**

</div>