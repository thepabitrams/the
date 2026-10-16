import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const previewSlideSchema = z.object({
  mode: z.enum(['desktop', 'mobile']),
  image: z.string(),
});

export const projectSchema = z.object({
  title: z.string(),
  description: z.string().max(160),
  techStack: z.array(z.string()).default([]),
  publishedAt: z.coerce.date(),
  featured: z.boolean().default(false),
  status: z.enum(['new', 'in-progress', 'completed', 'archived']).optional(),

  githubUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  demoVideoId: z.string().optional(),

  image: z.string().optional(),
  diagram: z.string().optional(),

  preview: z.array(previewSlideSchema).default([]),
});

export const projects = defineCollection({
  loader: glob({
    pattern: '**/card.mdx',
    base: './src/content/projects',
  }),
  schema: projectSchema,
});

export const projectDetails = defineCollection({
  loader: glob({
    pattern: '**/about.mdx',
    base: './src/content/projects',
  }),
  schema: projectSchema,
});

export const collections = { projects, projectDetails };