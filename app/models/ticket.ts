import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Ticket extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare quantity: number

  @column({
    serialize(value) {
      return (value / 100).toFixed(2)
    },
  })
  declare price: number

  @column()
  declare groupSize: number

  @column({
    serializeAs: null,
  })
  declare available: boolean

  @column()
  declare poiId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
