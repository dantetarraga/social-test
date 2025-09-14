export interface ProfileWithConnections {
  id: number
  name: string
  description: string
  color?: string
  connections: any[] 
}

export interface ProfileResponse extends Omit<ProfileWithConnections, 'connections'> {
  createdAt: Date
  updatedAt: Date
}