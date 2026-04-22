import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("base_results_pkey", ["id"], { unique: true })
@Entity("base_results", { schema: "public" })
export class BaseResults {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("time without time zone", { name: "time", nullable: true })
  time: string | null;

  @Column("date", { name: "date", nullable: true })
  date: string | null;

  @Column("integer", { name: "success", nullable: true })
  success: number | null;

  @Column("jsonb", { name: "chats", nullable: true })
  chats: object | null;
}
