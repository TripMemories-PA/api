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
import Report from './report.js'

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

  @hasMany(() => Report, {
    foreignKey: 'commentId',
  })
  declare reports: HasMany<typeof Report>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @computed()
  declare likesCount: number | null

  @computed()
  declare reportsCount: number | null

  @computed()
  declare isLiked: boolean | null

  @computed()
  declare isReported: boolean | null

  @afterFind()
  static async loadCommentRelations(comment: Comment) {
    const likes = await comment.related('likes').query()
    comment.likesCount = likes.length

    const reports = await comment.related('reports').query()
    comment.reportsCount = reports.length

    try {
      const httpContext = HttpContext.getOrFail()
      const userId = httpContext.auth.user?.id
      comment.isLiked = likes.some((like) => like.userId === userId)
      comment.isReported = reports.some((report) => report.userId === userId)
    } catch {
      comment.isLiked = null
      comment.isReported = null
    }

    await comment.load((loader) => {
      loader.load('createdBy', (createdBy) => {
        createdBy.preload('avatar')
        createdBy.preload('userType')
      })
    })
  }

  @afterPaginate()
  static async loadCommentsRelations(comments: Comment[]) {
    await Promise.all(comments.map((comment) => Comment.loadCommentRelations(comment)))
  }
}
