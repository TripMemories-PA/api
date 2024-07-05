import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Question from './question.js'
import { BelongsTo } from '@adonisjs/lucid/types/relations'

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
  declare isCorrect: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
