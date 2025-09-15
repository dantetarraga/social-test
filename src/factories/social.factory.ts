import { TikTokService } from "@/services";
import { FacebookService } from "@/services/social/platforms/facebook.service";
import { InstagramService } from "@/services/social/platforms/instagram.service";

import { YoutubeService } from "@/services/social/platforms/youtube.service";
import { SocialType } from "@/types";
import Boom from "@hapi/boom";

const serviceRegistry = {
  [SocialType.TIKTOK]: TikTokService,
  [SocialType.YOUTUBE]: YoutubeService,
  [SocialType.FACEBOOK]: FacebookService,
  [SocialType.INSTAGRAM]: InstagramService,
}

export class SocialServiceFactory {
  static createService(socialType: SocialType): InstanceType<typeof serviceRegistry[SocialType]> {
    const ServiceClass = serviceRegistry[socialType]
    if (!ServiceClass) throw Boom.badRequest(`Unsupported social type: ${socialType}`)
    return new ServiceClass()
  }
}