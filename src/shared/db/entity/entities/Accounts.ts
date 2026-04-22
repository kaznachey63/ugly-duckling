import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import type { Credentials } from "./Credentials";
import type { Users } from "./Users";

@Index("accounts_credential_id", ["credentialId"], { unique: true })
@Index("fki_accounts_credential_fk", ["credentialId"], {})
@Index("accounts_pkey", ["id"], { unique: true })
@Index("fki_accounts_users_fk", ["userId"], {})
@Entity("accounts", { schema: "public" })
export class Accounts {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "schema", nullable: true })
  schema: string | null;

  @Column("text", { name: "name", nullable: true })
  name: string | null;

  @Column("text", { name: "label", nullable: true })
  label: string | null;

  @Column("text", { name: "call", nullable: true })
  call: string | null;

  @Column("integer", { name: "credential_id", nullable: true, unique: true })
  credentialId: number | null;

  @Column("integer", { name: "user_id", nullable: true })
  userId: number | null;

  @OneToOne(() => Credentials, { cascade: true })
  @JoinColumn()
  credential: Credentials;

  @ManyToOne(() => Users, (users) => users.accounts, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
