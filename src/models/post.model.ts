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
import { PostStatus } from '@/types/post.types'

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'text' })
  content!: string

  @Column({ type: 'simple-json', nullable: true })
  media?: PostMedia[]

  @Column({ type: 'date', nullable: true, default: () => 'CURRENT_DATE' })
  scheduledDate!: Date 

  @Column({ type: 'time', nullable: true, default: () => 'CURRENT_TIME' })
  scheduledTime!: string

  @Column({ type: 'varchar', default: PostStatus.SCHEDULED })
  status!: PostStatus

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
