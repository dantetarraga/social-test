import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

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

  async uploadVideo(file: NodeJS.ReadableStream, title: string, description: string) {
    const response = await this.youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
        },
        status: {
          privacyStatus: 'public',
        },
      },
      media: {
        body: file,
      },
    })

    return response.data
  }
}

export default YoutubeService