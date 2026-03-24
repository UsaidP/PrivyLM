
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Use placeholder during build, real URL at runtime
    url: env('DB_URL', 'postgresql://placeholder:5432/placeholder'),
  },
})