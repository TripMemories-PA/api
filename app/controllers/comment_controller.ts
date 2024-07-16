import CommentService from '#services/comment_service'
import LikeService from '#services/like_service'
import { indexCommentValidator } from '#validators/comment/index_comment_validator'
import { storeCommentValidator } from '#validators/comment/store_comment_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class CommentController {
  constructor(
    protected commentService: CommentService,
    protected likeService: LikeService
  ) {}

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(storeCommentValidator)
    const userId = auth.user!.id

    const comment = await this.commentService.store(userId, payload)

    return response.created(comment.toJSON())
  }

  async delete({ response, params }: HttpContext) {
    await this.commentService.delete(params.id)

    return response.noContent()
  }

  async like({ response, auth, params }: HttpContext) {
    await this.likeService.likeComment(auth.user!.id, params.id)

    return response.noContent()
  }

  async unlike({ response, auth, params }: HttpContext) {
    await this.likeService.unlikeComment(auth.user!.id, params.id)

    return response.noContent()
  }

  async index({ response, request }: HttpContext) {
    const payload = await request.validateUsing(indexCommentValidator)

    const comments = await this.commentService.index(payload)

    return response.ok(comments.toJSON())
  }
}
