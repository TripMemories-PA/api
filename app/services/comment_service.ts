import Comment from '#models/comment'
import Post from '#models/post'
import { inject } from '@adonisjs/core'
import { StoreCommentRequest } from '../types/requests/comment/store_comment_request.js'
import AuthService from './auth_service.js'
import { Exception } from '@adonisjs/core/exceptions'

@inject()
export default class CommentService {
  constructor(private authService: AuthService) {}

  async indexPostComments(postId: number, payload: any) {
    const post = await Post.query().where('id', postId).firstOrFail()

    return await post.related('comments').query().paginate(payload.page, payload.perPage)
  }

  async store(createdById: number, payload: StoreCommentRequest) {
    return await Comment.create({ createdById, postId: payload.postId, content: payload.content })
  }

  async delete(id: number) {
    const authUser = this.authService.getAuthenticatedUser()

    const comment = await Comment.query().where('id', id).firstOrFail()

    if (comment.createdById !== authUser.id) {
      throw new Exception('You are not authorized to delete this comment', { status: 403 })
    }

    await comment.delete()
  }
}
