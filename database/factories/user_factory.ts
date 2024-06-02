import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { FriendRequestFactory } from './friend_request_factory.js'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
    }
  })
  .relation('friends', () => UserFactory)
  .relation('sentFriendRequests', () => FriendRequestFactory)
  .relation('receivedFriendRequests', () => FriendRequestFactory)
  .build()
