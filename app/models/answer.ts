import { DateTime } from 'luxon'
import { afterFetch, afterFind, BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Question from './question.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { HttpContext } from '@adonisjs/core/http'
import { UserTypes } from '../types/models/user_types.js'

export default class Answer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare questionId: number

  @belongsTo(() => Question, {
    foreignKey: 'questionId',
  })
  declare question: BelongsTo<typeof Question>

  @column()
  declare answer: string

  @column()
  declare isCorrect: boolean | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterFind()
  static async loadAnswerRelations(answer: Answer) {
    try {
      const ctx = HttpContext.getOrFail()
      const currentUser = ctx.auth.user

      if (!currentUser || currentUser.userTypeId !== UserTypes.POI) {
        answer.isCorrect = null
      }
    } catch (error) {
      answer.isCorrect = null
    }
  }

  @afterFetch()
  static async loadAnswersRelations(answers: Answer[]) {
    await Promise.all(answers.map((answer) => Answer.loadAnswerRelations(answer)))
  }
}
