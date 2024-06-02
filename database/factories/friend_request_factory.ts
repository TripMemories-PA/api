import factory from '@adonisjs/lucid/factories'
import FriendRequest from '#models/friend_request'
import { UserFactory } from './user_factory.js'

export const FriendRequestFactory = factory
  .define(FriendRequest, async () => {
    const sender = await UserFactory.create()
    const receiver = await UserFactory.create()

    return {
      senderId: sender.id,
      receiverId: receiver.id,
    }
  })
  .build()
