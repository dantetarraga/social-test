export enum SocialType {
  TIKTOK = 'tiktok',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
}

// types/social.types.ts
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

export interface SocialConnectionData {
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