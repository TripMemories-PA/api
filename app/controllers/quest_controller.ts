import FileService from '#services/file_service'
import GoogleVisionService from '#services/google_vision_service'
import QuestService from '#services/quest_service'
import { indexQuestValidator } from '#validators/quest/index_quest_validator'
import { storeQuestImageValidator } from '#validators/quest/store_quest_image_validator'
import { storeQuestValidator } from '#validators/quest/store_quest_validator'
import { updateQuestValidator } from '#validators/quest/update_quest_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class QuestController {
  constructor(
    protected questService: QuestService,
    protected fileService: FileService,
    protected googleVisionService: GoogleVisionService
  ) {}

  async storeImage({ response, request }: HttpContext) {
    const { file } = await request.validateUsing(storeQuestImageValidator)

    const uploadedFile = await this.fileService.store(file)
    const labels = await this.googleVisionService.labelDetection(uploadedFile)

    return response.created({ file: uploadedFile.toJSON(), labels })
  }

  async store({ response, request }: HttpContext) {
    const payload = await request.validateUsing(storeQuestValidator)

    const quest = await this.questService.create(payload)

    return response.created(quest.toJSON())
  }

  async show({ response, params }: HttpContext) {
    const quest = await this.questService.show(params.id)

    return response.ok(quest.toJSON())
  }

  async delete({ response, params }: HttpContext) {
    await this.questService.delete(params.id)

    return response.noContent()
  }

  async update({ response, request, params }: HttpContext) {
    const payload = await request.validateUsing(updateQuestValidator)

    const quest = await this.questService.update(params.id, payload)

    return response.ok(quest.toJSON())
  }

  async validate({ response, request, params }: HttpContext) {
    const { file } = await request.validateUsing(storeQuestImageValidator)

    const uploadedFile = await this.fileService.store(file)
    const quest = await this.questService.validate(params.id, uploadedFile)

    return response.ok(quest)
  }
}
