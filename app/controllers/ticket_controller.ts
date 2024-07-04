import TicketService from '#services/ticket_service'
import { storeTicketValidator } from '#validators/ticket/store_ticket_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class TicketController {
  constructor(private ticketService: TicketService) {}

  async store({ request, response, auth }: HttpContext) {
    let payload = await request.validateUsing(storeTicketValidator)

    const ticket = await this.ticketService.create({
      ...payload,
      poiId: auth.user!.poiId,
    })

    return response.created(ticket.toJSON())
  }
}
