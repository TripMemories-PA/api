import CommentService from '#services/comment_service'
import FileService from '#services/file_service'
import PostService from '#services/post_service'
import { indexCommentValidator } from '#validators/comment/index_comment_validator'
import { createPostImageValidator } from '#validators/post/create_post_image_validator'
import { createPostValidator } from '#validators/post/create_post_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class PostController {
  constructor(
    protected postService: PostService,
    protected fileService: FileService,
    protected commentService: CommentService
  ) {}

  async show({ response, params }: HttpContext) {
    const post = await this.postService.show(params.id)

    return response.ok(post)
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createPostValidator)
    const userId = auth.user!.id

    const post = await this.postService.create(userId, payload)

    return response.created(post.toJSON())
  }

  async storeImage({ response, request }: HttpContext) {
    const { file } = await request.validateUsing(createPostImageValidator)

    const uploadedFile = await this.fileService.store(file)

    return response.created(uploadedFile.toJSON())
  }

  async delete({ response, params }: HttpContext) {
    await this.postService.delete(params.id)

    return response.noContent()
  }

  async indexComments({ response, request, params }: HttpContext) {
    const payload = await request.validateUsing(indexCommentValidator)

    const comments = await this.commentService.indexPostComments(params.id, payload)

    return response.ok(comments.toJSON())
  }
}
