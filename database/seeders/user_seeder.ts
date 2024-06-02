import { UserFactory } from '#database/factories/user_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const count = 3

    for (let i = 1; i <= count; i++) {
      const user = await UserFactory.merge({
        username: `user${i}`,
        email: `user${i}@mail.com`,
        password: 'Test1234!',
      })
        .with('friends', 5)
        .with('sentFriendRequests', 3)
        .with('receivedFriendRequests', 3)
        .create()

      const friends = await user.related('friends').query().exec()

      friends.forEach(async (friend) => {
        await friend.related('friends').attach([user.id])
      })
    }
  }
}
