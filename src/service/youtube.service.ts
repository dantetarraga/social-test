import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { Post } from '@/models'
import fs from 'fs'
import path from 'path'

class YoutubeService {
  private youtube
  private oauth2Client: OAuth2Client

  constructor(accessToken: string, refreshToken: string) {
    this.oauth2Client = new OAuth2Client(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    )

    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    this.youtube = google.youtube({
      version: 'v3',
      auth: this.oauth2Client,
    })
  }

  async uploadVideo(post: Post) {
    const results = []

    for (const media of post.media || []) {
      const filePath = path.resolve(`./uploads/posts/${media.filename}`)
      const fileStream = fs.createReadStream(filePath)

      const response = await this.youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: post.content,
            description: post.content,
          },
          status: {
            privacyStatus: 'private',
          },
        },
        media: {
          body: fileStream,
        },
      })

      results.push(response.data)
    }

    return results
  }
}

export default YoutubeService
