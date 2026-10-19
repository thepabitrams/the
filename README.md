<div align="center">

# Personal Site by Pabitra Mohan Singh

**A personal portfolio and showcase built with Astro, Tailwind CSS, and TypeScript.**

[![Astro](https://img.shields.io/badge/Astro-7.x-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MDX](https://img.shields.io/badge/MDX-8.x-1B1F24?style=for-the-badge&logo=mdx&logoColor=white)](https://mdxjs.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-14.x-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://www.cloudflare.com)
[![Wrangler](https://img.shields.io/badge/Wrangler-4.x-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/workers/wrangler/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

</div>

## Features

| Feature | Description |
| :--- | :--- |
| **2026 SEO Ready** | Advanced JSON-LD `@graph` schemas, dynamic sitemap, `robots.txt`, `llms.txt`, and `humans.txt`. |
| **Zero-JS Architecture** | Built with Astro for instant, lightning-fast page loads with zero unnecessary JavaScript. |
| **Dynamic Content** | Project case studies and pages are powered by MDX and Astro Content Collections. |
| **Modern UI/UX** | Fully responsive mobile-first design with a seamless dark/light theme toggle. |
| **Interactive 404** | A custom 404 page featuring a breathing avatar and a live typewriter effect. |
| **Accessibility** | Semantic HTML, proper heading hierarchy, and a skip-to-content link for screen readers. |

## 🛠️ Technology Stack

- Astro 7
- Tailwind CSS 4
- TypeScript 7
- MDX (via @astrojs/mdx)
- Cloudflare Pages (via @astrojs/cloudflare)
- Wrangler
- Node.js (v22.12.0)
- PNPM

## Architecture Overview

The codebase follows a clean, modular architecture designed for maintainability and a clear separation of concerns.

### Project Root

- **`src/`** – Contains all application source code.
- **`public/`** – Holds static assets and root files like robots.txt, llms.txt, and image folders.
- **`THIRDPARTY/`** – Contains bundled license texts for third-party dependencies like Astro and Tailwind.
- **`astro.config.mjs`** – The main Astro configuration file.
- **`package.json`** – The project manifest for dependencies and scripts.

### `src/` Root-Level Folders

- **`_pages/`** – Houses page-specific view components grouped by route.
- **`pages/`** – Contains file-based routing entry points and API endpoints like sitemap.xml.ts.
- **`layouts/`** – Provides page shells that wrap content and handle global structure.
- **`shared/`** – Contains reusable building blocks split by concern (components, config, lib, seo, types).
- **`content/`** – Stores MDX project case studies for `letters` and `toolkit`.
- **`styles/`** – Holds global design tokens, animations, and table styling.
- **`content.config.ts`** – Defines the Astro Content Collections schema for the projects.

### Dependency Flow

```text
pages → _pages → layouts → content → shared → styles
```

- Pages import from `_pages`, `layouts`, and `shared`.
- `_pages` import from `layouts`, `content`, and `shared`.
- Layouts import from `shared` and `styles`.
- Content imports from `shared`.
- Shared imports from `styles`.

This hierarchy prevents circular dependencies and keeps the codebase predictable.

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

- **Node.js** - Version 22.12.0 or higher is required.
- **pnpm** - Used as the package manager for this project.

### Installation

```bash
git clone https://github.com/thepabitrams/the.git
cd the
pnpm install
```

### Development

Start the dev server:

```bash
pnpm dev
```

### Production Build

```bash
pnpm build
```

## Deployment

Production deployment is automated via Cloudflare Workers Builds.

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `pnpm run build` |
| Deploy command | `pnpm exec wrangler deploy` |
| Preview command | `pnpm exec wrangler versions upload` |

Push to `main` triggers a production deploy to `the.pabitramohansingh.com`. Pushes to any other branch create preview versions.

### Cloudflare Bindings

Configured in `wrangler.jsonc` to define how the Astro app runs on the edge.

- **`main`** – Points to the Astro Cloudflare adapter server entrypoint to handle routing and SSR.
- **`assets`** – Binds the built `./dist` directory to the `ASSETS` variable and handles 404 routing automatically.
- **`observability`** – Enables real-time logs and metrics in the Cloudflare dashboard for monitoring.
- **`workers_dev`** – Disabled (`false`) to ensure traffic only routes through the custom production domain.
- **`compatibility_date`** – Locks the runtime to standard behaviors as of `2026-10-06` to prevent breaking changes.

## Folder Structure

```text
.
├── public/                  # Static assets (images, robots.txt)
├── src/                     # Main application source code
│   ├── _pages/              # Page-specific view components
│   ├── content/             # MDX project case studies
│   ├── layouts/             # Page shells and global structure
│   ├── pages/               # File-based routing entry points
│   ├── shared/              # Reusable UI components and logic
│   ├── styles/              # Global CSS and design tokens
│   └── content.config.ts    # Content Collections schema
├── THIRD-PARTY/             # Bundled license files
├── astro.config.mjs         # Astro framework configuration
├── package.json             # Project manifest and dependencies
└── wrangler.jsonc           # Cloudflare deployment configuration
```

## Contributing

Issues and PRs are welcome. See [AGENTS.md](./AGENTS.md) for AI agent instructions.

## License

This project is licensed under the [MIT License](./LICENSE). See [LICENSES](./LICENSES/) for third-party attributions.

## Acknowledgements

Built with Astro, Tailwind CSS, and TypeScript. Built with a modular, scalable architecture for maintainability and developer experience.

---

<div align="center">

**Made by [Pabitra Mohan Singh](https://www.linkedin.com/in/pabitramohansingh)**

</div>