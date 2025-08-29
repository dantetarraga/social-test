import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.model";
import { PublishingType } from "@/types";
import { MediaItem } from "@/schema";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'text' })
  content!: string

  @Column({ type: 'simple-json', nullable: true })
  media?: MediaItem[]

  @Column({
    type: 'enum',
    enum: PublishingType,
    default: PublishingType.NOW,
  })
  publishing!: PublishingType

  // @Column({ type: 'simple-array', nullable: true })
  // permissions?: string[]

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt?: Date

  @ManyToMany(() => Profile, (profile) => profile.posts, { cascade: true })
  @JoinTable()
  profiles!: Profile[]
}