import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import {
  BaseModel,
  afterFind,
  afterPaginate,
  belongsTo,
  column,
  computed,
  hasMany,
  manyToMany,
} from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import UploadFile from './upload_file.js'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import FriendRequest from './friend_request.js'
import { HttpContext } from '@adonisjs/core/http'
import Post from './post.js'

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

  @column()
  declare avatarId: number

  @belongsTo(() => UploadFile, {
    foreignKey: 'avatarId',
  })
  declare avatar: BelongsTo<typeof UploadFile>

  @column()
  declare bannerId: number

  @belongsTo(() => UploadFile, {
    foreignKey: 'bannerId',
  })
  declare banner: BelongsTo<typeof UploadFile>

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
    serializeAs: null,
  })
  declare friends: ManyToMany<typeof User>

  @hasMany(() => Post, {
    foreignKey: 'createdById',
  })
  declare posts: HasMany<typeof Post>

  @computed()
  declare isFriend: boolean | undefined

  @computed()
  declare hasSentFriendRequest: boolean | undefined

  @computed()
  declare hasReceivedFriendRequest: boolean | undefined

  @computed()
  declare poisCount: number | undefined

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static readonly accessTokens = DbAccessTokensProvider.forModel(User)

  @afterFind()
  static async loadUserRelations(user: User) {
    await user.load((loader) => {
      loader.load('avatar')
      loader.load('banner')
    })

    const distinctPois = await user.related('posts').query().distinct('poi_id')
    user.poisCount = distinctPois.length

    try {
      const ctx = HttpContext.getOrFail()
      const currentUser = ctx.auth.user

      if (!currentUser || currentUser.id === user.id) {
        user.isFriend = undefined
        user.hasSentFriendRequest = undefined
        user.hasReceivedFriendRequest = undefined
        return
      }

      const friends = await user
        .related('friends')
        .query()
        .where('friend_id', currentUser.id)
        .first()

      user.isFriend = !!friends

      const sentFriendRequest = await user
        .related('sentFriendRequests')
        .query()
        .where('receiver_id', currentUser.id)
        .first()

      const receivedFriendRequest = await user
        .related('receivedFriendRequests')
        .query()
        .where('sender_id', currentUser.id)
        .first()

      user.hasSentFriendRequest = !!sentFriendRequest
      user.hasReceivedFriendRequest = !!receivedFriendRequest
    } catch {
      user.isFriend = undefined
      user.hasSentFriendRequest = undefined
      user.hasReceivedFriendRequest = undefined
    }
  }

  @afterPaginate()
  static async loadUsersRelations(users: User[]) {
    await Promise.all(users.map((user) => User.loadUserRelations(user)))
  }
}
