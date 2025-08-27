import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Profile } from './profile.model'

export enum SocialType {
  TIKTOK = 'tiktok',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
}

@Entity()
export class SocialConnection {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'enum', enum: SocialType })
  socialType!: SocialType

  @Column({ type: 'varchar', length: 255 })
  socialAccountId!: string  

  @Column({ type: 'varchar', length: 500 })
  token!: string

  @Column({ type: 'timestamp' })
  expires!: Date

  @Column({ type: 'varchar', length: 500, nullable: true })
  refreshToken!: string

  @Column({ type: 'timestamp', nullable: true })
  refreshExpires!: Date

  @ManyToOne(() => Profile, (profile) => profile.connections, { onDelete: 'CASCADE' })
  profile!: Profile
}
