import { env } from '@/env';
import { type Config, defineConfig } from 'drizzle-kit';


export default {
  schema: './src/db/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL,
  },
} satisfies Config;
