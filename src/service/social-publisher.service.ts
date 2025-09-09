import { Post, SocialConnection } from '@/models'
import { SocialType } from '@/types'
import axios from 'axios'
import fs from 'fs'
import path from 'path'

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
      const filePath = path.resolve(`./uploads/posts/${post.media?.[0]?.filename}`)
      const videoSize = fs.statSync(filePath).size

      // 1️⃣ INIT: solicitar upload_url y publish_id
      const initResp = await axios.post(
        'https://open.tiktokapis.com/v2/post/publish/inbox/video/init/',
        {
          source_info: {
            source: 'FILE_UPLOAD',
            video_size: videoSize,
            chunk_size: videoSize, // 1 solo chunk
            total_chunk_count: 1,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${conn.token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const { upload_url, publish_id } = initResp.data.data
      console.log('Init OK:', { upload_url, publish_id })

      // 2️⃣ UPLOAD: enviar el archivo binario al upload_url
      const videoStream = fs.createReadStream(filePath)
      await axios.put(upload_url, videoStream, {
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Range': `bytes 0-${videoSize - 1}/${videoSize}`,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      })
      console.log('Upload OK')

      // 3️⃣ STATUS: verificar el estado con publish_id
      const statusResp = await axios.post(
        'https://open.tiktokapis.com/v2/post/publish/status/fetch/',
        { publish_id },
        {
          headers: {
            Authorization: `Bearer ${conn.token}`,
            'Content-Type': 'application/json; charset=UTF-8',
          },
        }
      )

      console.log('Status:', statusResp.data)
      return statusResp.data
    } catch (error: any) {
      console.error(
        'Error al publicar en TikTok:',
        error.response?.data || error.message
      )
      throw error
    }
  }
}

export default SocialPublisherService
