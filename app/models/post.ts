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
  declare note: number

  @hasMany(() => Comment, {
    foreignKey: 'postId',
  })
  declare comments: HasMany<typeof Comment>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterFind()
  static async loadPostRelations(post: Post) {
    await post.load((loader) => {
      loader.load('createdBy', (createdBy) => {
        createdBy.preload('avatar')
      })
      loader.load('image')
    })
  }

  @afterPaginate()
  static async loadPostsRelations(posts: Post[]) {
    await Promise.all(posts.map((post) => Post.loadPostRelations(post)))
  }
}
