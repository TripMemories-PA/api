import PoiService from '#services/poi_service'
import PostService from '#services/post_service'
import QuestionService from '#services/question_service'
import TicketService from '#services/ticket_service'
import { indexPoiValidator } from '#validators/poi/index_poi_validator'
import { indexPostValidator } from '#validators/post/index_post_validator'
import { indexQuestionValidator } from '#validators/question/index_question_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class PoiController {
  constructor(
    protected poiService: PoiService,
    protected postService: PostService,
    protected ticketSerivce: TicketService,
    protected questionService: QuestionService
  ) {}

  async index({ response, request }: HttpContext) {
    const payload = await request.validateUsing(indexPoiValidator)

    const pois = await this.poiService.index(payload)

    return response.ok(pois.toJSON())
  }

  async show({ response, params }: HttpContext) {
    const poi = await this.poiService.show(params.id)

    return response.ok(poi.toJSON())
  }

  async indexPosts({ response, request, params }: HttpContext) {
    const payload = await request.validateUsing(indexPostValidator)

    const posts = await this.postService.indexPoiPosts(params.id, payload)

    return response.ok(posts.toJSON())
  }

  async indexTickets({ response, params }: HttpContext) {
    const tickets = await this.ticketSerivce.indexPoiTickets(params.id)

    return response.ok(tickets)
  }

  async indexQuestions({ response, params, request }: HttpContext) {
    const payload = await request.validateUsing(indexQuestionValidator)
    const questions = await this.questionService.indexPoiQuestions(params.id, payload)

    return response.ok(questions.toJSON())
  }
}
