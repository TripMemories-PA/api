import User from '#models/user'
import { inject } from '@adonisjs/core'
import { UserTypes } from '../types/models/user_types.js'
import { IndexFriendRequest } from '../types/requests/friend/index_friend_request.js'

@inject()
export default class FriendService {
  async delete(userId: number, friendId: number) {
    const user = await User.findOrFail(userId)

    const friend = await user.related('friends').query().where('friend_id', friendId).firstOrFail()

    await user.related('friends').detach([friend.id])
    await friend.related('friends').detach([user.id])
  }

  async index(userId: number, request: IndexFriendRequest) {
    const user = await User.query()
      .where('id', userId)
      .where('user_type_id', UserTypes.USER)
      .firstOrFail()

    const query = user.related('friends').query()

    if (request.swLat && request.swLng && request.neLat && request.neLng) {
      query
        .whereBetween('latitude', [request.swLat, request.neLat])
        .whereBetween('longitude', [request.swLng, request.neLng])
    }

    return await query.paginate(request.page, request.perPage)
  }
}
