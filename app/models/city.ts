import { DateTime } from 'luxon'
import { BaseModel, afterFind, afterPaginate, belongsTo, column } from '@adonisjs/lucid/orm'
import UploadFile from './upload_file.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class City extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare zipCode: string

  @column()
  declare coverId: number

  @belongsTo(() => UploadFile, {
    foreignKey: 'coverId',
  })
  declare cover: BelongsTo<typeof UploadFile>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterFind()
  static async loadCityRelations(city: City) {
    await city.load((loader) => {
      loader.load('cover')
    })
  }

  @afterPaginate()
  static async loadCitiesRelations(cities: City[]) {
    await Promise.all(cities.map((city) => City.loadCityRelations(city)))
  }
}
