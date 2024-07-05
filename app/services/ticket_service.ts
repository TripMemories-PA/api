import Ticket from '#models/ticket'
import { inject } from '@adonisjs/core'
import { CreateTicketRequest } from '../types/requests/ticket/create_ticket_request.js'
import { UpdateTicketRequest } from '../types/requests/ticket/update_ticket_request.js'
import AuthService from './auth_service.js'
import StripeService from './stripe_service.js'
import UserTicket from '#models/user_ticket'
import { randomUUID } from 'node:crypto'

@inject()
export default class TicketService {
  constructor(
    private authService: AuthService,
    private stripeService: StripeService
  ) {}

  async create(payload: CreateTicketRequest) {
    return await Ticket.create({
      title: payload.title,
      description: payload.description,
      quantity: payload.quantity,
      price: payload.price * 100,
      groupSize: payload.groupSize,
      poiId: payload.poiId,
    })
  }

  async show(id: number) {
    return await Ticket.query().where('id', id).where('available', true).firstOrFail()
  }

  async indexPoiTickets(poiId: number) {
    return await Ticket.query().where('poiId', poiId).where('available', true).exec()
  }

  async delete(id: number) {
    const ticket = await Ticket.query().where('id', id).where('available', true).firstOrFail()

    const user = this.authService.getAuthenticatedUser()

    if (ticket.poiId !== user.poiId) {
      throw new Error('You are not authorized to delete this ticket')
    }

    ticket.available = false
    await ticket.save()
  }

  async update(id: number, payload: UpdateTicketRequest) {
    const ticket = await Ticket.query().where('id', id).where('available', true).firstOrFail()

    const user = this.authService.getAuthenticatedUser()

    if (ticket.poiId !== user.poiId) {
      throw new Error('You are not authorized to update this ticket')
    }

    ticket.merge({
      title: payload.title ?? ticket.title,
      description: payload.description ?? ticket.description,
      quantity: payload.quantity ?? ticket.quantity,
      price: payload.price ? payload.price * 100 : ticket.price,
      groupSize: payload.groupSize ?? ticket.groupSize,
    })

    return await ticket.save()
  }

  async buy(userId: number, ticketIds: number[]) {
    const tickets = await Ticket.query().whereIn('id', ticketIds).where('available', true).exec()
    const totalPrice = ticketIds.reduce((acc, ticketId) => {
      const ticket = tickets.find((element) => element.id === ticketId)!
      return acc + ticket.price
    }, 0)

    const customerId = await this.stripeService.getCustomerId(userId)
    const paymentIntent = await this.stripeService.createPaymentIntent(totalPrice, customerId)

    ticketIds.forEach(async (ticketId) => {
      await UserTicket.create({
        piId: paymentIntent.id,
        qrCode: randomUUID(),
        ticketId,
        userId,
        price: tickets.find((ticket) => ticket.id === ticketId)!.price,
      })
    })

    return paymentIntent
  }

  async webhook(payload: any) {
    if (payload.type === 'payment_intent.succeeded') {
      const paymentIntent = payload.data.object

      const userTickets = await UserTicket.query().where('piId', paymentIntent.id).exec()

      userTickets.forEach(async (userTicket) => {
        userTicket.paid = true
        await userTicket.save()
      })
    }
  }

  async indexUserTickets(userId: number) {
    return await UserTicket.query().where('userId', userId).where('paid', true).exec()
  }
}
