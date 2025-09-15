// services/social/InstagramService.ts
import axios from "axios"
import { SocialType } from "@/types"
import Boom from "@hapi/boom"
import { SocialAuthService } from "../../../abstracts/social.service"

export class InstagramService extends SocialAuthService {
  protected authUrl = "https://api.instagram.com/oauth/authorize"
  protected tokenUrl = "https://graph.instagram.com/oauth/access_token"

  protected clientId = process.env.INSTAGRAM_CLIENT_ID!
  protected clientSecret = process.env.INSTAGRAM_CLIENT_SECRET!
  protected redirectUri = process.env.INSTAGRAM_REDIRECT_URI!
  protected responseType = "code"
  protected scope = "user_profile,user_media"

  async callback(code: string): Promise<any> {
    const { data } = await axios.get(this.tokenUrl, {
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        code,
        grant_type: "authorization_code",
      },
    })

    if (!data) throw Boom.badRequest("Error obtaining Instagram token")

    return {
      socialType: SocialType.INSTAGRAM,
      token: data.access_token,
      expires: new Date(Date.now() + data.expires_in * 1000),
    }
  }

  async uploadVideo(videoPath: string) {
    console.log("[Instagram] Upload video:", videoPath)
  }

  async uploadImage(imagePath: string) {
    console.log("[Instagram] Upload image:", imagePath)
  }
}
