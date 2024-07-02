import FriendService from '#services/friend_service'
import PostService from '#services/post_service'
import { indexFriendValidator } from '#validators/friend/index_friend_validator'
import { indexPostValidator } from '#validators/post/index_post_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class FriendController {
  constructor(
    protected friendService: FriendService,
    protected postService: PostService
  ) {}

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

  async indexMyFriendsPosts({ response, auth, request }: HttpContext) {
    const payload = await request.validateUsing(indexPostValidator)

    const friendsPosts = await this.postService.indexUserFriendsPosts(auth.user!.id, payload)

    return response.ok(friendsPosts.toJSON())
  }
}
