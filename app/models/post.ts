import { DateTime } from 'luxon'
import {
  BaseModel,
  afterFind,
  afterPaginate,
  belongsTo,
  column,
  hasMany,
} from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import UploadFile from './upload_file.js'
import Poi from './poi.js'
import Comment from './comment.js'
import PostLike from './post_like.js'
import { HttpContext } from '@adonisjs/core/http'
import Report from './report.js'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare createdById: number

  @belongsTo(() => User, {
    foreignKey: 'createdById',
  })
  declare createdBy: BelongsTo<typeof User>

  @column()
  declare poiId: number

  @belongsTo(() => Poi, {
    foreignKey: 'poiId',
  })
  declare poi: BelongsTo<typeof Poi>

  @column()
  declare imageId: number

  @belongsTo(() => UploadFile, {
    foreignKey: 'imageId',
  })
  declare image: BelongsTo<typeof UploadFile>

  @column()
  declare content: string

  @column()
  declare title: string

  @column()
  declare cityId: number

  @column()
  declare note: number

  @hasMany(() => Comment, {
    foreignKey: 'postId',
  })
  declare comments: HasMany<typeof Comment>

  @hasMany(() => Report, {
    foreignKey: 'postId',
  })
  declare reports: HasMany<typeof Report>

  @hasMany(() => PostLike, {
    foreignKey: 'postId',
  })
  declare likes: HasMany<typeof PostLike>

  @hasMany(() => PostLike, {
    foreignKey: 'postId',
  })
  declare like: HasMany<typeof PostLike>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare isLiked: boolean | null

  @column()
  declare isReported: boolean | null

  @column()
  declare likesCount: number | null

  @column()
  declare reportsCount: number | null

  @column()
  declare commentsCount: number | null

  @afterFind()
  static async loadPostRelations(post: Post) {
    const likes = await post.related('likes').query()
    post.likesCount = likes.length

    const comments = await post.related('comments').query()
    post.commentsCount = comments.length

    const reports = await post.related('reports').query()
    post.reportsCount = reports.length

    try {
      const httpContext = HttpContext.getOrFail()
      const userId = httpContext.auth.user?.id
      post.isLiked = likes.some((like) => like.userId === userId)
      post.isReported = reports.some((report) => report.userId === userId)
    } catch {
      post.isLiked = null
      post.isReported = null
    }

    await post.load((loader) => {
      loader.load('createdBy', (createdBy) => {
        createdBy.preload('avatar')
        createdBy.preload('userType')
      })
      loader.load('image')
      loader.load('poi', (poi) => {
        poi.preload('cover')
        poi.preload('type')
        poi.preload('city')
      })
    })
  }

  @afterPaginate()
  static async loadPostsRelations(posts: Post[]) {
    await Promise.all(posts.map((post) => Post.loadPostRelations(post)))
  }
}
