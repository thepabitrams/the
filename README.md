# Pabitra Mohan Singh — Portfolio

> Personal portfolio built with **Astro**, **Tailwind CSS**, and **TypeScript**.

[![Astro](https://img.shields.io/badge/Astro-7.x-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.12.0-5FA04E?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**Live:** [pabitramohansingh.com](https://pabitramohansingh.com)

---

## About

A personal portfolio site showcasing my work as a software engineer. Built with a static-first Astro setup, styled with Tailwind CSS, and written in TypeScript. Content is authored with MDX for flexibility. Deployed on Cloudflare.

---

## Tech Stack

| Layer        | Technology                                                      |
| ------------ | --------------------------------------------------------------- |
| Framework    | [Astro](https://astro.build) `^7.3.8`                           |
| Styling      | [Tailwind CSS](https://tailwindcss.com) `^4.3.3` (via `@tailwindcss/vite`) |
| Content      | [MDX](https://mdxjs.com) via `@astrojs/mdx` `^8.0.3`            |
| Language     | [TypeScript](https://www.typescriptlang.org) `^7.0.2`           |
| Deployment   | [Cloudflare](https://www.cloudflare.com) via `@astrojs/cloudflare` `^14.3.4` |
| Tooling      | [Wrangler](https://developers.cloudflare.com/workers/wrangler/) `^4.151.0` |

---

## Prerequisites

- **Node.js** `>=22.12.0`
- **pnpm** (recommended) — or npm / yarn

```bash
node --version   # should print v22.12.0 or higher
```

## Getting Started

```bash
git clone https://github.com/thepabitrams/the.git
cd the
pnpm install
pnpm dev
```

Open <http://localhost:4321> in your browser.

## Available Scripts

## Available Scripts

```markdown
| Command               | Description                                            |
| --------------------- | ------------------------------------------------------ |
| `pnpm dev`            | Start the Astro dev server at `localhost:4321`         |
| `pnpm build`          | Build the production site                              |
| `pnpm preview`        | Preview the production build locally                   |
| `pnpm astro`          | Run the Astro CLI directly                             |
| `pnpm generate-types` | Generate Cloudflare binding types via `wrangler types` |
```

## Deployment

The site uses the `@astrojs/cloudflare` adapter and deploys to Cloudflare.

```bash
pnpm build
npx wrangler deploy
```

## License

This project is licensed under the [MIT License](./LICENSE).

---

**Made by [Pabitra Mohan Singh](https://www.linkedin.com/in/pabitramohansingh)**
