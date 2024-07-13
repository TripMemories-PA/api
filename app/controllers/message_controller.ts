import MessageService from '#services/message_service'
import { indexMessageValidator } from '#validators/message/index_message_validator'
import { storeMessageValidator } from '#validators/message/store_message_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class MessageController {
  constructor(protected messageService: MessageService) {}

  async storeMeetMessage({ request, response, auth, params }: HttpContext) {
    const payload = await request.validateUsing(storeMessageValidator)

    const meetId = params.id
    const senderId = auth.user!.id

    const createdMessage = await this.messageService.createMeetMessage(
      meetId,
      senderId,
      payload.content
    )

    return response.created(createdMessage.toJSON())
  }

  async indexMeetMessages({ response, request, params }: HttpContext) {
    const payload = await request.validateUsing(indexMessageValidator)
    const meetId = params.id

    const messages = await this.messageService.indexMeetMessages(meetId, payload)

    return response.ok(messages.toJSON())
  }

  async storePrivateMessage({ request, response, auth, params }: HttpContext) {
    const payload = await request.validateUsing(storeMessageValidator)

    const senderId = auth.user!.id
    const receiverId = params.id

    const createdMessage = await this.messageService.createPrivateMessage(
      senderId,
      receiverId,
      payload.content
    )

    return response.created(createdMessage.toJSON())
  }

  async indexPrivateMessages({ response, request, params }: HttpContext) {
    const payload = await request.validateUsing(indexMessageValidator)
    const receiverId = params.id

    const messages = await this.messageService.indexPrivateMessages(receiverId, payload)

    return response.ok(messages.toJSON())
  }
}
