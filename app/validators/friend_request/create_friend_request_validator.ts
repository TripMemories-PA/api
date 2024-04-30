import vine from '@vinejs/vine'
import { AuthMetadata } from '../../types/auth_metadata.js'
import User from '#models/user'

export const createFriendRequestValidator = vine.withMetaData<AuthMetadata>().compile(
  vine.object({
    userId: vine.number().exists(async (_, value, field) => {
      if (value === field.meta.userId) {
        return false
      }

      const user = await User.query()
        .where('id', value)
        .whereDoesntHave('sentFriendRequests', (query) => {
          query.where('receiver_id', field.meta.userId)
        })
        .whereDoesntHave('receivedFriendRequests', (query) => {
          query.where('sender_id', field.meta.userId)
        })
        .whereDoesntHave('friends', (query) => {
          query.where('friend_id', field.meta.userId)
        })
        .first()

      return !!user
    }),
  })
)
