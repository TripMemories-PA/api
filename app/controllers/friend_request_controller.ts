import FriendRequest from '#models/friend_request'
import FriendRequestService from '#services/friend_request_service'
import { createFriendRequestValidator } from '#validators/friend_request/create_friend_request_validator'
import { indexFriendRequestValidator } from '#validators/friend_request/index_friend_request_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class FriendRequestController {
  constructor(protected friendRequestService: FriendRequestService) {}

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createFriendRequestValidator, {
      meta: { userId: auth.user!.id },
    })

    const friendRequest = await this.friendRequestService.store(auth.user!, payload.userId)

    return response.created(friendRequest.toJSON())
  }

  async delete({ response, auth, params }: HttpContext) {
    await this.friendRequestService.delete(auth.user!, params.id)

    return response.noContent()
  }

  async accept({ response, auth, params }: HttpContext) {
    await this.friendRequestService.accept(auth.user!, params.id)

    return response.noContent()
  }

  async index({ response, auth, request }: HttpContext) {
    const payload = await request.validateUsing(indexFriendRequestValidator)

    const friendRequests = await this.friendRequestService.index(auth.user!, payload)

    return response.ok(friendRequests.toJSON())
  }
}
