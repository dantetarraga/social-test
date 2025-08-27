import { Rol } from '@/types/user.types'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Profile } from './profile.model'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', length: 100, nullable: true })
  fullName!: string

  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string

  @Column({ type: 'varchar', length: 100 })
  password!: string

  @Column({ type: 'enum', enum: Rol, default: Rol.USER })
  role!: Rol

  @OneToMany(() => Profile, (profile) => profile.user, { cascade: true })
  profiles!: Profile[]
}
