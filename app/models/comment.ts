import { DateTime } from 'luxon'
import { BaseModel, afterFind, afterPaginate, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterFind()
  static async loadCommentRelations(comment: Comment) {
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
