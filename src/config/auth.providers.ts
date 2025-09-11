import { SocialType } from "@/types"
import 'dotenv/config'
import { access } from "fs"

export const providers = {
  [SocialType.TIKTOK]: {
    authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
    clientId: process.env.TIKTOK_CLIENT_KEY!,
    clientIdParam: 'client_key',
    redirectUri: process.env.TIKTOK_REDIRECT_URI!,
    scope: 'user.info.basic,user.info.profile,video.list,video.upload',
    responseType: 'code',
  },
  [SocialType.FACEBOOK]: {
    authUrl: 'https://www.facebook.com/v23.0/dialog/oauth',
    clientId: process.env.FACEBOOK_APP_ID!,
    clientIdParam: 'client_id',
    redirectUri: process.env.FACEBOOK_REDIRECT_URI!,
    scope: 'email,publish_video,pages_show_list,pages_read_engagement,pages_read_user_content,pages_manage_posts,pages_manage_engagement',
    responseType: 'code',
  },
  [SocialType.INSTAGRAM]: {
    authUrl: 'https://api.instagram.com/oauth/authorize',
    clientId: process.env.INSTAGRAM_CLIENT_ID!,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
    clientIdParam: 'client_id',
    redirectUri: process.env.INSTAGRAM_REDIRECT_URI!,
    scope: 'user_profile,user_media',
    responseType: 'code',
  },
  [SocialType.YOUTUBE]: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientId: process.env.YOUTUBE_CLIENT_ID!,
    clientIdParam: 'client_id',
    redirectUri: process.env.YOUTUBE_REDIRECT_URI!,
    scope: 'https://www.googleapis.com/auth/drive',
    responseType: 'code',
    accessType: 'offline',
    prompt: 'consent',
  },
}

export const callbackProviders = {
  [SocialType.TIKTOK]: {
    tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
    clientId: process.env.TIKTOK_CLIENT_KEY!,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
    redirectUri: process.env.TIKTOK_REDIRECT_URI!,
    method: 'POST',
    grantType: 'authorization_code',
  },
  [SocialType.FACEBOOK]: {
    tokenUrl: 'https://graph.facebook.com/v23.0/oauth/access_token',
    clientId: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    redirectUri: process.env.FACEBOOK_REDIRECT_URI!,
    method: 'GET',
  },
  [SocialType.INSTAGRAM]: {
    tokenUrl: 'https://graph.instagram.com/oauth/access_token',
    clientId: process.env.INSTAGRAM_APP_ID!,
    clientSecret: process.env.INSTAGRAM_APP_SECRET!,
    redirectUri: process.env.INSTAGRAM_REDIRECT_URI!,
    method: 'POST',
    grantType: 'authorization_code',
  },
  [SocialType.YOUTUBE]: {
    tokenUrl: 'https://oauth2.googleapis.com/token',
    clientId: process.env.YOUTUBE_CLIENT_ID!,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET!,
    redirectUri: process.env.YOUTUBE_REDIRECT_URI!,
    method: 'POST',
    grantType: 'authorization_code',
  },
}
