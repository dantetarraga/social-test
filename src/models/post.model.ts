import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.model";
import { MediaItem } from "@/schema";
import { SocialConnection } from "./social-connection.model";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "simple-json", nullable: true })
  media?: MediaItem[];

  @Column({ type: "timestamp" })
  scheduledAt!: Date;

  @Column({ type: "varchar", default: "scheduled" })
  status!: 'scheduled' | 'published' | 'failed';

  @ManyToMany(() => SocialConnection, { cascade: true })
  @JoinTable()
  socialConnections!: SocialConnection[];

  @ManyToMany(() => Profile, (profile) => profile.posts, { cascade: true })
  @JoinTable()
  profiles!: Profile[];
}
