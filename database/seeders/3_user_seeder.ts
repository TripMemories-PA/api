import { UserFactory } from '#database/factories/user_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const countUser = 3
    const countFriends = 5
    const countSentFriendRequests = 3
    const countReceivedFriendRequests = 3
    const countPosts = 3
    const defaultPassword = 'Test1234!'

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
        .with('posts', countPosts)
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
  }
}
