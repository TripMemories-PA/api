import Quest from '#models/quest'
import { inject } from '@adonisjs/core'
import { PaginateRequest } from '../types/requests/paginate_request.js'
import { CreateQuestRequest } from '../types/requests/quest/create_quest_request.js'
import { UpdateQuestRequest } from '../types/requests/quest/update_quest_request.js'
import AuthService from './auth_service.js'
import UploadFile from '#models/upload_file'
import GoogleVisionService from './google_vision_service.js'
import { Exception } from '@adonisjs/core/exceptions'

@inject()
export default class QuestService {
  constructor(
    private authService: AuthService,
    private googleVisionService: GoogleVisionService
  ) {}

  async create(payload: CreateQuestRequest) {
    return Quest.create({
      title: payload.title,
      imageId: payload.imageId,
      poiId: payload.poiId,
      label: payload.label,
    })
  }

  async update(id: number, payload: UpdateQuestRequest) {
    const quest = await Quest.findOrFail(id)

    quest.merge({
      title: payload.title,
    })

    await quest.save()

    return quest
  }

  async index(payload: PaginateRequest) {
    return Quest.query().paginate(payload.page, payload.perPage)
  }

  async show(id: number) {
    return Quest.findOrFail(id)
  }

  async delete(id: number) {
    const quest = await Quest.findOrFail(id)

    await quest.delete()
  }

  async validate(id: number, file: UploadFile) {
    const quest = await Quest.findOrFail(id)

    const user = this.authService.getAuthenticatedUser()

    if (quest.done) {
      throw new Exception('Quest already done', { status: 400 })
    }

    const labels = await this.googleVisionService.labelDetection(file)

    if (!labels?.includes(quest.label)) {
      return false
    }

    user.score += 50
    await user.save()

    user.related('quests').attach([quest.id])

    return true
  }
}
