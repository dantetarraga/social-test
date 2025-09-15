import axios from "axios"
import { SocialType } from "@/types"
import { SocialPlatformService } from "@/abstracts/social-platform.service"

class FacebookService extends SocialPlatformService {
  protected authUrl = "https://www.facebook.com/v23.0/dialog/oauth"
  protected tokenUrl = "https://graph.facebook.com/v23.0/oauth/access_token"

  protected clientId = process.env.FACEBOOK_CLIENT_ID!
  protected clientSecret = process.env.FACEBOOK_CLIENT_SECRET!
  protected redirectUri = process.env.FACEBOOK_REDIRECT_URI!
  protected responseType = "code"
  protected scope = 'email,publish_video,pages_show_list,pages_read_engagement,pages_read_user_content,pages_manage_posts,pages_manage_engagement'

  async callback(code: string): Promise<any> {
    const { data } = await axios.get(this.tokenUrl, {
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        code,
      },
    })

    if (!data.access_token) throw new Error("Error obtaining Facebook token")

    const { data: accountsData } = await axios.get(
      "https://graph.facebook.com/v23.0/me/accounts",
      {
        params: { access_token: data.access_token },
      }
    )

    const pages = accountsData.data.map((page: any) => ({
      pageId: page.id,
      pageName: page.name,
      pageToken: page.access_token,
    }))

    return {
      socialType: SocialType.FACEBOOK,
      token: data.access_token,
      tokenType: data.token_type,
      pages,
    }
  }

  async uploadVideo(videoPath: string) {
    console.log("[Facebook] Upload video:", videoPath)
  }

  async uploadImage(imagePath: string) {
    console.log("[Facebook] Upload image:", imagePath)
  }
}

export default FacebookService