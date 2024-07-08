import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

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
    pivotColumns: ['is_banned'],
    pivotTimestamps: true,
  })
  declare users: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
