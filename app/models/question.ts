import { DateTime } from 'luxon'
import { afterFetch, afterFind, BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Poi from './poi.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import UploadFile from './upload_file.js'
import Answer from './answer.js'

export default class Question extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare question: string

  @column()
  declare imageId: number | null

  @belongsTo(() => UploadFile, {
    foreignKey: 'imageId',
  })
  declare image: BelongsTo<typeof UploadFile>

  @column()
  declare poiId: number

  @belongsTo(() => Poi, {
    foreignKey: 'poiId',
  })
  declare poi: BelongsTo<typeof Poi>

  @hasMany(() => Answer, {
    foreignKey: 'questionId',
  })
  declare answers: HasMany<typeof Answer>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterFind()
  static async loadQuestionRelations(question: Question) {
    await question.load((loader) => {
      loader.load('image')
      loader.load('poi', (poi) => {
        poi.preload('city')
        poi.preload('type')
        poi.preload('cover')
      })

      loader.load('answers', (answers) => {
        answers.orderByRaw('RANDOM()')
      })
    })
  }

  @afterFetch()
  static async loadQuestionsRelations(questions: Question[]) {
    await Promise.all(questions.map((question) => Question.loadQuestionRelations(question)))
  }
}
