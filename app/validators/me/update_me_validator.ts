import vine from '@vinejs/vine'
import { AuthMetadata } from '../../types/auth_metadata.js'

export const updateMeValidator = vine.withMetaData<AuthMetadata>().compile(
  vine.object({
    username: vine
      .string()
      .minLength(3)
      .maxLength(32)
      .regex(/^\w+$/)
      .unique(async (db, value, field) => {
        const user = await db
          .from('users')
          .where('username', value)
          .whereNot('id', field.meta.userId)
          .first()
        return !user
      }),
    email: vine.string().unique(async (db, value, field) => {
      const user = await db
        .from('users')
        .whereNot('id', field.meta.userId)
        .where('email', value)
        .first()
      return !user
    }),
    firstname: vine.string().minLength(3).maxLength(32),
    lastname: vine.string().minLength(3).maxLength(32),
  })
)
