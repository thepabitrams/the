// Project case study schema — 2026 portfolio standard

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const projectSchema = z.object({
  title: z.string(),
  description: z.string().max(160),
  techStack: z.array(z.string()).default([]),
  publishedAt: z.coerce.date(),
  featured: z.boolean().default(false),
  sortOrder: z.number().default(0),

  githubUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  demoVideoId: z.string().optional(),

  image: z.string().optional(),
  diagram: z.string().optional(),

  problem: z.string().optional(),
  userPersona: z.string().optional(),
  constraints: z.string().optional(),
  ownership: z.string().optional(),
  contribution: z.string().optional(),
  firstVersion: z.string().optional(),
  architectureNotes: z.string().optional(),

  keyDecisions: z.array(z.string()).optional(),
  tradeOffs: z.string().optional(),
  hardestBug: z.string().optional(),

  metrics: z.string().optional(),
  testCoverage: z.string().optional(),
  evaluation: z.string().optional(),
  beforeAfter: z.object({
    before: z.string(),
    after: z.string(),
    improvement: z.string(),
  }).optional(),

  limitations: z.string().optional(),
  lessonsLearned: z.string().optional(),
  whatIdDoDifferently: z.string().optional(),

  nextSteps: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),

  aiUsage: z.string().optional(),
});

export const projects = defineCollection({
  loader: glob({
    pattern: '**/index.mdx',
    base: './src/content/projects',
  }),
  schema: projectSchema,
});

export const collections = { projects };