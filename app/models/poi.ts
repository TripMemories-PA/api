import { DateTime } from 'luxon'
import {
  BaseModel,
  afterFind,
  afterPaginate,
  belongsTo,
  column,
  hasMany,
} from '@adonisjs/lucid/orm'
import UploadFile from './upload_file.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import PoiType from './poi_type.js'
import Post from './post.js'

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
  declare city: string

  @column()
  declare zipCode: string

  @column()
  declare address: string

  @column({ serializeAs: null })
  declare reference: string

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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterFind()
  static async loadPoiRelations(poi: Poi) {
    await poi.load((loader) => {
      loader.load('cover')
      loader.load('type')
    })
  }

  @afterPaginate()
  static async loadPoisRelations(pois: Poi[]) {
    await Promise.all(pois.map((poi) => Poi.loadPoiRelations(poi)))
  }
}
