import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Profile } from './profile.model'
import { PostMedia } from '@/schemas/post.schemas'
import { SocialConnection } from './social-connection.model'
import { PostStatus } from '@/types/post.types'

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'text' })
  content!: string

  @Column({ type: 'simple-json', nullable: true })
  media?: PostMedia[]

  @Column({ type: 'varchar', default: PostStatus.SCHEDULED })
  status!: PostStatus

  @ManyToMany(() => SocialConnection, { cascade: true })
  @JoinTable()
  socialConnections!: SocialConnection[]

  @ManyToMany(() => Profile, (profile) => profile.posts, { cascade: true })
  @JoinTable()
  profiles!: Profile[]

  @Column({ type: 'boolean', default: false })
  publishNow!: boolean

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt?: Date

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date
}
