import { DateTime } from 'luxon'
import {
  BaseModel,
  afterFind,
  afterPaginate,
  belongsTo,
  column,
  computed,
  hasMany,
} from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import CommentLike from './comment_like.js'
import { HttpContext } from '@adonisjs/core/http'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare postId: number

  @column()
  declare createdById: number

  @belongsTo(() => User, {
    foreignKey: 'createdById',
  })
  declare createdBy: BelongsTo<typeof User>

  @column()
  declare content: string

  @hasMany(() => CommentLike, {
    foreignKey: 'commentId',
  })
  declare likes: HasMany<typeof CommentLike>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @computed()
  declare likesCount: number | undefined

  @computed()
  declare isLiked: boolean | undefined

  @afterFind()
  static async loadCommentRelations(comment: Comment) {
    const likes = await comment.related('likes').query()
    comment.likesCount = likes.length

    try {
      const httpContext = HttpContext.getOrFail()
      const userId = httpContext.auth.user?.id
      comment.isLiked = likes.some((like) => like.userId === userId)
    } catch {
      comment.isLiked = undefined
    }

    await comment.load((loader) => {
      loader.load('createdBy', (createdBy) => {
        createdBy.preload('avatar')
      })
    })
  }

  @afterPaginate()
  static async loadCommentsRelations(comments: Comment[]) {
    await Promise.all(comments.map((comment) => Comment.loadCommentRelations(comment)))
  }
}
