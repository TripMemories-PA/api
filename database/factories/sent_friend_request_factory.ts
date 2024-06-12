import factory from '@adonisjs/lucid/factories'
import FriendRequest from '#models/friend_request'
import { UserFactory } from './user_factory.js'

export const SentFriendRequestFactory = factory
  .define(FriendRequest, async ({ faker }) => {
    const receiver = await UserFactory.merge({
      password: 'Test1234!',
    })
      .with('avatar')
      .with('banner')
      .create()

    return {
      senderId: faker.number.int(),
      receiverId: receiver.id,
    }
  })
  .build()
