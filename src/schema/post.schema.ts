import { PublishingType } from '@/types'
import z from 'zod'

export const mediaSchema = z.object({
  url: z.string().url(),
  type: z.enum(['image', 'video', 'pdf']),
  filename: z.string().min(1).max(100),
})

export const createPostSchema = z
  .object({
    content: z.string().min(1, 'El contenido es requerido').max(5000),
    media: z.array(mediaSchema).optional(),
    publishing: z.enum(PublishingType),
    scheduledAt: z.date().optional(),
    profiles: z.array(z.number()).min(1, 'Debe seleccionar al menos un perfil'),
  })
  .superRefine((data, ctx) => {
    if (data.publishing === PublishingType.LATER) {
      if (!data.scheduledAt) {
        ctx.addIssue({
          code: 'custom',
          message: 'Debes especificar una fecha/hora.',
          path: ['scheduledAt'],
        })
      } else if (data.scheduledAt <= new Date()) {
        ctx.addIssue({
          code: 'custom',
          message: 'La fecha/hora debe ser en el futuro',
          path: ['scheduledAt'],
        })
      }
    }

    if (data.publishing === PublishingType.NOW) {
      if (!data.scheduledAt) {
        data.scheduledAt = new Date()
      }
    }
  })

export type CreatePostDTO = z.infer<typeof createPostSchema>
export type MediaItem = z.infer<typeof mediaSchema>
