import { AnswerFactory } from '#database/factories/answer_factory'
import { QuestionFactory } from '#database/factories/question_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const defaultPoiId = 3407 // Arc de Triomphe
    const countQuestionsWithImage = 10
    const countQuestionsWithoutImage = 10

    let questions = await QuestionFactory.merge({
      poiId: defaultPoiId,
    })
      .with('image')
      .createMany(countQuestionsWithImage)

    questions = questions.concat(
      await QuestionFactory.merge({
        poiId: defaultPoiId,
      }).createMany(countQuestionsWithoutImage)
    )

    for (const question of questions) {
      await AnswerFactory.merge({
        answer: 'Correct answer',
        questionId: question.id,
        isCorrect: true,
      }).create()

      const incorrectAnswers = Math.floor(Math.random() * 3) + 1
      await AnswerFactory.merge({
        answer: 'Incorrect answer',
        questionId: question.id,
        isCorrect: false,
      }).createMany(incorrectAnswers)
    }
  }
}
