import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { AvatarFactory } from './avatar_factory.js'
import { BannerFactory } from './banner_factory.js'
import { SentFriendRequestFactory } from './sent_friend_request_factory.js'
import { ReceivedFriendRequestFactory } from './received_friend_request_factory.js'
import { PostFactory } from './post_factory.js'
import { UserTypes } from '../../app/types/models/user_types.js'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      userTypeId: UserTypes.USER,
    }
  })
  .relation('avatar', () => AvatarFactory)
  .relation('banner', () => BannerFactory)
  .relation('sentFriendRequests', () => SentFriendRequestFactory)
  .relation('receivedFriendRequests', () => ReceivedFriendRequestFactory)
  .relation('friends', () => UserFactory)
  .relation('posts', () => PostFactory)
  .build()
