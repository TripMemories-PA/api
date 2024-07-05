import Question from '#models/question'
import { Exception } from '@adonisjs/core/exceptions'
import { CreateQuestionRequest } from '../types/requests/question/create_question_request.js'
import { UpdateQuestionRequest } from '../types/requests/question/update_question_request.js'
import Answer from '#models/answer'
import FileService from './file_service.js'
import AuthService from './auth_service.js'

export default class QuestionService {
  constructor(
    private fileService: FileService,
    private authService: AuthService
  ) {}

  async index() {
    return await Question.query().orderByRaw('RAND()').limit(10).exec()
  }

  async indexPoiQuestions(poiId: number) {
    return await Question.query().where('poiId', poiId).orderByRaw('RAND()').limit(10).exec()
  }

  async create(payload: CreateQuestionRequest) {
    const correctAnswers = payload.answers.filter((answer) => answer.isCorrect)

    if (correctAnswers.length !== 1) {
      throw new Exception('There must be exactly one correct answer', { status: 400 })
    }

    const question = await Question.create({
      question: payload.question,
      imageId: payload.imageId,
      poiId: payload.poiId,
    })

    await question.related('answers').createMany(payload.answers)

    return question
  }

  async update(id: number, payload: UpdateQuestionRequest) {
    const question = await Question.query().where('id', id).firstOrFail()

    const user = this.authService.getAuthenticatedUser()

    if (question.poiId !== user.poiId) {
      throw new Exception('You are not allowed to update this question', { status: 403 })
    }

    question.merge({
      question: payload.question ?? question.question,
      imageId: payload.imageId ?? question.imageId,
    })

    await question.save()

    if (payload.answers) {
      const correctAnswers = payload.answers.filter((answer) => answer.isCorrect)

      if (correctAnswers.length !== 1) {
        throw new Exception('There must be exactly one correct answer', { status: 400 })
      }

      await Answer.query().where('questionId', id).delete()

      await question.related('answers').createMany(payload.answers)
    }

    return question
  }

  async delete(id: number) {
    const question = await Question.query().where('id', id).firstOrFail()

    const user = this.authService.getAuthenticatedUser()

    if (question.poiId !== user.poiId) {
      throw new Exception('You are not allowed to delete this question', { status: 403 })
    }

    if (question.image) {
      await this.fileService.delete(question.image)
    }

    await question.delete()
  }
}
