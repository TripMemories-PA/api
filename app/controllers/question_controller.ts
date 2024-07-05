import FileService from '#services/file_service'
import QuestionService from '#services/question_service'
import { storeQuestionImageValidator } from '#validators/question/store_question_image_validator'
import { storeQuestionValidator } from '#validators/question/store_question_validator'
import { updateQuestionValidator } from '#validators/question/update_question_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class QuestionController {
  constructor(
    protected questionService: QuestionService,
    protected fileService: FileService
  ) {}

  async index({ response }: HttpContext) {
    const questions = await this.questionService.index()

    return response.ok(questions)
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(storeQuestionValidator)

    const question = await this.questionService.create({
      ...payload,
      poiId: auth.user!.poiId,
    })

    return response.created(question.toJSON())
  }

  async storeImage({ request, response }: HttpContext) {
    const { file } = await request.validateUsing(storeQuestionImageValidator)

    const uploadedFile = await this.fileService.store(file)

    return response.created(uploadedFile.toJSON())
  }

  async update({ request, response, params }: HttpContext) {
    const payload = await request.validateUsing(updateQuestionValidator)

    const question = await this.questionService.update(params.id, payload)

    return response.ok(question.toJSON())
  }

  async delete({ response, params }: HttpContext) {
    await this.questionService.delete(params.id)

    return response.noContent()
  }

  async validateAnswer({ params, response, auth }: HttpContext) {
    const isCorrect = await this.questionService.validateAnswer(
      params.questionId,
      params.answerId,
      auth.user ? auth.user.id : undefined
    )

    return response.ok({ isCorrect })
  }
}
