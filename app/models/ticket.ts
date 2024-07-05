import { DateTime } from 'luxon'
import { afterFetch, afterFind, BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Poi from './poi.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

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

  @belongsTo(() => Poi, {
    foreignKey: 'poiId',
  })
  declare poi: BelongsTo<typeof Poi>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterFind()
  static async loadTicketRelations(ticket: Ticket) {
    await ticket.load('poi', (poi) => {
      poi.preload('cover')
      poi.preload('city')
      poi.preload('type')
    })
  }

  @afterFetch()
  static async loadTicketsRelations(tickets: Ticket[]) {
    await Promise.all(tickets.map((ticket) => Ticket.loadTicketRelations(ticket)))
  }
}
