import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("register_chats_pkey", ["id"], { unique: true })
@Entity("chats", { schema: "public" })
export class Chats {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "chat_id" })
  chatId: string;

  @Column("text", { name: "title" })
  title: string;

  @Column("text", { name: "link" })
  link: string;
}
