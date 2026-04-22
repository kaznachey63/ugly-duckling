import "reflect-metadata";
import { DataSource } from "typeorm";

import { Users } from "./entity/entities/Users.js";
import { Accounts } from "./entity/entities/Accounts.js";
import { Credentials } from "./entity/entities/Credentials.js";
import { Contracts } from "./entity/entities/Contracts.js";
import { Role } from "./entity/entities/Role.js";

export const DB = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL!,
  entities: [
    Users,
    Accounts,
    Credentials,
    Contracts,
    Role,
  ],
  synchronize: false,
});