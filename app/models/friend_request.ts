import { DateTime } from 'luxon'
import { BaseModel, afterFind, afterPaginate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class FriendRequest extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare senderId: number

  @belongsTo(() => User, {
    foreignKey: 'senderId',
  })
  declare sender: BelongsTo<typeof User>

  @column()
  declare receiverId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterFind()
  static async loadFriendRequestRelations(request: FriendRequest) {
    await request.load('sender', (sender) => {
      sender.preload('avatar')
    })
  }

  @afterPaginate()
  static async loadFriendRequestsRelations(requests: FriendRequest[]) {
    await Promise.all(requests.map((request) => FriendRequest.loadFriendRequestRelations(request)))
  }
}
