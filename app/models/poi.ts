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
import UploadFile from './upload_file.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import PoiType from './poi_type.js'
import Post from './post.js'
import City from './city.js'
import Question from './question.js'
import Quest from './quest.js'
import { HttpContext } from '@adonisjs/core/http'
import { UserTypes } from '../types/models/user_types.js'
import User from './user.js'

export default class Poi extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare coverId: number

  @belongsTo(() => UploadFile, {
    foreignKey: 'coverId',
  })
  declare cover: BelongsTo<typeof UploadFile>

  @column()
  declare latitude: number

  @column()
  declare longitude: number

  @column()
  declare cityId: number

  @belongsTo(() => City, {
    foreignKey: 'cityId',
  })
  declare city: BelongsTo<typeof City>

  @column()
  declare address: string

  @column({ serializeAs: null })
  declare reference: string | null

  @column()
  declare typeId: number

  @belongsTo(() => PoiType, {
    foreignKey: 'typeId',
  })
  declare type: BelongsTo<typeof PoiType>

  @hasMany(() => Post, {
    foreignKey: 'poiId',
  })
  declare posts: HasMany<typeof Post>

  @hasMany(() => Question, {
    foreignKey: 'poiId',
  })
  declare questions: HasMany<typeof Question>

  @hasMany(() => Quest, {
    foreignKey: 'poiId',
  })
  declare quests: HasMany<typeof Quest>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @computed()
  declare postsCount: number | null

  @computed()
  declare averageNote: number | null

  @computed()
  declare questionsCount: number | null

  @computed()
  declare isManaged: boolean | undefined

  @afterFind()
  static async loadPoiRelations(poi: Poi) {
    const posts = await poi.related('posts').query()
    poi.postsCount = posts.length

    const questions = await poi.related('questions').query()
    poi.questionsCount = questions.length

    const notes = posts.map((post) => Number(post.note))
    if (notes.length === 0) {
      poi.averageNote = null
    } else {
      const averageNote = notes.reduce((acc, note) => acc + note, 0) / notes.length
      poi.averageNote = Math.round(averageNote * 10) / 10
    }

    try {
      const ctx = HttpContext.getOrFail()
      const currentUser = ctx.auth.user
      if (currentUser?.userTypeId === UserTypes.ADMIN) {
        const manager = await User.query().where('poiId', poi.id).first()

        poi.isManaged = !!manager
      }
    } catch {
      poi.isManaged = undefined
    }

    await poi.load((loader) => {
      loader.load('cover')
      loader.load('type')
      loader.load('city')
    })
  }

  @afterPaginate()
  static async loadPoisRelations(pois: Poi[]) {
    await Promise.all(pois.map((poi) => Poi.loadPoiRelations(poi)))
  }
}
