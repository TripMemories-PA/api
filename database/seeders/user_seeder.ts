import { UserFactory } from '#database/factories/user_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const countUser = 3
    const countFriends = 5
    const countSentFriendRequests = 3
    const countReceivedFriendRequests = 3
    const defaultPassword = 'Test1234!'

    for (let i = 1; i <= countUser; i++) {
      const user = await UserFactory.merge({
        username: `user${i}`,
        email: `user${i}@mail.com`,
        password: defaultPassword,
      }).create()

      const friends = await UserFactory.merge({
        password: defaultPassword,
      }).createMany(countFriends)
      const friendIds = friends.map((friend) => friend.id)
      await user.related('friends').attach(friendIds)
      for (const friend of friends) {
        await friend.related('friends').attach([user.id])
      }

      const sentfriendRequests = await UserFactory.merge({
        password: defaultPassword,
      }).createMany(countSentFriendRequests)
      for (const sentfriendRequest of sentfriendRequests) {
        await user.related('sentFriendRequests').create({ receiverId: sentfriendRequest.id })
      }

      const receivedFriendRequests = await UserFactory.merge({
        password: defaultPassword,
      }).createMany(countReceivedFriendRequests)
      for (const receivedFriendRequest of receivedFriendRequests) {
        await user.related('receivedFriendRequests').create({ senderId: receivedFriendRequest.id })
      }
    }
  }
}
