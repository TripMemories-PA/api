import FriendRequestService from '#services/friend_request_service'
import { createFriendRequestValidator } from '#validators/friend_request/create_friend_request_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class FriendRequestController {
  constructor(protected friendRequestService: FriendRequestService) {}

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createFriendRequestValidator, {
      meta: { userId: auth.user!.id },
    })

    const friendRequest = await this.friendRequestService.store(auth.user!, payload.user_id)

    return response.created(friendRequest)
  }
}
