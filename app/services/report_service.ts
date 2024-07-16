import Comment from '#models/comment'
import Post from '#models/post'
import { Exception } from '@adonisjs/core/exceptions'
import AuthService from './auth_service.js'
import { inject } from '@adonisjs/core'
import Report from '#models/report'

@inject()
export default class ReportService {
  constructor(private authService: AuthService) {}

  async reportPost(postId: number) {
    const post = await Post.query().where('id', postId).firstOrFail()

    const user = this.authService.getAuthenticatedUser()

    if (post.createdById === user.id) {
      throw new Exception('You cannot report your own post', { status: 403 })
    }

    const exist = await Report.query().where('userId', user.id).where('postId', postId).first()

    if (exist) {
      throw new Exception('You already reported this post', { status: 409 })
    }

    await Report.create({
      userId: user.id,
      postId,
    })
  }

  async reportComment(commentId: number) {
    const comment = await Comment.query().where('id', commentId).firstOrFail()

    const user = this.authService.getAuthenticatedUser()

    if (comment.createdById === user.id) {
      throw new Exception('You cannot report your own comment', { status: 403 })
    }

    const exist = await Report.query()
      .where('userId', user.id)
      .where('commentId', commentId)
      .first()

    if (exist) {
      throw new Exception('You already reported this comment', { status: 409 })
    }

    await Report.create({
      userId: user.id,
      commentId,
    })
  }
}
