import "reflect-metadata";
import { DataSource } from "typeorm";

export const DB = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL!,
  entities: ["src/shared/db/entity/*.ts"],
  synchronize: false,
});