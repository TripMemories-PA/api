import FriendService from '#services/friend_service'
import { indexFriendValidator } from '#validators/friend/index_friend_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class FriendController {
  constructor(protected friendService: FriendService) {}

  async delete({ response, auth, params }: HttpContext) {
    await this.friendService.delete(auth.user!.id, params.id)

    return response.noContent()
  }

  async indexMyFriends({ response, auth, request }: HttpContext) {
    const payload = await request.validateUsing(indexFriendValidator)

    const friends = await this.friendService.index(auth.user!.id, payload)

    return response.ok(friends.toJSON())
  }

  async indexFriends({ response, params, request }: HttpContext) {
    const payload = await request.validateUsing(indexFriendValidator)

    const friends = await this.friendService.index(params.id, payload)

    return response.ok(friends.toJSON())
  }
}
