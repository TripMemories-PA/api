import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Poi extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare coverId: number

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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
