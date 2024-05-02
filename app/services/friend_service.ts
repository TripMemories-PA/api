import User from '#models/user'
import { inject } from '@adonisjs/core'
import { PaginateRequest } from '../types/requests/paginate_request.js'

@inject()
export default class FriendService {
  async delete(user: User, friendId: number) {
    const friend = await user.related('friends').query().where('friend_id', friendId).firstOrFail()

    await user.related('friends').detach([friend.id])
    await friend.related('friends').detach([user.id])
  }

  async index(user: User, request: PaginateRequest) {
    const query = user.related('friends').query().preload('avatar')

    return await query.paginate(request.page, request.perPage)
  }
}
