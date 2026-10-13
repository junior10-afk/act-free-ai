import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const provider = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/providers' }),
  schema: z.object({
    name: z.string(),
    url: z.string().url(),
    description_fr: z.string(),
    description_en: z.string(),
    accessType: z.enum(['unlimited', 'credits', 'freemium', 'local']),
    models: z.array(
      z.enum(['text', 'image', 'video', 'audio', 'code', 'embedding', 'rerank'])
    ),
    openaiCompatible: z.boolean().default(false),
    signupRequired: z.boolean().default(true),
    cardRequired: z.boolean().default(false),
    phoneRequired: z.boolean().default(false),
    quotas_fr: z.string().optional(),
    quotas_en: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    verifiedAt: z.coerce.date(),
  }),
});

const agent = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/agents' }),
  schema: z.object({
    name: z.string(),
    repo: z.string().url(),
    site: z.string().url().optional(),
    author: z.string(),
    description_fr: z.string(),
    description_en: z.string(),
    license: z.string(),
    category: z.enum(['coding', 'chat', 'automation', 'framework', 'local']),
    worksWith: z.array(z.string()).default([]),
    order: z.number().default(99),
    verifiedAt: z.coerce.date(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title_fr: z.string(),
    title_en: z.string(),
    date: z.coerce.date(),
    type: z.enum(['new', 'change', 'shutdown', 'release']),
    summary_fr: z.string(),
    summary_en: z.string(),
    body_fr: z.string().optional(),
    body_en: z.string().optional(),
    providers: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { provider, agent, news };
