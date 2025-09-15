// services/social/YoutubeService.ts
import axios from "axios"
import { SocialType } from "@/types"
import { SocialPlatformService } from "@/abstracts/social-platform.service"

export class YoutubeService extends SocialPlatformService  {
  protected authUrl = "https://accounts.google.com/o/oauth2/v2/auth"
  protected tokenUrl = "https://oauth2.googleapis.com/token"

  protected clientId = process.env.YOUTUBE_CLIENT_ID!
  protected clientSecret = process.env.YOUTUBE_CLIENT_SECRET!
  protected redirectUri = process.env.YOUTUBE_REDIRECT_URI!
  protected responseType = "code"
  protected scope = "https://www.googleapis.com/auth/youtube.upload"

  generateAuthUrl(state: string): string {
    const baseUrl = super.generateAuthUrl(state)
    const extraParams = new URLSearchParams({
      access_type: "offline",
      prompt: "consent",
    })
    return `${baseUrl}&${extraParams.toString()}`
  }

  async callback(code: string): Promise<any> {
    const { data } = await axios.post(
      this.tokenUrl,
      null,
      {
        params: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          redirect_uri: this.redirectUri,
          grant_type: "authorization_code",
        },
      }
    )

    if (!data) throw new Error("Error obtaining YouTube token")

    return {
      socialType: SocialType.YOUTUBE,
      token: data.access_token,
      refreshToken: data.refresh_token,
      expires: new Date(Date.now() + data.expires_in * 1000),
      scope: data.scope,
      tokenType: data.token_type,
    }
  }

  async uploadVideo(videoPath: string) {
    console.log("[YouTube] Upload video:", videoPath)
  }

  async uploadImage(imagePath: string) {
    console.log("[YouTube] Upload image:", imagePath)
  }
}
