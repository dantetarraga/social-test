import z from 'zod'
import {
  loginSchema,
  recoveryEmailSchema,
  registerSchema,
  resetPasswordSchema,
} from '@/schema'

export enum SocialType {
  TIKTOK = 'tiktok',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
}

export interface AuthResponse {
  email: string
  fullName?: string
  accessToken: string
}

export interface TikTokAuthResponse {
  access_token: string
  expires_in: number
  open_id: string
  refresh_expires_in: number
  refresh_token: string
  scope: string
  token_type: 'Bearer'
}

export interface SocialConnectionDTO {
  socialType: SocialType
  socialAccountId?: string
  token: string
  expires: Date
  refreshToken?: string
  refreshExpires?: Date
  scope?: string
  tokenType?: string
}

export interface FacebookAuthResponse {
  access_token: string
  expires_in: number
  token_type: 'Bearer'
}

export interface InstagramAuthResponse {
  access_token: string
  expires_in: number
}

export interface ProviderConfig {
  authUrl: string
  clientId: string
  clientIdParam: string
  redirectUri: string
  scope: string
  responseType?: string
  accessType?: string
  prompt?: string
}

export interface CallbackConfig {
  tokenUrl: string
  clientId: string
  clientSecret: string
  redirectUri: string
  grantType?: string
}

export interface YouTubeAuthResponse {
  access_token: string
  expires_in: number
  token_type: 'Bearer'
  refresh_token: string
  scope: string
}

export type RegisterDTO = z.infer<typeof registerSchema>
export type LoginDTO = z.infer<typeof loginSchema>

export type RecoveryEmailDTO = z.infer<typeof recoveryEmailSchema>
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>
