import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("base_messages_pkey", ["id"], { unique: true })
@Entity("base_messages", { schema: "public" })
export class BaseMessages {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "position", nullable: true })
  position: number | null;

  @Column("text", { name: "caption", nullable: true })
  caption: string | null;

  @Column("jsonb", { name: "entities", nullable: true })
  entities: object | null;

  @Column("jsonb", { name: "media", nullable: true })
  media: object | null;
}
