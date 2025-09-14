import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Profile } from './profile.model'
import { PostMedia } from '@/schemas/post.schemas'
import { SocialConnection } from './social-connection.model'

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'text' })
  content!: string

  @Column({ type: 'simple-json', nullable: true })
  media?: PostMedia[]

  @Column({ type: 'timestamp' })
  scheduledAt!: Date

  @Column({ type: 'varchar', default: 'scheduled' })
  status!: 'scheduled' | 'published' | 'failed'

  @ManyToMany(() => SocialConnection, { cascade: true })
  @JoinTable()
  socialConnections!: SocialConnection[]

  @ManyToOne(() => Profile, (profile) => profile.posts, {
    onDelete: 'CASCADE', 
  })
  profile!: Profile

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date
}
