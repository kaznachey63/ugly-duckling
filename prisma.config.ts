import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./src/shared/db/prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
