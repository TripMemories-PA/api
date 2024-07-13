import { DateTime } from 'luxon'
import { afterFind, afterPaginate, BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare content: string

  @column()
  declare senderId: number

  @belongsTo(() => User, {
    foreignKey: 'senderId',
  })
  declare sender: BelongsTo<typeof User>

  @column({ serializeAs: null })
  declare receiverId: number | null

  @column({ serializeAs: null })
  declare meetId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterFind()
  static async loadMessageRelations(message: Message) {
    await message.load('sender', (sender) => {
      sender.preload('avatar')
      sender.preload('userType')
      sender.preload('banner')
    })
  }

  @afterPaginate()
  static async loadMessagesRelations(messages: Message[]) {
    await Promise.all(messages.map((message) => Message.loadMessageRelations(message)))
  }
}
