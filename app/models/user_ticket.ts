import { DateTime } from 'luxon'
import { afterFetch, afterFind, BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Ticket from './ticket.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

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

  @belongsTo(() => Ticket, {
    foreignKey: 'ticketId',
  })
  declare ticket: BelongsTo<typeof Ticket>

  @column()
  declare userId: number

  @column({ serializeAs: null })
  declare price: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterFind()
  static async loadUserTicketRelations(userTicket: UserTicket) {
    await userTicket.load('ticket', (ticket) => {
      ticket.preload('poi', (poi) => {
        poi.preload('cover')
        poi.preload('city')
        poi.preload('type')
      })
    })
  }

  @afterFetch()
  static async loadUserTicketsRelations(userTickets: UserTicket[]) {
    await Promise.all(
      userTickets.map((userTicket) => UserTicket.loadUserTicketRelations(userTicket))
    )
  }
}
