import { z } from 'zod';
import { createEnv } from 'env'

export const env = createEnv({
  client: {},
  clientPrefix: '',
  server: {
    DB_HOST: z.string().min(1),
    DB_PORT: z.coerce.number(),
    DB_USERNAME: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_NAME: z.string().min(1),
  },
  runtimeEnv: { 
    DB_HOST: process.env.HOST,
    DB_PORT: process.env.PORT,
    DB_USERNAME: process.env.PORT,
    DB_PASSWORD: process.env.PORT,
    DB_NAME: process.env.PORT,
   },
  emptyStringAsUndefined: true,
});