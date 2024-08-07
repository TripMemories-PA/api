import { DateTime } from 'luxon'
import {
  afterFind,
  afterPaginate,
  BaseModel,
  belongsTo,
  column,
  computed,
  hasMany,
  manyToMany,
} from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { HttpContext } from '@adonisjs/core/http'
import Poi from './poi.js'
import Ticket from './ticket.js'
import UserTicket from './user_ticket.js'
import Message from './message.js'

export default class Meet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare size: number

  @column()
  declare date: DateTime

  @column({
    serialize(value) {
      return (value / 100).toFixed(2)
    },
  })
  declare price: number | null

  @column()
  declare channel: string

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
  declare ticketId: number | null

  @belongsTo(() => Ticket, {
    foreignKey: 'ticketId',
  })
  declare ticket: BelongsTo<typeof Ticket>

  @hasMany(() => Message, {
    foreignKey: 'meetId',
  })
  declare messages: HasMany<typeof Message>

  @manyToMany(() => User, {
    pivotTable: 'meets_users',
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'meet_id',
    pivotRelatedForeignKey: 'user_id',
    pivotColumns: ['is_banned', 'has_paid'],
    pivotTimestamps: true,
  })
  declare users: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @computed()
  declare canJoin: boolean | null

  @computed()
  declare usersCount: number

  @computed()
  declare isLocked: boolean

  @computed()
  declare hasJoined: boolean | null

  @afterFind()
  static async loadMeetRelations(meet: Meet) {
    await meet.load((loader) => {
      loader.load('poi', (poi) => {
        poi.preload('cover')
        poi.preload('type')
        poi.preload('city')
      })

      loader.load('createdBy', (createdBy) => {
        createdBy.preload('avatar')
        createdBy.preload('userType')
      })

      loader.load('ticket')
    })

    const paid = await UserTicket.query().where('meetId', meet.id).where('paid', true).first()
    meet.isLocked = !!paid

    const users = await meet.related('users').query().where('is_banned', false)
    meet.usersCount = users.length

    try {
      const ctx = HttpContext.getOrFail()
      const currentUser = ctx.auth.user

      if (!currentUser) {
        meet.canJoin = null
        meet.hasJoined = null
        return
      }

      const hasJoined = await meet.related('users').query().where('user_id', currentUser.id).first()
      const isBanned = await meet
        .related('users')
        .query()
        .where('user_id', currentUser.id)
        .where('is_banned', true)
        .first()

      if (hasJoined) {
        if (isBanned) {
          meet.hasJoined = false
        } else {
          meet.hasJoined = true
        }
      }

      if (hasJoined || meet.usersCount >= meet.size) {
        meet.canJoin = false
      } else {
        meet.canJoin = true
      }
    } catch {
      meet.canJoin = null
      meet.hasJoined = null
    }
  }

  @afterPaginate()
  static async loadMeetsRelations(meets: Meet[]) {
    await Promise.all(meets.map((meet) => Meet.loadMeetRelations(meet)))
  }
}
