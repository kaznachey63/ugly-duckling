import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Accounts } from "./Accounts";
import { Contracts } from "./Contracts";
import { Role } from "./Role";

@Index("users_pkey", ["id"], { unique: true })
@Index("fki_users_role_fk", ["roleId"], {})
@Index("fki_users_role_id", ["roleId"], {})
@Index("users_telegram_id_key", ["telegramId"], { unique: true })
@Entity("users", { schema: "public" })
export class Users {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("bigint", { name: "telegram_id", nullable: true, unique: true })
  telegramId: string | null;

  @Column("text", { name: "name", nullable: true })
  name: string | null;

  @Column("text", { name: "username", nullable: true })
  username: string | null;

  @Column("text", { name: "phone", nullable: true })
  phone: string | null;

  @Column("text", { name: "language", nullable: true, default: () => "'ru'" })
  language: string | null;

  @Column("integer", { name: "role_id", nullable: true })
  roleId: number | null;

  @OneToMany(() => Accounts, (accounts) => accounts.user)
  accounts: Accounts[];

  @OneToMany(() => Contracts, (contracts) => contracts.user)
  contracts: Contracts[];

  @ManyToOne(() => Role, (role) => role.users, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: Role;
}
