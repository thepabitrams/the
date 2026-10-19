import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '@/shared/config/site';

export const GET: APIRoute = async () => {
  const projectDetails = await getCollection('projectDetails');

  const staticRoutes = [
    '',
    '/projects',
    '/contact',
    '/privacy',
    '/terms',
    '/sponsor',
    '/sponsor/contact',
    '/sponsor/privacy',
    '/sponsor/terms',
  ];

  const projectRoutes = projectDetails.map((projectEntry) => {
    const projectSlug = projectEntry.id.replace(/\/about$/, '');
    return `/projects/${projectSlug}`;
  });

  const allRoutes = [...staticRoutes, ...projectRoutes];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map((routePath) => {
    return `  <url>
    <loc>${site.domain}${routePath}</loc>
    <changefreq>weekly</changefreq>
    <priority>${routePath === '' ? '1.0' : '0.8'}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new Response(xmlContent, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};