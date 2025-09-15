import z from 'zod'

export const createProfileSchema = z.object({
  name: z.string('The name field is required').min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  description: z.string('The description field is required').min(2, 'Description must be at least 2 characters').max(500, 'Description must be less than 500 characters'),
  color: z.string().optional()
})

export const updateProfileSchema = createProfileSchema.partial()

export const profileIdSchema = z.object({
  id: z.string().transform(val => parseInt(val, 10)).pipe(z.number().positive('Profile ID must be a positive number'))
})

export const connectionParamsSchema = z.object({
  profileId: z.string().transform(val => parseInt(val, 10)).pipe(z.number().positive('Profile ID must be a positive number')),
  connectionId: z.string().transform(val => parseInt(val, 10)).pipe(z.number().positive('Connection ID must be a positive number'))
})

export type CreateProfileSchema = z.infer<typeof createProfileSchema>
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>
export type ProfileIdSchema = z.infer<typeof profileIdSchema>
export type ConnectionParamsSchema = z.infer<typeof connectionParamsSchema>