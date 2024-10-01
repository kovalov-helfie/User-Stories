import { z } from 'zod';
import { createEnv } from 'env'
import dotenv from 'dotenv'

dotenv.config()

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
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
   },
  emptyStringAsUndefined: true,
});