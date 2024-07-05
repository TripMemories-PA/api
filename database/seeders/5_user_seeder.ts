import { UserFactory } from '#database/factories/user_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserTypes } from '../../app/types/models/user_types.js'

export default class extends BaseSeeder {
  async run() {
    const countUser = 3
    const countFriends = 5
    const countSentFriendRequests = 3
    const countReceivedFriendRequests = 3
    const countTickets = 3
    const countPosts = 3
    const countComments = 3
    const defaultPassword = 'Test1234!'
    const defaultPoiId = 3407 // Arc de Triomphe

    for (let i = 1; i <= countUser; i++) {
      const user = await UserFactory.merge({
        username: `user${i}`,
        email: `user${i}@mail.com`,
        password: defaultPassword,
      })
        .with('avatar')
        .with('banner')
        .with('sentFriendRequests', countSentFriendRequests)
        .with('receivedFriendRequests', countReceivedFriendRequests)
        .with('tickets', countTickets)
        .with('posts', countPosts, (post) => {
          post.merge({
            poiId: defaultPoiId,
          })
          post.with('comments', countComments)
        })
        .with('friends', countFriends, (friend) => {
          friend.with('avatar').with('banner').merge({
            password: defaultPassword,
          })
        })
        .create()

      const friends = await user.related('friends').query()

      for (const friend of friends) {
        await friend.related('friends').attach([user.id])
      }
    }

    await UserFactory.merge({
      password: defaultPassword,
      userTypeId: UserTypes.ADMIN,
      username: 'admin',
      email: 'admin@mail.com',
    }).create()

    await UserFactory.merge({
      password: defaultPassword,
      userTypeId: UserTypes.POI,
      poiId: 3407, // Arc de Triomphe
      username: 'poi',
      email: 'poi@mail.com',
    }).create()
  }
}
