import { DateTime } from 'luxon'
import {
  afterFind,
  afterPaginate,
  BaseModel,
  belongsTo,
  column,
  computed,
} from '@adonisjs/lucid/orm'
import UploadFile from './upload_file.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { HttpContext } from '@adonisjs/core/http'

export default class Quest extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare imageId: number

  @belongsTo(() => UploadFile, {
    foreignKey: 'imageId',
  })
  declare image: BelongsTo<typeof UploadFile>

  @column()
  declare poiId: number

  @column({ serializeAs: null })
  declare label: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @computed()
  declare done: boolean | null

  @afterFind()
  static async loadQuestRelations(quest: Quest) {
    await quest.load('image')

    try {
      const ctx = HttpContext.getOrFail()
      const currentUser = ctx.auth.user

      if (!currentUser) {
        quest.done = null
        return
      }

      const done = await currentUser.related('quests').query().where('quest_id', quest.id).exec()

      quest.done = !!done.length
    } catch (error) {
      quest.done = null
    }
  }

  @afterPaginate()
  static async loadQuestsRelations(quests: Quest[]) {
    await Promise.all(quests.map((quest) => Quest.loadQuestRelations(quest)))
  }
}
