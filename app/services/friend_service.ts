import User from '#models/user'
import { inject } from '@adonisjs/core'

@inject()
export default class FriendService {
  async delete(user: User, friendId: number) {
    const friend = await user.related('friends').query().where('friend_id', friendId).firstOrFail()

    await user.related('friends').detach([friend.id])
    await friend.related('friends').detach([user.id])
  }
}
