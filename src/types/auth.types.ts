export enum SocialType {
  TIKTOK = 'tiktok',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
}

// Interfaces para el dominio de negocio
export interface TokenPayload {
  id: number
  email: string
  fullName?: string
  role?: string
}

export interface EmailResult {
  success: boolean
  message?: string
}

// Interfaces para integraciones con APIs externas
export interface TikTokAuthResponse {
  access_token: string
  expires_in: number
  open_id: string
  refresh_expires_in: number
  refresh_token: string
  scope: string
  token_type: 'Bearer'
}

export interface PageFacebookResponse {
  id: string
  name: string
  access_token: string
}

export interface FacebookAuthResponse {
  access_token: string
  expires_in: number
  token_type: 'Bearer'
  scope: string
  pages: PageFacebookResponse[]
}

export interface InstagramAuthResponse {
  access_token: string
  expires_in: number
}

export interface YouTubeAuthResponse {
  access_token: string
  expires_in: number
  token_type: 'Bearer'
  refresh_token: string
  scope: string
}

export interface SocialConnectionDTO {
  socialType: SocialType
  socialAccountId?: string
  token: string
  expires?: Date
  refreshToken?: string
  refreshExpires?: Date
  scope?: string
  tokenType?: string
  pages?: {
    pageId: string
    pageName: string
    pageToken: string
  }[]
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