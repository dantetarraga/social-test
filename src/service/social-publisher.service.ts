import { Post, SocialConnection } from '@/models'
import { SocialType } from '@/types'
import axios from 'axios'

class SocialPublisherService {
  async publishPost(post: Post) {
    for (const conn of post.socialConnections) {
      switch (conn.socialType) {
        case SocialType.TIKTOK:
          await this.publishToTikTok(post, conn)
          break
        case SocialType.FACEBOOK:
          // await this.publishToFacebook(post, conn)
          break
        // case SocialType.YOUTUBE:
        //   await this.publishToYouTube(post, conn)
        //   break
        // case SocialType.INSTAGRAM:
        //   await this.publishToInstagram(post, conn)
        //   break
      }
    }
  }

  async publishToTikTok(post: Post, conn: SocialConnection) {
    try {
      const upload = await axios.post(
        'https://open-api.tiktokglobalshop.com/video/upload/', 
        {
          video: post.media?.[0]?.url, 
          text: post.content,
        },
        {
          headers: {
            Authorization: `Bearer ${conn.token}`,
          },
        }
      )

      console.log('Publicado en TikTok:', upload.data)
    } catch (error) {
      console.error(
        'Error al publicar en TikTok:'
      )
    }
  }
}

export default SocialPublisherService
