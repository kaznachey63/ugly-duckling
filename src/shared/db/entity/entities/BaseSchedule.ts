import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("base_schedule_pkey", ["id"], { unique: true })
@Entity("base_schedule", { schema: "public" })
export class BaseSchedule {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "cron", nullable: true })
  cron: string | null;

  @Column("text", { name: "label", nullable: true })
  label: string | null;
}
