import { DateTime } from 'luxon'
import { afterFetch, afterFind, BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Ticket from './ticket.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Meet from './meet.js'

export default class UserTicket extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime()
  declare usedAt: DateTime | null

  @column.dateTime()
  declare paidAt: DateTime | null

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

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @column()
  declare meetId: number | null

  @belongsTo(() => Meet, {
    foreignKey: 'meetId',
  })
  declare meet: BelongsTo<typeof Meet>

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

    await userTicket.load('user', (user) => {
      user.preload('avatar')
      user.preload('banner')
      user.preload('userType')
    })
  }

  @afterFetch()
  static async loadUserTicketsRelations(userTickets: UserTicket[]) {
    await Promise.all(
      userTickets.map((userTicket) => UserTicket.loadUserTicketRelations(userTicket))
    )
  }
}
