import FriendService from '#services/friend_service'
import { indexFriendValidator } from '#validators/friend/index_friend_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class FriendController {
  constructor(protected friendService: FriendService) {}

  async delete({ response, auth, params }: HttpContext) {
    await this.friendService.delete(auth.user!, params.id)

    return response.noContent()
  }

  async index({ response, auth, request }: HttpContext) {
    const payload = await request.validateUsing(indexFriendValidator)

    const friends = await this.friendService.index(auth.user!, payload)

    return response.ok(friends.toJSON())
  }
}
