import CommentService from '#services/comment_service'
import { storeCommentValidator } from '#validators/comment/store_comment_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class CommentController {
  constructor(protected commentService: CommentService) {}

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
}
