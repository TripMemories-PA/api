/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.enum(['postgres_dev', 'postgres_prod'] as const),

  /*
  |----------------------------------------------------------
  | Variables for configuring Minio connection
  |----------------------------------------------------------
  */
  MINIO_HOST: Env.schema.string({ format: 'host' }),
  MINIO_PORT: Env.schema.number(),
  MINIO_URL: Env.schema.string(),
  MINIO_ACCESS_KEY: Env.schema.string(),
  MINIO_SECRET_KEY: Env.schema.string(),
  MINIO_BUCKET_NAME: Env.schema.enum(['dev', 'prod'] as const),

  GRAPHQL_ENDPOINT: Env.schema.string(),

  STRIPE_SECRET_KEY: Env.schema.string(),
  STRIPE_WEBHOOK_SECRET: Env.schema.string(),

  PUSHER_APP_ID: Env.schema.string(),
  PUSHER_KEY: Env.schema.string(),
  PUSHER_SECRET: Env.schema.string(),
  PUSHER_CLUSTER: Env.schema.string(),
})
