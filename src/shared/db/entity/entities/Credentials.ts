import {
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Accounts } from "./Accounts";

@Index("credentials_pkey", ["id"], { unique: true })
@Entity("credentials", { schema: "public" })
export class Credentials {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("bigint", { name: "api_id", nullable: true })
  apiId: string | null;

  @Column("text", { name: "api_hash", nullable: true })
  apiHash: string | null;

  @Column("text", { name: "string_session", nullable: true })
  stringSession: string | null;

  @OneToOne(() => Accounts, (accounts) => accounts.credential)
  accounts: Accounts;
}
