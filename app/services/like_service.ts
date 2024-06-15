import Comment from '#models/comment'
import CommentLike from '#models/comment_like'
import Post from '#models/post'
import PostLike from '#models/post_like'
import { Exception } from '@adonisjs/core/exceptions'

export default class LikeService {
  async likePost(userId: number, postId: number) {
    const post = await Post.query().where('id', postId).firstOrFail()

    if (post.createdById === userId) {
      throw new Exception('You cannot like your own post', { status: 403 })
    }

    const exist = await PostLike.query().where('userId', userId).where('postId', postId).first()

    if (exist) {
      throw new Exception('You already liked this post', { status: 409 })
    }

    await PostLike.create({
      userId,
      postId,
    })
  }

  async unlikePost(userId: number, postId: number) {
    await Post.query().where('id', postId).firstOrFail()

    const like = await PostLike.query()
      .where('userId', userId)
      .where('postId', postId)
      .firstOrFail()

    await like.delete()
  }

  async likeComment(userId: number, commentId: number) {
    const comment = await Comment.query().where('id', commentId).firstOrFail()

    if (comment.createdById === userId) {
      throw new Exception('You cannot like your own comment', { status: 403 })
    }

    const exist = await CommentLike.query()
      .where('userId', userId)
      .where('commentId', commentId)
      .first()

    if (exist) {
      throw new Exception('You already liked this comment', { status: 409 })
    }

    await CommentLike.create({
      userId,
      commentId,
    })
  }

  async unlikeComment(userId: number, commentId: number) {
    await Comment.query().where('id', commentId).firstOrFail()

    const like = await CommentLike.query()
      .where('userId', userId)
      .where('commentId', commentId)
      .firstOrFail()

    await like.delete()
  }
}
