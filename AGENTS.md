# AGENTS.md

## Overview
Fast, static-first personal portfolio built with Astro 7, Tailwind CSS 4, and TypeScript 7. Deployed on Cloudflare. Focus on Zero-JS by default.

## Commands
- **Install:** `pnpm install`
- **Dev:** `pnpm dev`
- **Build:** `pnpm build`
- **Preview:** `pnpm preview`
- **Type Gen:** `pnpm run generate-types`

## Code Conventions
- **Astro:** Use `.astro` components. Do not introduce React/Vue unless explicitly requested. Avoid client-side JS unless strictly necessary.
- **Styles:** Tailwind CSS utility classes. Avoid custom CSS unless complex animations are needed.
- **Content:** MDX files live in `src/content/`. Shared components in `src/shared/`.
- **Types:** Strict TypeScript. Explicitly type all component props.

## Testing & Quality
- Always run `pnpm build` before committing.
- Run `pnpm run generate-types` if `wrangler.jsonc` changes.

## Git & PR Rules
- Use focused, conventional commits (e.g., `feat:`, `fix:`, `docs:`).
- Never commit secrets, `.env` files, or `node_modules/`.

## Boundaries
### Always Do
- Read the nearest `AGENTS.md` before starting.
- Verify changes with `pnpm build`.

### Ask First
- Installing new dependencies.
- Modifying `wrangler.jsonc`, `astro.config.mjs`, or Content Collection schemas.

### Never Do
- Modify `LICENSES/`, `public/`, or `.gitignore`.
- Commit secrets or credentials.
- Force-push to `main`.