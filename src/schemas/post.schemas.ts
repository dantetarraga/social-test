import z from 'zod'
import { formatInTimeZone } from 'date-fns-tz'
import { isValid, parse } from 'date-fns'

export const postMediaSchema = z.object({
  url: z.string(),
  type: z.enum(['image', 'video']),
  filename: z.string(),
})

const getPeruDate = () => {
  return formatInTimeZone(new Date(), 'America/Lima', 'yyyy-MM-dd')
}

const getPeruTime = () => {
  return formatInTimeZone(new Date(), 'America/Lima', 'HH:mm:ss')
}

const validateTime = (value: unknown) => {
  if (!value || typeof value !== 'string') return false

  let parsed = parse(value, 'HH:mm:ss', new Date())
  if (!isValid(parsed)) {
    parsed = parse(value, 'HH:mm', new Date())
  }

  return isValid(parsed)
}

export const createPostSchema = z.object({
  content: z.string().min(1, 'Content is required').max(500),

  profileIds: z.preprocess((val) => {
    if (typeof val === 'string') return JSON.parse(val).map((id: string | number) => Number(id))
    return val
  }, z.array(z.number().min(1, 'Profile ID is required'))),

  socialIds: z.preprocess((val) => {
    if (typeof val === 'string')
      return JSON.parse(val).map((id: string | number) => Number(id))
    return val
  }, z.array(z.number()).min(1, 'At least one social connection is required')),

  scheduledDate: z.preprocess((val) => {
    if (!val || val === '') return new Date(getPeruDate())
    if (typeof val === 'string' || typeof val === 'number' || val instanceof Date)
      return new Date(val)
    return new Date(getPeruDate())
  }, z.date()),

  scheduledTime: z.preprocess((val) => {
    if (!val || val === '') return getPeruTime()
    return val
  }, z.string().refine(validateTime, {
    message: 'Invalid time format (HH:MM or HH:MM:SS)',
  })),
})

export const updatePostSchema = createPostSchema.partial()

export type CreatePostSchema = z.infer<typeof createPostSchema>
export type UpdatePostSchema = z.infer<typeof updatePostSchema>
export type PostMedia = z.infer<typeof postMediaSchema>
