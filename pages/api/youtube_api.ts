import { NowRequest, NowResponse } from '@vercel/node'
import { youtube_v3 } from 'googleapis'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY as string
const MAX_VIDS_DURATION_REQUEST = 40

export default async (req: NowRequest, res: NowResponse) => {
  const splitQuery = (req.query.playlistID as string).split('list=')

  const PLAYLIST_ID = splitQuery[splitQuery.length - 1]
  if (!PLAYLIST_ID) return res.json({ error: true, videoDurations: [] })

  let videoIds: string[] = []
  let videoDurations: string[] = []

  let nextPageToken: string | undefined = undefined

  const youtubeApi = new youtube_v3.Youtube({})

  // fetching all the videos in the particular youtube playlist
  while (true) {
    try {
      const responseIds = await youtubeApi.playlistItems.list({
        key: YOUTUBE_API_KEY,
        playlistId: PLAYLIST_ID,
        part: ['contentDetails'],
        maxResults: 5,
        pageToken: nextPageToken,
      })
      nextPageToken = responseIds.data.nextPageToken as string | undefined

      videoIds = [
        ...videoIds,
        ...responseIds.data.items!.map(
          (item) => item.contentDetails?.videoId as string
        ),
      ]

      if (!responseIds.data.nextPageToken) break
    } catch (error) {
      return res.json({
        error: true,
        videoDurations: [],
      })
    }
  }

  // fetching all the durations
  while (videoIds.length !== 0) {
    try {
      const responseDurs = await youtubeApi.videos.list({
        key: YOUTUBE_API_KEY,
        part: ['contentDetails'],
        id: videoIds.splice(0, MAX_VIDS_DURATION_REQUEST),
      })
      videoDurations = [
        ...videoDurations,
        ...responseDurs.data.items!.map(
          (item) => item.contentDetails!.duration as string
        ),
      ]
    } catch (error) {
      return res.json({
        error: true,
      })
    }
  }

  res.json({
    error: false,
    videoDurations,
  })
}
