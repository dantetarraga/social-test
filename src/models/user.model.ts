import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Profile } from './profile.model'
import { ROLE } from '@/types'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', length: 100 })
  fullName!: string

  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string

  @Column({ type: 'varchar', length: 100 })
  password!: string

  @Column({ type: 'enum', enum: ROLE, default: ROLE.USER })
  role!: ROLE

  @OneToMany(() => Profile, (profile) => profile.user, { cascade: true })
  profiles!: Profile[];
}
