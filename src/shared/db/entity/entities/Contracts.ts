import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Index("contracts_pkey", ["id"], { unique: true })
@Index("fki_contracts_users_fk", ["userId"], {})
@Entity("contracts", { schema: "public" })
export class Contracts {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "user_id", nullable: true })
  userId: number | null;

  @Column("date", { name: "date_start", nullable: true })
  dateStart: string | null;

  @Column("date", { name: "date_end", nullable: true })
  dateEnd: string | null;

  @Column("integer", { name: "price", nullable: true })
  price: number | null;

  @ManyToOne(() => Users, (users) => users.contracts, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
