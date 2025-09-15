import { SocialPlatformService } from "@/abstracts/social-platform.service";
import { FacebookService } from "@/services/platforms/facebook.service";
import { InstagramService } from "@/services/platforms/instagram.service";
import { TikTokService } from "@/services/platforms/tiktok.service";
import { YoutubeService } from "@/services/platforms/youtube.service";

import { SocialType } from "@/types";
import Boom from "@hapi/boom";

export class SocialServiceFactory {
  private static instances: Map<SocialType, SocialPlatformService> = new Map()

  static createService(socialType: SocialType): SocialPlatformService {
    if (this.instances.has(socialType)) {
      return this.instances.get(socialType)!
    }

    let service: SocialPlatformService

    switch (socialType) {
      case SocialType.TIKTOK:
        service = new TikTokService()
        break
      case SocialType.FACEBOOK:
        service = new FacebookService()
        break
      case SocialType.INSTAGRAM:
        service = new InstagramService()
        break
      case SocialType.YOUTUBE:
        service = new YoutubeService()
        break
      default:
        throw Boom.badRequest(`Unsupported social platform: ${socialType}`)
    }

    this.instances.set(socialType, service)
    return service
  }
}