import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Profile } from './profile.model'
import { SocialType } from '@/types'
import { PageConnection } from './page-connection.model'

@Entity()
export class SocialConnection {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'enum', enum: SocialType })
  socialType!: SocialType

  @Column({ type: 'varchar', length: 255, nullable: true })
  socialAccountId!: string  

  @Column({ type: 'varchar', length: 500 })
  token!: string

  @Column({ type: 'timestamp', nullable: true })
  expires?: Date

  @Column({ type: 'varchar', length: 500, nullable: true })
  refreshToken!: string

  @Column({ type: 'timestamp', nullable: true })
  refreshExpires!: Date

  @Column({ type: 'varchar', length: 50, nullable: true })
  tokenType!: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  scope!: string

  @ManyToOne(() => Profile, (profile) => profile.connections, { onDelete: 'CASCADE' })
  profile!: Profile

  @OneToMany(() => PageConnection, (page) => page.socialConnection, { cascade: true })
  pages?: PageConnection[]
}
