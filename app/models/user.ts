import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import UploadFile from './upload_file.js'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import FriendRequest from './friend_request.js'
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email', 'username'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare firstname: string

  @column()
  declare lastname: string

  @column({ serializeAs: null })
  declare avatarId: number

  @belongsTo(() => UploadFile, {
    foreignKey: 'avatarId',
  })
  declare avatar: BelongsTo<typeof UploadFile>

  @hasMany(() => FriendRequest, {
    foreignKey: 'senderId',
  })
  declare sentFriendRequests: HasMany<typeof FriendRequest>

  @hasMany(() => FriendRequest, {
    foreignKey: 'receiverId',
  })
  declare receivedFriendRequests: HasMany<typeof FriendRequest>

  @manyToMany(() => User, {
    pivotTable: 'friends',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'friend_id',
  })
  declare friends: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static readonly accessTokens = DbAccessTokensProvider.forModel(User)
}
