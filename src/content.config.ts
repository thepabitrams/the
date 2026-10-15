// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  techStack: z.array(z.string()).default([]),
  githubUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  image: z.string().optional(),
  metrics: z.string().optional(),
  problem: z.string().optional(),
  contribution: z.string().optional(),
  diagram: z.string().optional(),
  beforeAfter: z.object({
    before: z.string(),
    after: z.string(),
    improvement: z.string(),
  }).optional(),
  tradeOffs: z.string().optional(),
  hardestBug: z.string().optional(),
  whatIdDoDifferently: z.string().optional(),
  features: z.array(z.string()).optional(),
});

const projects = defineCollection({
  loader: glob({
    pattern: '**/index.mdx',
    base: './src/content/projects',
  }),
  schema: projectSchema,
});

export const collections = {
  projects,
};