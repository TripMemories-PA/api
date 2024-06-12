import factory from '@adonisjs/lucid/factories'
import FriendRequest from '#models/friend_request'
import { UserFactory } from './user_factory.js'

export const ReceivedFriendRequestFactory = factory
  .define(FriendRequest, async ({ faker }) => {
    const sender = await UserFactory.merge({
      password: 'Test1234!',
    })
      .with('avatar')
      .with('banner')
      .create()

    return {
      senderId: sender.id,
      receiverId: faker.number.int(),
    }
  })
  .build()
