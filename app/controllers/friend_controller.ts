import FriendService from '#services/friend_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class FriendController {
  constructor(protected friendService: FriendService) {}

  async delete({ response, auth, params }: HttpContext) {
    await this.friendService.delete(auth.user!, params.id)

    return response.noContent()
  }
}
