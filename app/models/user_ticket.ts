import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserTicket extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime()
  declare usedAt: DateTime | null

  @column()
  declare paid: boolean

  @column({ serializeAs: null })
  declare piId: string

  @column()
  declare qrCode: string

  @column()
  declare ticketId: number

  @column()
  declare userId: number

  @column({ serializeAs: null })
  declare price: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
