import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.model";
import { MediaItem } from "@/schema";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "simple-json", nullable: true })
  media?: MediaItem[];

  @Column({ type: "timestamp", nullable: true })
  scheduledAt?: Date;

  @ManyToMany(() => Profile, (profile) => profile.posts, { cascade: true })
  @JoinTable()
  profiles!: Profile[];
}
