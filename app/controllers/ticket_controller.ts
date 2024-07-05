import TicketService from '#services/ticket_service'
import { buyTicketValidator } from '#validators/ticket/buy_ticket_validator'
import { storeTicketValidator } from '#validators/ticket/store_ticket_validator'
import { updateTicketValidator } from '#validators/ticket/update_ticket_validator'
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

  async update({ request, response, params }: HttpContext) {
    let payload = await request.validateUsing(updateTicketValidator)

    const ticket = await this.ticketService.update(params.id, payload)

    return response.ok(ticket.toJSON())
  }

  async show({ response, params }: HttpContext) {
    const ticket = await this.ticketService.show(params.id)

    return response.ok(ticket.toJSON())
  }

  async delete({ response, params }: HttpContext) {
    await this.ticketService.delete(params.id)

    return response.noContent()
  }

  async buy({ request, response, auth }: HttpContext) {
    const { tickets } = await request.validateUsing(buyTicketValidator)

    const paymentIntent = await this.ticketService.buy(auth.user!.id, tickets)

    return response.ok({
      paymentIntent: paymentIntent.client_secret,
    })
  }

  async webhook({ request, response }: HttpContext) {
    await this.ticketService.webhook(request.body())

    return response.noContent()
  }
}
