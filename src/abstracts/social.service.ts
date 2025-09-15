// services/social/SocialAuthService.ts
import { SocialType } from "@/types"

export abstract class SocialAuthService {
  protected abstract clientId: string
  protected abstract clientSecret: string
  protected abstract redirectUri: string
  protected abstract authUrl: string
  protected abstract responseType: string
  protected abstract scope: string

  generateAuthUrl(state: string): string {
    const params = this.buildAuthParams(state)
    return `${this.authUrl}?${params.toString()}`
  }

  protected buildAuthParams(state: string): URLSearchParams {
    return new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: this.responseType,
      scope: this.scope,
      state,
    })
  }
  
  abstract callback(code: string): Promise<any>
  abstract uploadVideo(videoPath: string): Promise<any>
  abstract uploadImage(imagePath: string): Promise<any>
}
