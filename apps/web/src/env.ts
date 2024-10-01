import { z } from 'zod';
import { createEnv } from 'env'

export const env = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_PROJECT_ID: z.string().min(1),
    VITE_API_URL: z.string().min(1),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});