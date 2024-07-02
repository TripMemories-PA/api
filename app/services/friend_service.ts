import User from '#models/user'
import { inject } from '@adonisjs/core'
import { PaginateRequest } from '../types/requests/paginate_request.js'
import { UserTypes } from '../types/models/user_types.js'

@inject()
export default class FriendService {
  async delete(userId: number, friendId: number) {
    const user = await User.findOrFail(userId)

    const friend = await user.related('friends').query().where('friend_id', friendId).firstOrFail()

    await user.related('friends').detach([friend.id])
    await friend.related('friends').detach([user.id])
  }

  async index(userId: number, request: PaginateRequest) {
    const user = await User.query()
      .where('id', userId)
      .where('user_type_id', UserTypes.USER)
      .firstOrFail()

    return await user.related('friends').query().paginate(request.page, request.perPage)
  }
}
