import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { SocialConnection } from './social-connection.model'

@Entity()
export class PageConnection {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', length: 255 })
  pageId!: string   

  @Column({ type: 'varchar', length: 255 })
  pageName!: string 

  @Column({ type: 'varchar', length: 500 })
  pageToken!: string 

  @ManyToOne(() => SocialConnection, (sc) => sc.pages, { onDelete: 'CASCADE' })
  socialConnection!: SocialConnection
}
