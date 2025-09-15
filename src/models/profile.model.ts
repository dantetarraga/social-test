import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { User } from './user.model'
import { Post } from './post.model'
import { SocialConnection } from './social-connection.model'

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', length: 100 })
  name!: string

  @Column({ type: 'varchar', length: 100 })
  description!: string

  @Column({ type: 'varchar', length: 7, nullable: true })
  color?: string

  @ManyToOne(() => User, (user) => user.profiles, { onDelete: 'CASCADE' })
  user!: User

  @OneToMany(() => SocialConnection, (connection) => connection.profile, {
    cascade: true,
  })
  connections!: SocialConnection[]

  @ManyToMany(() => Post, (post) => post.profiles)
  posts!: Post[]

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date
}
