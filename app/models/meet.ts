import { DateTime } from 'luxon'
import {
  afterFind,
  afterPaginate,
  BaseModel,
  column,
  computed,
  manyToMany,
} from '@adonisjs/lucid/orm'
import User from './user.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { HttpContext } from '@adonisjs/core/http'

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

  @column()
  declare createdById: number

  @column()
  declare poiId: number

  @column()
  declare ticketId: number | null

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

  @afterFind()
  static async loadMeetRelations(meet: Meet) {
    try {
      const ctx = HttpContext.getOrFail()
      const currentUser = ctx.auth.user

      if (!currentUser) {
        meet.canJoin = null
        return
      }

      const hasJoined = await meet.related('users').query().where('user_id', currentUser.id).first()
      const users = await meet.related('users').query().where('is_banned', false)
      const actualSize = users.length

      if (hasJoined || actualSize >= meet.size) {
        meet.canJoin = false
      } else {
        meet.canJoin = true
      }
    } catch {
      meet.canJoin = null
    }
  }

  @afterPaginate()
  static async loadMeetsRelations(meets: Meet[]) {
    await Promise.all(meets.map((meet) => Meet.loadMeetRelations(meet)))
  }
}
