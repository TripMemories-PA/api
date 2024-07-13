import FileService from '#services/file_service'
import MeetService from '#services/meet_service'
import PoiService from '#services/poi_service'
import PostService from '#services/post_service'
import QuestService from '#services/quest_service'
import QuestionService from '#services/question_service'
import TicketService from '#services/ticket_service'
import { indexMeetValidator } from '#validators/meet/index_meet_validator'
import { indexPoiValidator } from '#validators/poi/index_poi_validator'
import { storePoiCoverValidator } from '#validators/poi/store_poi_cover_validator'
import { storePoiValidator } from '#validators/poi/store_poi_validator'
import { updatePoiValidator } from '#validators/poi/update_poi_validator'
import { indexPostValidator } from '#validators/post/index_post_validator'
import { indexQuestValidator } from '#validators/quest/index_quest_validator'
import { indexQuestionValidator } from '#validators/question/index_question_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class PoiController {
  constructor(
    protected poiService: PoiService,
    protected postService: PostService,
    protected ticketSerivce: TicketService,
    protected questionService: QuestionService,
    protected meetService: MeetService,
    protected fileService: FileService,
    protected questService: QuestService
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

  async indexMeets({ response, params, request }: HttpContext) {
    const payload = await request.validateUsing(indexMeetValidator)
    const meets = await this.meetService.indexPoiMeets(params.id, payload)

    return response.ok(meets.toJSON())
  }

  async store({ response, request }: HttpContext) {
    const payload = await request.validateUsing(storePoiValidator)

    const poi = await this.poiService.create(payload)

    return response.created(poi.toJSON())
  }

  async storeCover({ response, request }: HttpContext) {
    const { file } = await request.validateUsing(storePoiCoverValidator)

    const cover = await this.fileService.store(file)

    return response.created(cover.toJSON())
  }

  async update({ response, request, params }: HttpContext) {
    const payload = await request.validateUsing(updatePoiValidator)

    const poi = await this.poiService.update(params.id, payload)

    return response.ok(poi.toJSON())
  }

  async indexTypes({ response }: HttpContext) {
    const types = await this.poiService.indexTypes()

    return response.ok(types)
  }

  async indexQuests({ response, request, params }: HttpContext) {
    const payload = await request.validateUsing(indexQuestValidator)

    const quests = await this.questService.indexPoiQuests(params.id, payload)

    return response.ok(quests.toJSON())
  }
}
