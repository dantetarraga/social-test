import z from 'zod'
import { parseISO, isValid } from 'date-fns'

export const postMediaSchema = z.object({
  url: z.string(),
  type: z.enum(['image', 'video']),
  filename: z.string(),
})

export const platformConnectionSchema = z.object({
  profileId: z.number().min(1, 'Profile ID is required'),
  connectionId: z.number().min(1, 'Connection ID is required'),
})

export const createPostSchema = z.object({
  content: z.string()
    .min(1, 'Content is required')
    .max(500, 'Content must be less than 500 characters'),

  platforms: z.preprocess((val) => {
    if (typeof val === 'string') {
      return JSON.parse(val).map((item: any) => ({
        profileId: Number(item.profileId),
        connectionId: Number(item.connectionId)
      }))
    }
    return val
  }, z.array(platformConnectionSchema).min(1, 'At least one platform connection is required')),

  scheduledAt: z.preprocess((val) => {
    if (!val || val === '') return new Date()
    if (typeof val === 'string') return parseISO(val)
    if (val instanceof Date) return val
    return new Date()
  }, z.date().refine(isValid, { message: 'Invalid date-time format' })),

  publishNow: z.boolean().optional().default(false),
})

export const updatePostSchema = createPostSchema.partial()

export type CreatePostSchema = z.infer<typeof createPostSchema>
export type UpdatePostSchema = z.infer<typeof updatePostSchema>
export type PostMedia = z.infer<typeof postMediaSchema>
