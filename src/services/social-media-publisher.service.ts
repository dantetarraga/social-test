// import { Post, SocialConnection } from '@/models'
// import { SocialType } from '@/types'
// import axios from 'axios'
// import fs from 'fs'
// import path from 'path'
// import YoutubeService from './social/platforms/youtube.service'

// class SocialMediaPublisherService {
//   async publishPost(post: Post) {
//     for (const conn of post.socialConnections) {
//       switch (conn.socialType) {
//         case SocialType.TIKTOK:
//           await this.publishToTikTok(post, conn)
//           break
//         case SocialType.FACEBOOK:
//           // await this.publishToFacebook(post, conn)
//           break
//         case SocialType.YOUTUBE:
//           const accessToken = conn.token
//           const refreshToken = conn.refreshToken

//           const youtubeService = new YoutubeService(accessToken, refreshToken)

//           const results = await youtubeService.uploadVideo(post)
//           console.log('YouTube upload results:', results)
//           break
//         // case SocialType.INSTAGRAM:
//         //   await this.publishToInstagram(post, conn)
//         //   break
//       }
//     }
//   }

//   async publishToTikTok(post: Post, conn: SocialConnection) {
//     try {
//       const results = []

//       for (const media of post.media || []) {
//         const filePath = path.resolve(`./uploads/posts/${media.filename}`)
//         const videoSize = fs.statSync(filePath).size

//         const initResp = await axios.post(
//           'https://open.tiktokapis.com/v2/post/publish/inbox/video/init/',
//           {
//             post_info: {
//               title: post.content,
//               description: post.content,
//               privacy_level: "PUBLIC_TO_EVERYONE",
//               disable_duet: true,
//               disable_comment: false,
//             },
//             source_info: {
//               source: 'FILE_UPLOAD',
//               video_size: videoSize,
//               chunk_size: videoSize,
//               total_chunk_count: 1,
//             },
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${conn.token}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         )

//         const { upload_url, publish_id } = initResp.data.data

//         const videoStream = fs.createReadStream(filePath)
//         await axios.put(upload_url, videoStream, {
//           headers: {
//             'Content-Type': 'video/mp4',
//             'Content-Range': `bytes 0-${videoSize - 1}/${videoSize}`,
//           },
//           maxContentLength: Infinity,
//           maxBodyLength: Infinity,
//         })

//         const statusResp = await axios.post(
//           'https://open.tiktokapis.com/v2/post/publish/status/fetch/',
//           { publish_id },
//           {
//             headers: {
//               Authorization: `Bearer ${conn.token}`,
//               'Content-Type': 'application/json; charset=UTF-8',
//             },
//           }
//         )

//         results.push(statusResp.data)
//       }

//       return results
//     } catch (error: any) {
//       console.error(
//         'Error al publicar en TikTok:',
//         error.response?.data || error.message
//       )
//       throw error
//     }
//   }

//   async publishAlbumToTikTok(post: Post, conn: SocialConnection) {
//     try {
//       const photoUrls = (post.media || []).map(
//         (media) => `${process.env.APP_URL}/uploads/posts/${media.filename}`
//       )

//       const initResp = await axios.post(
//         'https://open.tiktokapis.com/v2/post/publish/content/init/',
//         {
//           post_info: {
//             title: post.content,
//             description: post.content,
//             privacy_level: 'PUBLIC_TO_EVERYONE',
//             disable_comment: false,
//             auto_add_music: true,
//           },
//           source_info: {
//             source: 'PULL_FROM_URL', 
//             photo_cover_index: 1, 
//             photo_images: photoUrls,
//           },
//           post_mode: 'MEDIA_UPLOAD',
//           media_type: 'PHOTO',
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${conn.token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       )

//       return initResp.data
//     } catch (error: any) {
//       console.error(
//         'Error al publicar álbum en TikTok:',
//         error.response?.data || error.message
//       )
//       throw error
//     }
//   }
// }

// export default SocialMediaPublisherService
