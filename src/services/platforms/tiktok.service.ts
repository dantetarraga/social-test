import axios from "axios"
import { SocialType } from "@/types"
import Boom from "@hapi/boom"
import { SocialPlatformService } from "@/abstracts/social-platform.service"

export class TiktokService extends SocialPlatformService {
  protected authUrl = "https://www.tiktok.com/v2/auth/authorize/"
  protected tokenUrl = "https://open.tiktokapis.com/v2/oauth/token/"
  
  protected clientId = process.env.TIKTOK_CLIENT_ID!
  protected clientSecret = process.env.TIKTOK_CLIENT_SECRET!
  protected redirectUri = process.env.TIKTOK_REDIRECT_URI!
  protected responseType = "code"
  protected scope = "user.info.basic,video.upload"

  protected buildAuthParams(state: string): URLSearchParams {
    return new URLSearchParams({
      client_key: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: this.responseType,
      scope: this.scope,
      state,
    })
  }

  async callback(code: string): Promise<any> {
    const params = new URLSearchParams({
      client_key: this.clientId,
      client_secret: this.clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: this.redirectUri,
    })

    const { data } = await axios.post(this.tokenUrl, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      },
    })

    if (!data) throw Boom.badRequest("Error obtaining TikTok token")

    return {
      socialType: SocialType.TIKTOK,
      socialAccountId: data.open_id,
      token: data.access_token,
      expires: new Date(Date.now() + data.expires_in * 1000),
      refreshToken: data.refresh_token,
      refreshExpires: new Date(Date.now() + data.refresh_expires_in * 1000),
      scope: data.scope,
      tokenType: data.token_type,
    }
  }

  async uploadVideo(videoPath: string) {
    console.log("[TikTok] Upload video:", videoPath)
  }

  async uploadImage(imagePath: string) {
    console.log("[TikTok] Upload image:", imagePath)
  }
}
