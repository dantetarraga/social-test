import { ROLE } from "./user.types"

export interface TokenPayload {
  id: number
  email: string
  fullName?: string
  role?: ROLE
}

export interface EmailResult {
  success: boolean
  message?: string
}