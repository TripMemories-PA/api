import User from '#models/user'
import { inject } from '@adonisjs/core'
import { PaginateRequest } from '../types/requests/paginate_request.js'

@inject()
export default class FriendService {
  async delete(userId: number, friendId: number) {
    const user = await User.findOrFail(userId)

    const friend = await user.related('friends').query().where('friend_id', friendId).firstOrFail()

    await user.related('friends').detach([friend.id])
    await friend.related('friends').detach([user.id])
  }

  async index(userId: number, request: PaginateRequest) {
    const user = await User.findOrFail(userId)

    return await user
      .related('friends')
      .query()
      .preload('avatar')
      .preload('banner')
      .paginate(request.page, request.perPage)
  }
}
