import Question from '#models/question'
import { Exception } from '@adonisjs/core/exceptions'
import { CreateQuestionRequest } from '../types/requests/question/create_question_request.js'
import { UpdateQuestionRequest } from '../types/requests/question/update_question_request.js'
import Answer from '#models/answer'
import FileService from './file_service.js'
import AuthService from './auth_service.js'
import User from '#models/user'
import { inject } from '@adonisjs/core'
import { PaginateRequest } from '../types/requests/paginate_request.js'

@inject()
export default class QuestionService {
  constructor(
    private fileService: FileService,
    private authService: AuthService
  ) {}

  async index(payload: PaginateRequest) {
    return await Question.query().orderByRaw('RANDOM()').paginate(payload.page, payload.perPage)
  }

  async indexPoiQuestions(poiId: number, payload: PaginateRequest) {
    return await Question.query()
      .where('poiId', poiId)
      .orderByRaw('RANDOM()')
      .paginate(payload.page, payload.perPage)
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

    payload.answers.sort(() => Math.random() - 0.5)
    await question.related('answers').createMany(payload.answers)

    return question
  }

  async update(id: number, payload: UpdateQuestionRequest) {
    const question = await Question.query().where('id', id).firstOrFail()

    const user = this.authService.getAuthenticatedUser()

    if (question.poiId !== user.poiId) {
      throw new Exception('You are not allowed to update this question', { status: 403 })
    }

    if (payload.answers) {
      const correctAnswers = payload.answers.filter((answer) => answer.isCorrect)

      if (correctAnswers.length !== 1) {
        throw new Exception('There must be exactly one correct answer', { status: 400 })
      }

      await Answer.query().where('questionId', id).delete()

      payload.answers.sort(() => Math.random() - 0.5)
      await question.related('answers').createMany(payload.answers)
    }

    if (question.image && payload.imageId) {
      this.fileService.delete(question.image)
    }

    question.merge({
      question: payload.question ?? question.question,
      imageId: payload.imageId ?? question.imageId,
    })

    return await question.save()
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

  async validateAnswer(questionId: number, answerId: number, userId?: number) {
    const question = await Question.query().where('id', questionId).preload('answers').firstOrFail()

    const answer = question.answers.find((e) => e.id === answerId)

    if (!answer) {
      throw new Exception('Answer not found', { status: 404 })
    }

    if (userId) {
      const user = await User.query().where('id', userId).firstOrFail()

      if (answer.isCorrect) {
        user.score += 10
        await user.save()
      } else {
        user.score -= 5
        await user.save()
      }
    }

    return answer.isCorrect
  }
}
