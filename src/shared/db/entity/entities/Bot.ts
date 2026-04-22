import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("bot_pkey", ["id"], { unique: true })
@Entity("bot", { schema: "public" })
export class Bot {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "last_idea_id", nullable: true })
  lastIdeaId: number | null;
}
